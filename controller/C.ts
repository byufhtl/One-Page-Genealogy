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
/**
 * Created by curtis on 3/11/15.
 */
class C implements IGraphicObjectListener, IOptionListener {

    private source: ISource;
    private tree: ITree;
    private p: P;
    private viewManager: IViewManager;
    //private optionListener: IOptionListener;
    private graphicObject: IGraphicObject;
    private dx: number;
    private dy: number;
    private optionManager: OptionManager;
    private boxes: BoxMap;
    private scaleFactor: number;

    private anchorPt: Point;
    private anchorId: string;


    constructor(data) {

        var rootId: string = data.rootId;
        var generations: number = data.generations;

        this.source = new FSFullTreeDownloader(rootId, generations);
        this.anchorPt = new Point(10, 10);

        this.tree = new Tree();
        this.p = new P(this);
        this.viewManager = new MainViewManager();

        this.dx = 0;
        this.dy = 0;
        this.scaleFactor = 1;

        this.tree.setListener(this.p);
        this.source.setListener(this.tree.getSourceListener());
        this.optionManager = new OptionManager();
        this.optionManager.setListener(this);

        this.boxes = null;

        var self = this;

        self.source.start();
    }
    setViewManager(viewManager: IViewManager): void {
        this.viewManager = viewManager;
    }
    refresh(boxes: BoxMap): void {
        this.boxes = boxes;

        if(!this.anchorId) {
            this.anchorId = this.boxes.getRoot();
        }

        var newBox: IBox = this.boxes.getId(this.anchorId);
        if(newBox) {
            var newAnchor = new Point(newBox.getX(), newBox.getY());
            this.translate(this.anchorPt, newAnchor);
            this.anchorPt = newAnchor;
        }

        this.graphicObject = this.viewManager.refresh(boxes);
        this.graphicObject.setListener(this);
    }
    translate(pt1: Point, pt2: Point): void {

        var dx: number = (pt2.getX() - pt1.getX());
        var dy: number = (pt2.getY() - pt1.getY());

        this.viewManager.setTranslation(dx, dy);
    }
    scale(ds: number, pt: Point): void {
        if(ds > 0) {
            ds = (10.0/9.0);
        }
        else {
            ds = (9.0/10.0);
        }

        this.viewManager.setScale(ds, pt);
    }
    click(id: string): void {
        if(this.boxes && this.boxes.getId(id)) {
            var box:IBox = this.boxes.getId(id);
            this.optionManager.handleOptionSetting('selectIndividual', {box:box});
        }
    }
    clickPt(pt: Point): void {
        var box: IBox = this.p.handle({type: 'getBoxByPoint', pt: pt});
        if(box) {
            this.anchorId = box.getNode().getId();
            this.anchorPt = new Point(box.getX(), box.getY());
            this.optionManager.handleOptionSetting('selectIndividual', {box: box});
        }
    }
    handleOption(key:string, value:any):void {
        if(key === "collapse-sub-tree") {
            this.p.handle({type: key, id:value.id, box: value.box});
        }
        else if(key === "expand-sub-tree") {
            this.p.handle({type: key, id:value.id, box: value.box});
        }
        else if(key === 'rotate') {
            this.viewManager.rotate(value.value);
        }
        else if(key === 'request-download') {
            this.viewManager.getSVGString().then(function(s){
                //var s = this.viewManager.getSVGString();
                var fileName = "opg_chart.svg";
                var url = "data:image/svg+xml;utf8," + encodeURIComponent(s);
                var link:any = document.createElement("a");
                link.download = fileName;
                link.href = url;
                link.click();
            });

        }
        else if(key) {
            this.p.handle({type: key, value: value['type'], id:value['id']});
        }
    }
}