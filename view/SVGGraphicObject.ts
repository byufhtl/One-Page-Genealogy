///<reference path="IGraphicObject.ts"/>
/**
 * Created by curtis on 3/13/15.
 */
class SVGGraphicObject implements IGraphicObject {

    private listener: IGraphicObjectListener;
    constructor() {
        this.listener = null;
    }
    setListener(listener: IGraphicObjectListener): void {
        this.listener = listener;
    }
    fireTranslate(pt1: Point, pt2: Point) {
        //var offset = parseInt($("#country-legend").width(),10);
        //pt = new Point(pt.getX()-offset, pt.getY());
        this.listener.translate(pt1, pt2);
    }
    fireClick(id: string) {
        this.listener.click(id);
    }
    fireClickPt(pt: Point) {
        this.listener.clickPt(pt);
    }
    fireScale(ds: number, pt: Point) {
        //var offset = parseInt($("#country-legend").width(),10);
        //pt = new Point(pt.getX()+offset, pt.getY());
        this.listener.scale(ds, pt);
    }
    fireStartDrag(pt: Point){
        //var offset = parseInt($("#country-legend").width(),10);
        //pt = new Point(pt.getX()+offset, pt.getY());
        this.listener.startDrag(pt);
    }
    fireEndDrag(pt : Point){
        //var offset = parseInt($("#country-legend").width(),10);
        //pt = new Point(pt.getX()+offset, pt.getY());
        this.listener.endDrag(pt);
    }
}