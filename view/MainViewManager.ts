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
    refresh(boxMap: BoxMap): void {
        this.svgManager.refresh(boxMap);
    }
}