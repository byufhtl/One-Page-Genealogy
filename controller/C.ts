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


    constructor() {
        //this.source = new FamilySearchSource('LDJQ-2GC', 5);
        //this.source = new FamilySearchSource('K2N7-S9R', 3);
        //this.source = new FSAncestryDownloader('KWFX-MD1', 14);
        this.source = new FSFullTreeDownloader('KWFX-MD1', 14);
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
        FamilySearch.getAccessToken().then(function (response) {
            self.source.start();
        });
    }
    setViewManager(viewManager: IViewManager): void {
        this.viewManager = viewManager;
    }
    refresh(boxes: BoxMap): void {
        this.boxes = boxes;
        this.graphicObject = this.viewManager.refresh(boxes);
        this.graphicObject.setListener(this);
    }
    translate(pt1: Point, pt2: Point): void {

        this.dx += pt1.getX() - pt2.getX();
        this.dy += pt1.getY() - pt2.getY();

        //this.p.handle({type: 'update-translate', dx: this.dx, dy: this.dy});
        this.viewManager.setTranslation(this.dx, this.dy);
    }
    scale(ds: number, pt: Point): void {
        if(ds > 0) {
            ds = (9.0/10.0);
        }
        else {
            ds = (10.0/9.0);
        }
        this.scaleFactor *= ds;

        //var dx: number = pt.getX() * ds - pt.getX();
        //var dy: number = pt.getY() * ds - pt.getY();

        this.viewManager.setScale(this.scaleFactor);
    }
    click(id: string): void {
        //this.p.handle({type: 'horizontalNameLifeBox', id:id});
        if(this.boxes && this.boxes.getId(id)) {
            var box:IBox = this.boxes.getId(id);
            this.optionManager.handleOptionSetting('selectIndividual', {box:box});
        }

    }
    handleOption(key:string, value:any):void {
        if(key === "collapse-sub-tree") {
            this.p.handle({type: key, id:value['id']});
        }
        else if(key === 'rotate') {
            this.viewManager.rotate(value.value);
        }
        else if(key === 'request-download') {
            var s = this.viewManager.getSVGString();
            var fileName = "opg_chart.svg";
            var url = "data:image/svg+xml;utf8," + encodeURIComponent(s);
            var link:any = document.createElement("a");
            link.download = fileName;
            link.href = url;
            link.click();
        }
        else if(key) {
            this.p.handle({type: key, value: value['type'], id:value['id']});
        }

    }
}