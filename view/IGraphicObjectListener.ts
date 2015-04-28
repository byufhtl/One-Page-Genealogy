///<reference path="../util/Point.ts"/>
/**
 * Created by curtis on 3/11/15.
 */
interface IGraphicObjectListener {
    translate(pt1: Point, pt2: Point): void;
    scale(ds: number, pt: Point): void;
    click(id: string): void;
}