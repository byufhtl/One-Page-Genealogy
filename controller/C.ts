///<reference path="IOptionListener.ts"/>
///<reference path="../view/IViewManager.ts"/>
///<reference path="../view/IGraphicObjectListener.ts"/>
///<reference path="../ISource.ts"/>
///<reference path="../model/ITree.ts"/>
///<reference path="../view/IGraphicObject.ts"/>
///<reference path="../sources/FakeSource.ts"/>
///<reference path="../view/MainViewManager.ts"/>
///<reference path="../model/Tree.ts"/>
///<reference path="../sources/FamilySearchSource.ts"/>
///<reference path="OptionManager.ts"/>
///<reference path="../sources/FSAncestryDownloader.ts"/>
///<reference path="../sources/FSFullTreeDownloader.ts"/>
///<reference path="P.ts"/>
///<reference path="../sources/GedcomDownloader.ts"/>
///<reference path="../sources/GedcomNode.ts"/>

/**
 * Created by curtis on 3/11/15.
 */
class C implements IGraphicObjectListener, IOptionListener {

    private source:ISource;
    public dscOrAsc:string;
    private tree:ITree;
    private p:P;
    private viewManager:IViewManager;
    //private optionListener: IOptionListener;
    private graphicObject:IGraphicObject;
    private dx:number;
    private dy:number;
    private optionManager:OptionManager;
    private boxes:BoxMap;
    private scaleFactor:number;
    private greyscale:boolean;

    private anchorPt:Point;
    private anchorId:string;


    constructor(data) {

        //console.log(data);
        var rootId:string = data.rootId;
        this.dscOrAsc = data.dscOrAsc
        this.source = null;
        var generations:number = data.generations;
        if (data.hasOwnProperty("gedData")) {
            var attemptGed = data.gedData;
            this.source = new FSFullTreeDownloader(rootId, generations, null);
            var gedNodes = {};
            for (var key in attemptGed) {
                var branchIds = [];
                //ascendants
                if (attemptGed[key].hasOwnProperty("ascBranchIds") && data.dscOrAsc == "ascendancy") {
                    //var firstFam = attemptGed[key].familyChild[0];
                    var firstFam = this.getBestAscendants(attemptGed, key);
                    branchIds = attemptGed[key].ascBranchIds[firstFam];
                }
                //descendantsbr
                if (attemptGed[key].hasOwnProperty("dscBranchIds") && data.dscOrAsc == "descendancy") {
                    //var firstFam = attemptGed[key].familySpouse[0];
                    if (attemptGed[key].familySpouse.length > 1) {
                        //console.log(attemptGed[key].familySpouse);
                        //console.log(attemptGed[key].dscBranchIds);
                        var firstFam = this.getBestDescendants(attemptGed, key);
                        branchIds = attemptGed[key].dscBranchIds[firstFam];
                    }
                    else {
                        var firstFam = this.getBestDescendants(attemptGed, key);
                        branchIds = attemptGed[key].dscBranchIds[firstFam];
                    }
                }
                if (branchIds == null) {
                    branchIds = [];
                }
                var individual = new GedcomNode(key, attemptGed[key], branchIds);
                gedNodes[key] = individual;
            }
            //console.log(gedNodes)
            //this.source = new GedcomDownloader(attemptGed["latestIndi"], 20, gedNodes);//"oldestIndi" for dsc, "latestIndi" for asc
            //this.source = new GedcomDownloader("@I12154@", 20, gedNodes);//PROFESSOR BARRETT is @I12154@ do @175@ for an ascendant
            this.source = new GedcomDownloader(data.rootId, data.generations, gedNodes, data.dscOrAsc);
        }
        else if (data.hasOwnProperty("file")) {
            this.boxes = data.boxes;
            this.source = undefined;
            this.optionManager = data.optionManager;
            var skipSource = true;
        }
        else {
            //console.log("Making non-gedcom C");
            rootId = data.rootId;
            generations = data.generations;
            this.source = new FSFullTreeDownloader(rootId, generations, data.dscOrAsc);
            //var self = this;
            //this.source.addPercentListener(function(percent){
            //    document.getElementById()
            //});
        }
        this.anchorPt = new Point(10, 10);

        this.tree = new Tree();
        this.p = new P(this);
        this.viewManager = new MainViewManager();
        this.greyscale = false;

        this.dx = 0;
        this.dy = 0;
        this.scaleFactor = 1;

        this.tree.setListener(this.p);

        this.optionManager = data.optionManager;
        this.optionManager.setListener(this);

        this.boxes = null;

        var self = this;

        if(!skipSource) {
            this.source.setListener(this.tree.getSourceListener());
            self.source.start();
        }else{
            this.boxes =  new BoxMap(data.boxes.rootId);
            console.log(data.boxes);
            var self = this;
            this.boxes.deserializeMap(data.boxes.map).then(function() {
                self.p.setMaps(self.boxes);
                var map = self.boxes.getMap();
                for(var box in map){
                    if(map.hasOwnProperty(box)){
                        self.tree.getSourceListener().gotNode(map[box].getNode());
                    }
                }
                //self.p.handleUpdate(self.tree, []);
                self.refresh(self.boxes);
            });
        }
    }

    getBestDescendants(attemptGed, key) {
        if (attemptGed[key].familySpouse.length == 1) {
            return attemptGed[key].familySpouse[0];
        }
        else {
            var bestFam = "";
            var biggest = 0;
            for (var i = 0; i < attemptGed[key].familySpouse.length; i++) {
                var famAttempt = attemptGed[key].familySpouse[i];
                if (attemptGed[key].dscBranchIds.hasOwnProperty(famAttempt)) {
                    if (attemptGed[key].dscBranchIds[famAttempt].length > biggest) {
                        bestFam = famAttempt;
                        biggest = attemptGed[key].dscBranchIds[famAttempt].length;
                    }
                }
            }
            return bestFam;
        }
    }

    getBestAscendants(attemptGed, key) {
        if (attemptGed[key].familyChild.length == 1) {
            return attemptGed[key].familyChild[0];
        }
        else {
            var bestFam = "";
            var biggest = 0;
            for (var i = 0; i < attemptGed[key].familyChild.length; i++) {
                var famAttempt = attemptGed[key].familyChild[i];
                if (attemptGed[key].ascBranchIds.hasOwnProperty(famAttempt)) {
                    var depth = 0;
                    var famAttemptDepth = 0;
                    if (attemptGed[key].ascBranchIds[famAttempt].length > biggest) {
                        bestFam = famAttempt;
                        biggest = attemptGed[key].ascBranchIds[famAttempt].length;
                    }
                }
            }
            return bestFam;
        }
    }

    setViewManager(viewManager:IViewManager):void {
        this.viewManager = viewManager;
    }

    refresh(boxes:BoxMap):void {
        this.boxes = boxes;
        console.log(this.boxes);
        if (!this.anchorId) {
            this.anchorId = this.boxes.getRoot();
        }

        var newBox:IBox = this.boxes.getId(this.anchorId);
        if (newBox) {
            var newAnchor = new Point(newBox.getX(), newBox.getY());
            this.translate(this.anchorPt, newAnchor);
            this.anchorPt = newAnchor;
        }

        this.graphicObject = this.viewManager.refresh(boxes);
        this.graphicObject.setListener(this);

    }

    translate(pt1:Point, pt2:Point):void {

        var dx:number = (pt2.getX() - pt1.getX());
        var dy:number = (pt2.getY() - pt1.getY());

        this.viewManager.setTranslation(dx, dy);
    }

    scale(ds:number, pt:Point):void {
        if (ds > 0) {
            ds = (10.0 / 9.0);
        }
        else {
            ds = (9.0 / 10.0);
        }

        this.viewManager.setScale(ds, pt);
    }

    click(id:string):void {
        if (this.boxes && this.boxes.getId(id)) {
            var box:IBox = this.boxes.getId(id);
            this.optionManager.handleOptionSetting('selectIndividual', {box: box});
        }
    }

    clickPt(pt:Point):void {
        var box:IBox = this.p.handle({type: 'getBoxByPoint', pt: pt});
        if (box) {
            this.anchorId = box.getNode().getId();
            this.anchorPt = new Point(box.getX(), box.getY());
            this.optionManager.handleOptionSetting('selectIndividual', {box: box});
        }
    }

    handleOption(key:string, value:any):void {
        if (key === "collapse-sub-tree") {
            this.p.handle({type: key, id: value.id, box: value.box});
        }
        else if (key === "expand-sub-tree") {
            this.p.handle({type: key, id: value.id, box: value.box});
        }
        else if (key === 'rotate') {
            this.viewManager.rotate(value.value);
        }
        // DON'T GET RID OF THIS COMMENTED CODE!

        // else if(key === 'request-download') {
        //     this.viewManager.getSVGString().then(function(s){
        //         /*var form = document.createElement("form");
        //         form.setAttribute("method", "POST");
        //         form.setAttribute("style", "display:none");
        //         form.setAttribute("id","pdfDownloadForm");
        //         form.setAttribute("action", "http://opg.fhtl.byu/svgtopdf");
        //         var hiddenField = document.createElement("input");
        //         hiddenField.setAttribute("type", "hidden");
        //         hiddenField.setAttribute("id","svg");
        //         hiddenField.setAttribute("name", "svg");
        //         hiddenField.setAttribute("value", s);

        //         form.appendChild(hiddenField);

        //         document.body.appendChild(form);
        //         form.submit();
        //         document.body.removeChild(form);*/
        //         //form.remove();


        //         //var s = this.viewManager.getSVGString();
        //         var fileName = "opg_chart.svg";
        //         var url = "data:image/svg+xml;utf8," + encodeURIComponent(s);
        //         var link:any = document.createElement("a");
        //         link.download = fileName;
        //         link.href = url;
        //         link.click();
        //     });

        // }
        else if (key === 'request-download') {
            this.viewManager.getSVGString().then(function (s) {
                $('<form>', {
                    'action': 'https://opg.fhtl.byu.edu/convert/',
                    'method': 'POST',
                }).append($('<input>', {
                    'name': 'svg',
                    'value': s,
                    'type': 'hidden'
                })).appendTo('body').submit();
            });
        }
        else if (key === 'save'){
             var boxes = JSON.stringify(this.boxes);
             var fileName = "opg_chart.json";
             var url = "data:text+json;utf8," + boxes;
             var link:any = document.createElement("a");
             link.download = fileName;
             link.href = url;
             link.click();
        }
        else if (key === 'ruler'){
            //have user select dimensions and then display ruler
            if($('#ruler-height').val() === "") {
                this.viewManager.getSVGString().then(function (s) {
                    //console.log(s);
                    var wIndex = s.indexOf('width="') + 7;
                    var hIndex = s.indexOf('height="') + 8;
                    var width = s.slice(wIndex, s.indexOf('"', wIndex));
                    var height = s.slice(hIndex, s.indexOf('"', hIndex));
                    $('#ruler-ratio').val(width/height);
                    $('#ruler-original-height').val(height);
                    $('#ruler-height').val((height / 72).toFixed(1));
                    $('#ruler-width').val((width / 72).toFixed(1));
                    $('#rulerModal').modal('show');
                })
            }else{
                $('#rulerModal').modal('show');
            }
        }
        else if (key === 'ruler-save'){
            $('#rulerModal').modal('hide');
            $('#opg-chart').css("height","89%");
            $('#ruler').css('display', 'block');
            this.viewManager.setRuler();
        }
        else if (key === 'detail-style') {
            this.p.handle({type: key});
        }
        else if (key === 'vertical-style') {
            this.p.handle({type: key});
        }
        else if (key === 'eight-eleven-style') {
            this.p.handle({type: key});
        }
        else if (key === 'eight-eleven-detail-style') {
            this.p.handle({type: key});
        }
        else if (key === 'js-public-style') {
            this.p.handle({type: key});
        }
        else if (key === 'to-greyscale') {
            /*if(!this.greyscale)
             this.greyscale = true;
             else
             this.greyscale = false;
             this.p.handle({type: key, greyscale:this.greyscale});*/
            this.p.handle({type: key});
        }
        else if (key === 'to-branch-color') {
            this.p.handle({type: key});
        }
        else if (key === 'to-generation-color') {
            this.p.handle({type: key});
        }
        else if (key === 'to-generation-color-vibrant') {
            this.p.handle({type: key});
        }
        else if (key === 'to-gender-color') {
            this.p.handle({type: key});
        }
        else if (key === 'show-empty'){
            this.p.handle({type: key});
        }
        else if (key === 'show-duplicates'){
            this.p.handle({type: key});
        }
        else if (key) {
            this.p.handle({type: key, value: value['type'], id: value['id'], color: value['color']});
        }
    }
}
