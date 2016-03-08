///<reference path="IGraphicObjectListener.ts"/>
/**
 * Created by curtis on 3/11/15.
 */
interface IGraphicObject {
    setListener(listener: IGraphicObjectListener):void;
    fireTranslate(pt1: Point, pt2: Point);
    fireClick(id: string);
    fireClickPt(pt: Point);
    fireScale(ds: number, pt: Point);
    fireStartDrag(pt: Point);
    fireEndDrag(pt: Point);
}