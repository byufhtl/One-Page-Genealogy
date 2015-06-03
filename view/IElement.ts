///<reference path="../model/IBox.ts"/>
///<reference path="../util/Point.ts"/>
///<reference path="IGraphicObject.ts"/>
/**
 * Created by curtis on 3/25/15.
 */
interface IElement {
    make(box: IBox, rootElement, graphicObject: IGraphicObject);
    define(box: IBox, rootElement);
    move(box: IBox, rootElement);
    remove(rootElement);
    getLastBox(): IBox;
}