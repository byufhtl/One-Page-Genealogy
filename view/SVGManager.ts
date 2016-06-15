///<reference path="IViewManager.ts"/>
///<reference path="IBoxRender.ts"/>
///<reference path="boxStyles/BasicSVGBox.ts"/>
///<reference path="../js/jsDeclarations.ts"/>
///<reference path="IGraphicObject.ts"/>
///<reference path="SVGGraphicObject.ts"/>
///<reference path="../util/Point.ts"/>
///<reference path="ElementManager.ts"/>
///<reference path="LineManager.ts"/>
/**
 * Created by curtis on 3/10/15.
 */
class SVGManager implements IViewManager {

    private svgRoot;
    private mainSvg;
    private linePath;
    private svgLoading;
    private svgPercent;
    private rect;
    private boundingRect;
    private graphicObject: SVGGraphicObject;
    private ruler;
    private rulerSet : boolean;
    private rulerTextContainer;

    private height: number;
    private width: number;
    private translationX: number;
    private translationY: number;
    private lastBoxes: BoxMap;
    private elements: {};

    private rotation: number;
    private scale: number;
    private autopan: boolean;

    private zoomEnabled: boolean = true;

    private elementManager: ElementManager;
    private lineManager: LineManager;
    private refreshTriggered: boolean;

    private hammers: any[];

    constructor(svgElementId:string) {
        this.rulerSet = false;
        this.graphicObject = new SVGGraphicObject();

        var svg =  document.getElementById(svgElementId);
        this.mainSvg = svg;
        this.hammers = [];

        //this is dangerous to just kill all listeners.
        $(svg).off();
        $(window).off();

        var self = this;

        this.rulerTextContainer = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.rulerTextContainer.setAttribute('fill', '#d2a779');

        this.svgRoot = document.createElementNS("http://www.w3.org/2000/svg", "g");
        svg.appendChild(this.svgRoot);

        this.configureMouse(self, svg);
        this.startLoadingAnimation();

        // the path used to generate the lines.
        this.linePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        this.svgRoot.appendChild(this.linePath);

        this.elementManager = new ElementManager(this.svgRoot, this.graphicObject);
        this.lineManager = new LineManager();

        this.boundingRect = null;
        this.elements = {};

        this.translationX = 0;
        this.translationY = 0;
        this.rotation = 0;
        this.scale = 1;
        this.autopan = true;
        this.boundingRect = svg.getBoundingClientRect();
        this.width = this.boundingRect.right - this.boundingRect.left;
        this.height = this.boundingRect.bottom - this.boundingRect.top;
        this.refreshTriggered = false;

        $(window).resize(function() {
            self.boundingRect = svg.getBoundingClientRect();
            self.refresh(self.lastBoxes);

            self.width = self.boundingRect.right - self.boundingRect.left;
            self.height = self.boundingRect.bottom - self.boundingRect.top;
        });

        this.initChartButtons(self);
    }

    private configureMouse(self, svg){
        var countryLegend = $("#country-legend");
        var modals = $("div.modal");
        var gedcomModal = $("#gedcomModal");

        countryLegend.mouseenter(function() {self.zoomEnabled = false;});
        countryLegend.mouseleave(function() {self.zoomEnabled = true;});
        modals.mouseenter(function() {self.zoomEnabled = false;});
        modals.mouseleave(function() {self.zoomEnabled = true;});
        gedcomModal.mouseenter(function() {self.zoomEnabled = false;});
        gedcomModal.mouseleave(function() {self.zoomEnabled = true;});

        var getMousePos = function(container, evt) {
            var rect = self.boundingRect;
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        };

        $(window).mousewheel(function(event){
            var pt = getMousePos(svg, event);
            self.graphicObject.fireScale(event.deltaY, self.viewToWorld(new Point(pt.x, pt.y)));
        });

        var getHammerPosition = function(container, pt) {
            if(!self.boundingRect) {
                self.boundingRect = container.getBoundingClientRect();
            }

            return {
                x: pt.x - self.boundingRect.left,
                y: pt.y - self.boundingRect.top
            };
        };

        var hammer = new Hammer(svg);
        this.hammers.push(hammer);
        var pan = hammer.add( new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }) );
        var pinch = new Hammer.Pinch();

        //console.log("creating listener");
        hammer.add([pan, pinch]);

        hammer.on('panmove', function(ev) {
            ev.preventDefault();
            drag(getHammerPosition(svg, ev.center));
        });
        hammer.on('panend pancancel', function(ev) {
            endDrag(getHammerPosition(svg, ev.center), ev.velocityX, ev.velocityY);
        });
        hammer.on('panstart', function(ev) {
            startDrag(getHammerPosition(svg, ev.center))
        });
        hammer.on('tap', function(ev) {
            ev.preventDefault();
            var pt = getHammerPosition(svg, ev.center);
            self.graphicObject.fireClickPt(self.viewToWorld(new Point(pt.x, pt.y)));
        });
        var pt1 = null;
        var pt2 = null;
        var dx = 0;
        var dy = 0;

        function startDrag(pt) {
            pt1 = pt;

            self.graphicObject.fireStartDrag(self.viewToWorld(new Point(pt.x, pt.y)));
        }
        function drag(pt) {
            pt2 = pt1;
            pt1 = pt;

            var p1:Point = new Point(pt1.x, pt1.y);
            var p2:Point = new Point(pt2.x, pt2.y);

            self.graphicObject.fireTranslate(self.viewToWorld(p1), self.viewToWorld(p2));
        }
        function endDrag(pt, vx, vy) {
            pt2 = null;
            pt1 = null;

            self.graphicObject.fireEndDrag(self.viewToWorld(new Point(pt.x, pt.y)));
        }
    }

    private startLoadingAnimation(){
        // The Loading Spinner
        this.svgLoading = document.createElementNS("http://www.w3.org/2000/svg", "image");
        this.svgLoading.setAttribute('height','500');
        this.svgLoading.setAttribute('width','500');
        this.svgLoading.setAttribute('x', '50%');
        this.svgLoading.setAttribute('transform', 'translate(-250)');
        this.svgLoading.setAttributeNS('http://www.w3.org/1999/xlink','href','images/loading.gif');
        this.svgRoot.appendChild(this.svgLoading);

        // The loading rectangle
        this.rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.rect.setAttribute("width", "100");
        this.rect.setAttribute("height", "100");
        this.rect.setAttribute("fill", "none");
        this.rect.setAttribute("id", "percentRect");
        this.rect.setAttribute("x", "50%");
        this.rect.setAttribute("transform", "translate(-50)");
        this.rect.setAttribute("y", "200");
        this.svgRoot.appendChild(this.rect);

        // the loading message that details progress of the loading.
        this.svgPercent = document.createElementNS("http://www.w3.org/2000/svg", "text");
        var text = document.createTextNode("");
        this.svgPercent.appendChild(text);
        this.svgPercent.setAttribute('id', 'svgPercent');
        this.svgPercent.setAttribute('x', '50%');
        this.svgPercent.setAttribute("transform", "translate(-50)");
        this.svgPercent.setAttribute('y', '260');
        this.svgPercent.setAttribute('font-size', '50px');
        this.svgRoot.appendChild(this.svgPercent);
    }

    private initChartButtons(self){
        $('#zoom-out-button').click(() =>{
            var rect = self.boundingRect;
            var x = window.innerWidth/2 - rect.left;
            var y = window.innerHeight/2 - rect.top;
            self.graphicObject.fireScale(-1, self.viewToWorld(new Point(x,y)));
        });
        $('#zoom-in-button').click(() =>{
            var rect = self.boundingRect;
            var x = window.innerWidth/2 - rect.left;
            var y = window.innerHeight/2 - rect.top;
            self.graphicObject.fireScale(1, self.viewToWorld(new Point(x,y)));
        });
        $('#pan-invert-button').click(() => {
            $('#pan-invert-button').toggleClass("btn-pad btn-pad-white");
            this.autopan = !this.autopan;
        });
        $('#pan-up-button').click(() => {
            var rect = self.boundingRect;
            var x = window.innerWidth/2 - rect.left;
            var y = window.innerHeight/2 - rect.top;
            if(this.autopan) {
                self.graphicObject.fireTranslate(self.viewToWorld(new Point(x, y)), self.viewToWorld(new Point(x, y - 40)));
            }
            else{
                self.graphicObject.fireTranslate(self.viewToWorld(new Point(x, y)), self.viewToWorld(new Point(x, y + 40)));
            }
        });
        $('#pan-right-button').click(() => {
            var rect = self.boundingRect;
            var x = window.innerWidth/2 - rect.left;
            var y = window.innerHeight/2 - rect.top;
            if(this.autopan) {
                self.graphicObject.fireTranslate(self.viewToWorld(new Point(x, y)), self.viewToWorld(new Point(x + 40, y)));
            }
            else{
                self.graphicObject.fireTranslate(self.viewToWorld(new Point(x, y)), self.viewToWorld(new Point(x - 40, y)));
            }
        });
        $('#pan-left-button').click(() => {
            var rect = self.boundingRect;
            var x = window.innerWidth/2 - rect.left;
            var y = window.innerHeight/2 - rect.top;
            if(this.autopan) {
                self.graphicObject.fireTranslate(self.viewToWorld(new Point(x, y)), self.viewToWorld(new Point(x - 40, y)));
            }
            else{
                self.graphicObject.fireTranslate(self.viewToWorld(new Point(x, y)), self.viewToWorld(new Point(x + 40, y)));
            }
        });
        $('#pan-down-button').click(() => {
            var rect = self.boundingRect;
            var x = window.innerWidth/2 - rect.left;
            var y = window.innerHeight/2 - rect.top;
            if(this.autopan) {
                self.graphicObject.fireTranslate(self.viewToWorld(new Point(x, y)), self.viewToWorld(new Point(x, y + 40)));
            }
            else{
                self.graphicObject.fireTranslate(self.viewToWorld(new Point(x, y)), self.viewToWorld(new Point(x, y - 40)));
            }
        });
        $('#recenter-button').click(() => {

        });
    }

    refresh(boxes: BoxMap): IGraphicObject {
        //this.drawLine(boxes);
        //this.drawBoxes(boxes);
        this.lastBoxes = boxes;
        this.triggerRefresh();
        return this.graphicObject;
    }

    private triggerRefresh() {
        //THIS IS GOOD FOR DEBUGGING WHEN YOU DON'T TO HAVE
        //A FRAME RATE
        //
        var self = this;
        if(!this.refreshTriggered) {
            window.requestAnimationFrame(function(time){
                self.realRefresh();
                this.refreshTriggered = true;
            });
        }
        else {
            this.refreshTriggered = false;
        }
    }

    private realRefresh(): void {
        //if none exists, show the loading gif
        if(this.lastBoxes && this.lastBoxes.getRoot() !== null && this.lastBoxes.getRoot() !== undefined && this.svgLoading){
            this.svgRoot.removeChild(this.svgLoading);
            this.svgRoot.removeChild(this.rect);
            this.svgRoot.removeChild(this.svgPercent);
            this.svgLoading = null;
            this.rect = null;
            this.svgPercent = null;
            $("#opg-chart").css("width", "100%");
            $("#opg-chart").css("height", "94%");
            $("#utils").css("display", "none");
        }
        this.drawLine(this.lastBoxes);
        this.drawBoxes(this.lastBoxes);
        //document.getElementById('chart-dimensions').innerHTML =
        //    "(" + String(document.getElementById("opg-chart").getAttribute('width')) + ", " +
        //        String(document.getElementById("opg-chart").getAttribute("height")) + ")";

        if(this.rulerSet) {
            this.updateRuler();
        }
    }

    private updateRuler(){

        var originalHeight = $('#ruler-original-height').val();
        var height = $('#ruler-height').val() * 72;
        var ratio = height/originalHeight;

        for(var index in this.ruler.childNodes){
            if(this.ruler.childNodes.hasOwnProperty(index)){
                var child = this.ruler.childNodes[index];
                var x = index*36*this.scale/ratio;
                child.setAttribute('x1', x);
                child.setAttribute('x2', x);
            }
        }

        for(var index in this.rulerTextContainer.childNodes){
            if(this.rulerTextContainer.childNodes.hasOwnProperty(index)){
                var child = this.rulerTextContainer.childNodes[index];
                var x = index*360*this.scale/ratio + 5;
                child.setAttribute('x', x);
            }
        }
    }

    public setRuler(){
        this.ruler = document.getElementById("ruler");
        if(this.ruler === null) {
            this.ruler = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            this.ruler.setAttribute('id', 'ruler');
        }
        var originalHeight = $('#ruler-original-height').val();
        var height = $('#ruler-height').val() * 72;
        var ratio = height/originalHeight;

        if(this.ruler.childNodes.length === 0) {
            for (var i = 0; i < 1000; i++) {
                var inch = document.createElementNS("http://www.w3.org/2000/svg", "line");
                inch.setAttribute("x1", String(i * 72 / ratio));
                inch.setAttribute('y1', "0");
                inch.setAttribute("x2", String(i * 72 / ratio));
                inch.setAttribute("y2", "30");
                inch.setAttribute("style", "stroke:rgb(20,20,20); stroke-width:2");
                this.ruler.appendChild(inch);

                if(i % 5 === 0){
                    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    var num = document.createTextNode(String(i));
                    text.setAttribute('x', String(i*72/ratio + 5));
                    text.setAttribute('y', "30");
                    text.setAttribute('fill', 'black');
                    text.appendChild(num);
                    this.rulerTextContainer.appendChild(text);
                }

                var halfInch = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                halfInch.setAttribute("x1", String((i) * 72 / ratio + 36));
                halfInch.setAttribute('y1', "0");
                halfInch.setAttribute("x2", String(i * 72 / ratio + 36));
                halfInch.setAttribute("y2", "10");
                halfInch.setAttribute("style", "stroke:rgb(20,20,20); stroke-width:1");
                this.ruler.appendChild(halfInch);
            }
        }
        this.rulerSet = true;
        //this.mainSvg.appendChild(this.rulerTextContainer);
        this.ruler.appendChild(this.rulerTextContainer);
        this.mainSvg.appendChild(this.ruler);
        this.realRefresh();
    }

    private drawBoxes(boxes: BoxMap): void {
        if(!boxes){return;}
        var self = this;
        var rootId: string = boxes.getRoot();
        var queue: string[] = [];

        var tx: number = this.translationX;
        var ty: number = this.translationY;

        var topLeft = this.viewToWorld(new Point(0,0));
        var bottomRight = this.viewToWorld(new Point(this.width, this.height));

        this.elementManager.setBounds(topLeft.getX(), topLeft.getY(), bottomRight.getX(), bottomRight.getY());

        queue.push(rootId);
        while(queue.length > 0) {
            var box:IBox = boxes.getId(queue.shift());
            var node:INode = box.getNode();
            var branchIds = node.getBranchIds();

            this.elementManager.requestElement(box);

            if(box.isCollapsed()) {
                continue;
            }

            for (var i:number = 0; i < branchIds.length; i++) {
                var branchBox:IBox = boxes.getId(branchIds[i]);
                if (!branchBox) {
                    continue;
                }
                queue.push(branchIds[i]);
            }
        }
        this.elementManager.clearUnusedElement();

        this.resetTransformation();
    }

    private drawLine(boxes: BoxMap): void {

        var tx: number = this.translationX;
        var ty: number = this.translationY;

        var topLeft = this.viewToWorld(new Point(0,0));
        var bottomRight = this.viewToWorld(new Point(this.width, this.height));

        this.lineManager.setBounds(topLeft.getX(), topLeft.getY(), bottomRight.getX(), bottomRight.getY());

        var d = this.lineManager.requestLineString(boxes);

        this.linePath.setAttribute('stroke','black');
        this.linePath.setAttribute('fill','none');
        this.linePath.setAttribute('d', d);
    }

    private resetTransformation() {
        var tx: number = this.translationX;
        var ty: number = this.translationY;
        var transform = [];

        var bbox = this.svgRoot.getBBox();

        //These happen in reverse
        transform.push('rotate('+this.rotation * 180 / Math.PI+')');
        transform.push('scale('+this.scale+')');
        transform.push('translate('+(-tx)+','+(-ty)+')');

        this.svgRoot.setAttribute("transform", transform.join(' '));

    }

    setTranslation(x:number, y:number): void {
        this.translationX += x;
        this.translationY += y;
        this.refresh(this.lastBoxes);
    }

    setScale(s: number, pt:Point): void {
        if(this.zoomEnabled && (!($("#opg-modal").data('bs.modal') || {}).isShown) &&
            (this.scale > .05 || s > 1) && (this.scale < 20 || s < 1)) {

            var viewBefore:Point = this.worldToView(pt);
            this.scale *= s;
            var worldAfter:Point = this.viewToWorld(viewBefore);

            var dx = worldAfter.getX() - pt.getX();
            var dy = worldAfter.getY() - pt.getY();

            this.translationX -= dx;
            this.translationY -= dy;

            this.refresh(this.lastBoxes);
        }
    }

    setSize(width: number, height: number): void {
        this.width = width;
        this.height = height;
        this.boundingRect = this.svgRoot.getBoundingClientRect();
        this.refresh(this.lastBoxes);
    }

    private toCenterPoint(box:IBox):any {
        return {
            getX: function() {
                return box.getX() + box.getWidth()/2;
            },
            getY: function() {
                return box.getY() + box.getHeight()/2;
            }
        }
    }

    centerOnBox(box: IBox){
        var boxCenter = this.toCenterPoint(box);

        // Reset the translation to the box center.
        this.translationX = boxCenter.getX();
        this.translationY = boxCenter.getY();

        var width = this.width/2;
        var height = this.height/2;

        var rotatedPt = this.rotatePt(new Point(width, height), this.rotation);
        var rotation_index = (this.rotation * 2 / Math.PI);

        var multiplier = (rotation_index % 2 == 0) ? -1 : 1;

        var width = multiplier*rotatedPt.getX()/this.scale;
        var height = multiplier*rotatedPt.getY()/this.scale;

        this.setTranslation(width, height);
    }

    reCenter(boxMap: BoxMap){
        var box = boxMap.getId(boxMap.getRoot());
        if(box){
            this.centerOnBox(box);
        }
    }

    viewToWorld(pt: Point): Point {

        pt = this.rotatePt(pt, -this.rotation);
        pt = this.scalePt(pt, 1.0/this.scale);

        pt = this.translate(pt, this.translationX, this.translationY);

        return pt;
    }

    worldToView(pt: Point): Point {

        pt = this.translate(pt, -this.translationX, -this.translationY);

        pt = this.scalePt(pt, this.scale);
        pt = this.rotatePt(pt, this.rotation);

        return pt;
    }

    translate(pt: Point, dx: number, dy: number): Point {
        return new Point(pt.getX()+dx, pt.getY()+dy);
    }

    rotatePt(pt: Point, r:number): Point {
        var s = Math.sin(r);
        var c = Math.cos(r);
        return new Point(c*pt.getX()-s*pt.getY(), s*pt.getX()+c*pt.getY());
    }

    scalePt(pt: Point, s: number) {
        return new Point(pt.getX()*s, pt.getY()*s);
    }

    rotate(r: number): void {
        var viewBefore: Point = new Point(this.width/2, this.height/2);//this.worldToView(pt);
        var pt: Point = this.viewToWorld(viewBefore);
        this.rotation = (this.rotation + r % (Math.PI*2)) % (Math.PI * 2);
        var worldAfter: Point = this.viewToWorld(viewBefore);

        var dx = worldAfter.getX() - pt.getX();
        var dy = worldAfter.getY() - pt.getY();

        this.translationX -= dx;
        this.translationY -= dy;

        this.refresh(this.lastBoxes);
    }

    getSVGString(): any {

        $("body").css("cursor", "progress");

        var rulerDisplay = $('#ruler').css('display');
        $('#ruler').remove();

        var defer = $.Deferred();

        this.elementManager.setIgnoreBound(true);
        this.lineManager.setIgnoreBound(true);

        var tx = this.translationX;
        var ty = this.translationY;
        var sc = this.scale;
        var ro = this.rotation;


        this.translationX = -100;
        this.translationY = -100;
        this.scale = 1;
        this.rotation = 0;



        this.realRefresh();

        var self = this;

        var counter = 0;
        var total = 0;
        var repeatCallBack = function() {
            counter++;
            if(counter >= total) {
                $("body").css("cursor", "default");
                var s = new XMLSerializer();
                self.elementManager.setIgnoreBound(true);
                self.lineManager.setIgnoreBound(true);
                var tx = self.translationX;
                var ty = self.translationY;
                var sc = self.scale;
                var ro = self.rotation;
                self.realRefresh();
                var bbox = self.svgRoot.getBBox();

                //self.translationX = -100;
                //self.translationY = -100;
                //self.scale = 1;
                //self.rotation = 0;
                //self.realRefresh();
                self.translationX = -100 + bbox.x;
                self.translationY = -100 + bbox.y;

                self.mainSvg.setAttribute("width", bbox.width + 200);
                self.mainSvg.setAttribute("height", bbox.height + 200);
                self.realRefresh();

                var data = s.serializeToString(self.mainSvg);
                //console.log(data);

                defer.resolve(data);

                self.translationX = tx;
                self.translationY = ty;
                self.scale = sc;
                self.rotation = ro;


                self.elementManager.setIgnoreBound(false);
                self.lineManager.setIgnoreBound(false);
                self.realRefresh();


            }
        };
        var queue = [];
        var rootId = this.lastBoxes.getRoot();
        var boxes: BoxMap = this.lastBoxes;
        queue.push(rootId);
        while(queue.length > 0) {
            var box:IBox = boxes.getId(queue.shift());
            if(!box) {
                continue;
            }
            var node:INode = box.getNode();
            var branchIds = node.getBranchIds();

            //if(BoxStyleFactory.requiresLoad(box.getType())) { // deprecated code?
                if (node.hasAttr('doneLoading')) {
                    total++;
                }
            //}

            if(box.isCollapsed()) {
                continue;
            }

            for (var i:number = 0; i < branchIds.length; i++) {
                var branchBox:IBox = boxes.getId(branchIds[i]);
                if (!branchBox) {
                    continue;
                }
                queue.push(branchIds[i]);
            }
        }

        queue.push(rootId);
        while(queue.length > 0) {
            var box:IBox = boxes.getId(queue.shift());
            if(!box) {
                continue;
            }
            var node:INode = box.getNode();
            var branchIds = node.getBranchIds();

            //if(box.getType() === 'simpleNameBox') {
            //if(BoxStyleFactory.requiresLoad(box.getType())) { // deprecated code?
                if (node.hasAttr('doneLoading')) {
                    node.getAttr('doneLoading').then(repeatCallBack, repeatCallBack);
                }
            //}


            if(box.isCollapsed()) {
                continue;
            }

            for (var i:number = 0; i < branchIds.length; i++) {
                var branchBox:IBox = boxes.getId(branchIds[i]);
                if (!branchBox) {
                    continue;
                }
                queue.push(branchIds[i]);
            }
        }
        if(total === 0) {
            setTimeout(repeatCallBack, 0);
        }

        this.translationX = tx;
        this.translationY = ty;
        this.scale = sc;
        this.rotation = ro;

        this.elementManager.setIgnoreBound(false);
        this.lineManager.setIgnoreBound(false);

        if(rulerDisplay !== undefined && rulerDisplay !== 'none'){
            this.setRuler();
        }

        this.realRefresh();


        return defer.promise();
    }

    public getRotation(){
        return this.rotation;
    }

    destroy(){
        for(var i = 0; i < this.hammers.length; ++i){
            var hammer = this.hammers[i];
            hammer.off('tap');
            hammer.stop();
            hammer.destroy();
        }
    }
}