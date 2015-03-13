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
        this.listener.translate(pt1, pt2);
    }
    fireClick(id: string) {
        this.listener.click(id);
    }
    fireScale(ds: number) {
        this.listener.scale(ds);
    }
}