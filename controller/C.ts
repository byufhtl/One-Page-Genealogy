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


    constructor() {
        this.source = new FamilySearchSource('LDJQ-2GC', 5);
        this.tree = new Tree();
        this.p = new P(this);
        this.viewManager = new MainViewManager();

        this.dx = 0;
        this.dy = 0;

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
    //setOptionListener(listener: IOptionListener): void {
    //    this.optionManager.setListener(listener);
    //    //this.optionListener = listener;
    //}
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

        this.viewManager.setTranslation(this.dx, this.dy);
    }
    scale(ds: number): void {

    }
    click(id: string): void {
        //this.p.handle({type: 'horizontalNameLifeBox', id:id});
        if(this.boxes && this.boxes.getId(id)) {
            var box:IBox = this.boxes.getId(id);
            this.optionManager.handleOptionSetting('selectIndividual', {box:box});
        }

    }
    handleOption(key:string, value:any):void {
        if(key === "changeIndividual") {
            this.p.handle({type: value['type'], id:value['id']});
        }
    }
}