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
    private renders:{[s:string]:IBoxRender;};
    private boundingRect;
    private graphicObject: SVGGraphicObject;

    private height: number;
    private width: number;
    private translationX: number;
    private translationY: number;
    private lastBoxes: BoxMap;
    private elements: {};

    private rotation: number;
    private scale: number;

    private elementManager: ElementManager;
    private lineManager: LineManager;
    private refreshTriggered: boolean;

    constructor(svgElementId:string) {
        this.graphicObject = new SVGGraphicObject();

        var svg =  document.getElementById(svgElementId);
        this.mainSvg = svg;

        //this is dangerous to just kill all listeners.
        $(svg).off();
        $(window).off();

        this.svgRoot = document.createElementNS("http://www.w3.org/2000/svg", "g");
        svg.appendChild(this.svgRoot);

        this.linePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        this.svgRoot.appendChild(this.linePath);

        this.elementManager = new ElementManager(this.svgRoot, this.graphicObject);
        this.lineManager = new LineManager();

        var self = this;
        this.boundingRect = null;
        this.elements = {};

        this.translationX = 0;
        this.translationY = 0;
        this.rotation = 0;
        this.scale = 1;
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
        $(window).mousewheel(function(event){
            var pt = getMousePos(svg, event);
            self.graphicObject.fireScale(event.deltaY, self.viewToWorld(new Point(pt.x, pt.y)));
        });
        var getMousePos = function(container, evt) {
            var rect = self.boundingRect;
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        };
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
        var pan = hammer.add( new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }) );
        var pinch = new Hammer.Pinch();

        console.log("creating listener");
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
        var pt1 = null;
        var pt2 = null;
        var dx = 0;
        var dy = 0;

        function startDrag(pt) {
            pt1 = pt;


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
        }
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
        this.drawLine(this.lastBoxes);
        this.drawBoxes(this.lastBoxes);
    }


    private drawBoxes(boxes: BoxMap): void {
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
    private drawLine(boxes: BoxMap): void {

        var tx: number = this.translationX;
        var ty: number = this.translationY;

        var topLeft = this.viewToWorld(new Point(0,0));
        var bottomRight = this.viewToWorld(new Point(this.width, this.height));

        this.lineManager.setBounds(topLeft.getX(), topLeft.getY(), bottomRight.getX(), bottomRight.getY());

        var d = this.lineManager.requestLineString(boxes);

        this.linePath.setAttribute('stroke','black');
        this.linePath.setAttribute('d', d);
    }
    private resetTransformation() {
        var tx: number = this.translationX;
        var ty: number = this.translationY;
        var transform = [];

        //do these happen backwards??? they don't match my view to world trasformations
        transform.push('rotate('+this.rotation * 180 / Math.PI+')');
        transform.push('scale('+1/this.scale+')');
        transform.push('translate('+tx+','+ty+')');

        this.svgRoot.setAttribute("transform", transform.join(','));
    }
    setTranslation(x:number, y:number): void {
        this.translationX = x;
        this.translationY = y;
        this.refresh(this.lastBoxes);
    }
    setScale(s: number): void {
        this.scale = s;
        this.refresh(this.lastBoxes);
    }
    setSize(width: number, height: number): void {
        this.width = width;
        this.height = height;
        this.boundingRect = this.svgRoot.getBoundingClientRect();
        this.refresh(this.lastBoxes);
    }
    viewToWorld(pt: Point): Point {

        pt = this.scalePt(pt, this.scale);
        pt = this.rotatePt(pt, -this.rotation);
        pt = this.translate(pt, -this.translationX, -this.translationY);

        return pt;
    }
    worldToView(pt: Point): Point {

        pt = this.rotatePt(pt, this.rotation);
        pt = this.scalePt(pt, 1.0 / this.scale);
        pt = this.translate(pt, this.translationX, this.translationY);

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
        this.rotation += r % (Math.PI*2);
        this.refresh(this.lastBoxes);
    }
    getSVGString(): string {
        this.elementManager.setIgnoreBound(true);
        this.lineManager.setIgnoreBound(true);
        this.realRefresh();

        var s = new XMLSerializer();

        var data = s.serializeToString(this.mainSvg);

        this.elementManager.setIgnoreBound(true);
        this.lineManager.setIgnoreBound(true);
        this.realRefresh();

        return data;
    }
}