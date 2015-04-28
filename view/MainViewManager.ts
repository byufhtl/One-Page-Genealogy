///<reference path="IViewManager.ts"/>
///<reference path="SVGManager.ts"/>
/**
 * Created by curtis on 3/10/15.
 */
class MainViewManager implements IViewManager {

    private svgManager: SVGManager;

    constructor() {
        this.svgManager = new SVGManager("opg-chart");
    }
    refresh(boxMap: BoxMap): IGraphicObject {
        return this.svgManager.refresh(boxMap);
    }
    setTranslation(x:number, y:number): void {
        this.svgManager.setTranslation(x, y);
    }
    setScale(s: number): void {
        this.svgManager.setScale(s);
    }
    setSize(width: number, height: number): void {

    }
    rotate(r: number): void {
        this.svgManager.rotate(r);
    }
}