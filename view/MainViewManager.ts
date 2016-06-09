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
    setScale(s: number, pt: Point): void {
        this.svgManager.setScale(s, pt);
    }
    setSize(width: number, height: number): void {

    }
    centerOnBox(id: string, boxMap: BoxMap): void{
        if(id && boxMap.getId(id)) {
            this.svgManager.centerOnBox(boxMap.getId(id));
        }
    }
    reCenter(boxMap: BoxMap){
        var box = boxMap.getId(boxMap.getRoot());
        this.svgManager.centerOnBox(box);
    }
    rotate(r: number): void {
        this.svgManager.rotate(r);
    }
    getSVGString(): any {
        return this.svgManager.getSVGString();
    }
    clear():void{
        delete(this.svgManager);
    }
    setRuler(): any {
        return this.svgManager.setRuler();
    }
    getRotation(): any {
        return this.svgManager.getRotation();
    }
    destroy(){
        this.svgManager.destroy();
    }
}