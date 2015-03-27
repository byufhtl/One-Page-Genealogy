///<reference path="../model/IBox.ts"/>
///<reference path="../util/Point.ts"/>
/**
 * Created by curtis on 3/25/15.
 */
interface IElement {
    make(box: IBox, rootElement, graphicObject: IGraphicObject);
    define(box: IBox);
    move(box: IBox);
    remove(rootElement);
    getLastBox(): IBox;
}