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
///<reference path="../sources/SourceFactory.ts"/>
///<reference path="P.ts"/>
///<reference path="../sources/GedcomDownloader.ts"/>
///<reference path="../sources/GedcomNode.ts"/>

/**
 * Created by curtis on 3/11/15.
 */
class C implements IGraphicObjectListener, IOptionListener {

    private source:ISource;
    public dscOrAsc:string;
    private generations: number;
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

    //These 3 variables used in edit-spacing mode for moving branches around
    private editMode:boolean = false;
    private grabBranch:boolean = true;
    private selectedBranch:IBox[] = [];

    constructor(data) {

        //console.log(data);
        var rootId:string = data.rootId;
        this.dscOrAsc = data.dscOrAsc;
        this.generations = data.generations;

        if(data.hasOwnProperty("optionManager")){
            this.optionManager = data.optionManager;
        }

        var sourceFactory = new SourceFactory();
        this.source = sourceFactory.makeSource(data, rootId);

        this.anchorPt = new Point(10, 10);

        this.tree = new Tree();
        this.p = new P(this);

        if (data.pipeline !== undefined) {
            this.p.setStylingPipeline(data.pipeline);
        }

        this.viewManager = new MainViewManager();
        this.greyscale = false;

        this.dx = 0;
        this.dy = 0;
        this.scaleFactor = 1;

        this.tree.setListener(this.p);

        this.optionManager = data.optionManager;
        this.optionManager.setListener(this);
        this.optionManager.setRotation(this.viewManager.getRotation());


        this.boxes = null;

        if (this.source !== null) {
            this.source.setListener(this.tree.getSourceListener());
            this.source.start();
        } else {
            this.boxes = new BoxMap(data.boxes.rootId);
            this.boxes.deserializeMap(data.boxes.map);

            this.p.setMaps(this.boxes);
            var map = this.boxes.getMap();

            //console.log(this.boxes);

            for (var key in map) {
                if (map.hasOwnProperty(key)) {
                    this.tree.getSourceListener().gotNode(map[key].getNode());
                }
            }
            this.p.handleUpdate(this.tree, []);
            this.refresh(this.boxes);
        }
    }

    setViewManager(viewManager:IViewManager):void {
        this.viewManager = viewManager;
    }

    refresh(boxes:BoxMap = this.boxes):void {
        //console.log(boxes);
        this.boxes = boxes;
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

    getBranch(box:IBox, branch:IBox[]):IBox[] {
        if (!box) {
            return null;
        }
        var branchIds = box.getNode().getBranchIds();
        branch.push(box);
        if (branchIds.length === 0) {
            return branch;
        }
        for (var i = 0; i < branchIds.length; i++) {
            branch.concat(this.getBranch(this.boxes.getMap()[branchIds[i]], branch));
        }
        return branch;
    }

    startDrag(pt:Point):void {
        var box:IBox = this.p.handle({type: 'getBoxByPoint', pt: pt});
        if (box) {
            if (this.grabBranch) {
                this.selectedBranch = this.getBranch(box, []);
            } else {
                this.selectedBranch = [box];
            }
        } else {
            this.selectedBranch = [];
        }
    }

    endDrag(pt:Point):void {
        this.selectedBranch = [];
    }

    translate(pt1:Point, pt2:Point):void {
        if (this.editMode && this.selectedBranch.length > 0) {
            for (var index in this.selectedBranch) {
                var boxToMove = this.selectedBranch[index];
                this.p.getStylingPipeline().addCustomSpacerStyle(boxToMove.getNode().getId(), {
                    'x': boxToMove.getX() - (pt2.getX() - pt1.getX()),
                    'y': boxToMove.getY() - (pt2.getY() - pt1.getY())
                });
                boxToMove.setX(boxToMove.getX() - (pt2.getX() - pt1.getX()));
                boxToMove.setY(boxToMove.getY() - (pt2.getY() - pt1.getY()));
            }
            this.viewManager.refresh(this.boxes);
        } else {
            var dx:number = (pt2.getX() - pt1.getX());
            var dy:number = (pt2.getY() - pt1.getY());

            this.viewManager.setTranslation(dx, dy);
        }
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
            this.optionManager.setRotation(this.viewManager.getRotation());
        }
        else if (key === 'recenter-chart'){
            this.viewManager.reCenter(this.boxes);
        }
        else if (key === 'find-box-by-id'){
            var realId = value + ":0";
            var box = this.boxes.getId(realId);
            if(box) {
                this.viewManager.centerOnBox(box);
            }
            else{
                console.log(realId, this.boxes.getMap());
            }
            $('#box-finder-modal').hide();
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
        else if (key === 'save') {
            //var boxes = JSON.stringify(this.boxes);

            // var fileName = "opg_chart.json";
            //console.log(boxes.length);
            // var url = "data:text+json;utf8," + encodeURIComponent(boxes);
            // var link:any = document.createElement("a");
            // link.download = fileName;
            // link.href = url;
            // link.click();
            this.p.handle({type: key, value: this.boxes});
        }
        else if (key === 'ruler') {
            //have user select dimensions and then display ruler

            this.viewManager.getSVGString().then(function (s) {
                //console.log(s);
                var wIndex = s.indexOf('width="') + 7;
                var hIndex = s.indexOf('height="') + 8;
                var width = s.slice(wIndex, s.indexOf('"', wIndex));
                var height = s.slice(hIndex, s.indexOf('"', hIndex));
                $('#ruler-ratio').val(width / height);
                $('#ruler-original-height').val(height);
                $('#ruler-height').val((height / 72).toFixed(1));
                $('#ruler-width').val((width / 72).toFixed(1));
                $('#rulerModal').modal('show');
            });
        }
        else if (key === 'ruler-save') {
            this.viewManager.setRuler();
        }

        //~~~ Chart Styles ~~~
        else if (key === 'detail-style') {
            this.p.handle({type: key});
        }
        else if (key === 'reunion-style') {
            this.p.handle({type: key});
        }
        else if (key === 'vertical-style') {
            this.p.handle({type: key});
        }
        else if (key === 'vertical-style-accent') {
            this.p.handle({type: key});
        }
        else if (key === 'bubble-style') {
            this.p.handle({type: key});
        }
        else if (key === 'var-depth-style') {
            this.p.handle({type: key});
        }
        else if (key === 'eight-eleven-style') {
            this.p.handle({type: key});
        }
        else if (key === 'eight-eleven-detail-style') {
            this.p.handle({type: key});
        }
        else if (key === 'eleven-seventeen-style') {
            this.p.handle({type: key});
        }
        else if (key === 'extended-style') {
            this.p.handle({type: key});
        }
        else if (key === 'js-public-style') {
            this.p.handle({type: key});
        }
        else if (key === 'js-reunion-public-style') {
            this.p.handle({type: key});
        }
        else if (key === 'js-var-depth-style') {
            this.p.handle({type: key});
        }

        //~~~ Color Schemes ~~~
        else if (key === 'to-greyscale') {
            this.p.handle({type: key});
        }
        else if (key === 'to-branch-color') {
            this.p.handle({type: key});
        }
        else if (key === 'to-branch-color-blackout') {
            this.p.handle({type: key});
        }
        else if (key === 'to-branch-color-bold') {
            this.p.handle({type: key});
        }
        else if (key === 'to-branch-color-gray') {
            this.p.handle({type: key});
        }
        else if (key === 'to-generation-color-warm') {
            this.p.handle({type: key});
        }
        else if (key === 'to-generation-color-cold') {
            this.p.handle({type: key});
        }
        else if (key === 'to-generation-color-vibrant') {
            this.p.handle({type: key});
        }
        else if (key === 'to-generation-wood') {
            this.p.handle({type: key});
        }
        else if (key === 'to-gender-color') {
            this.p.handle({type: key});
        }
        else if (key === 'to-country-color') {
            this.p.handle({type: key, colorMap: value});
        }
        //~~~ Other ~~~
        else if (key === 'show-empty') {
            this.p.handle({type: key, recurse: value.recurse});
        }
        else if (key === 'hide-empty') {
            this.p.handle({type: key});
        }
        else if (key === 'show-duplicates') {
            this.p.handle({type: key});
        }
        else if (key === 'edit-spacing') {
            this.editMode = true;
            $('#edit-spacing-switch').css("display", "block");
            document.getElementById('opg-edit-spacing').innerHTML = "Done Editing Spacing";
        }
        else if (key === 'done-editing-spacing') {
            this.editMode = false;
            $('#edit-spacing-switch').css("display", "none");
            document.getElementById('opg-edit-spacing').innerHTML = "Edit Spacing";
        }
        else if (key === 'edit-spacing-switch-changed') {
            this.grabBranch = value.state;
        }
        else if (key === 'show-statistics'){
            this.p.handle({type: key, value: this.boxes, generations: this.generations, direction: this.dscOrAsc});
        }
        else if (key === 'hide-statistics'){
            this.p.handle({type: key, value:null});
        }
        else if (key === 'VP-view') {
            this.p.handle({type: key, id: value['id']});
        }
        else if (key === 'add-custom-node') {
            this.tree.addCustomNode(value['node'],value['box']);
        }
        else if (key === 'remove-custom-node') {
            this.tree.removeCustomNode(value['node'],value['box']);
        }
        else if (key === 'update-custom-node') {
            this.tree.updateCustomNode(value['node'],value['box']);
        }
        else if (key) {
            if (value == null) {
                console.log("Null Value. Key = " + key);
            }
            if (value.hasOwnProperty('type')) {
                this.p.handle({type: key, value: value['type'], id: value['id']});
            }
            else {
                this.p.handle({type: key, id: value['id'], color: value['color'], textcolor: value['textcolor']});
            }
        }
    }

    public getViewManager(){
        return this.viewManager;
    }

    public getBoxes():BoxMap {
        return this.boxes;
    }

    public destroy(){
        this.viewManager.destroy();
        this.boxes = new BoxMap("dummy");
    }
}
