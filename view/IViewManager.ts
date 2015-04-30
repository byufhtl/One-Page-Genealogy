///<reference path="../controller/BoxMap.ts"/>
///<reference path="IGraphicObject.ts"/>
/**
 * Created by curtis on 3/7/15.
 */
interface IViewManager {
    refresh(boxMap: BoxMap): IGraphicObject;

    setTranslation(x:number, y:number): void;
    setScale(s: number, pt: Point): void;
    setSize(width: number, height: number): void;
    rotate(r: number): void;
    getSVGString(): string;
}