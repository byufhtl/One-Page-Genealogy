///<reference path="IGraphicObjectListener.ts"/>
/**
 * Created by curtis on 3/11/15.
 */
interface IGraphicObject {
    setListener(listener: IGraphicObjectListener):void;
    fireTranslate(pt1: Point, pt2: Point);
    fireClick(id: string);
    fireScale(ds: number, pt: Point);
}