///<reference path="IElementManager.ts"/>
///<reference path="IElement.ts"/>
///<reference path="BElement.ts"/>
/**
 * Created by curtis on 3/25/15.
 */
class ElementManager implements IElementManager {

    private elementMap:{[s: string]: IElement};
    private currentMap:{[s: string]: IElement};
    private newElementMap:{[s: string]: IElement};
    private elementCount: number;
    private elementContainer;
    private bounds: {x:number; y:number; w:number; h:number};
    private graphicObject: IGraphicObject;
    private ignoreBounds: boolean;


    constructor(elementContainer, graphicObject: IGraphicObject) {
        this.elementMap = {};
        this.currentMap = {};
        this.newElementMap = {};
        this.elementCount = 0;
        this.elementContainer = elementContainer;
        this.bounds = {x:0, y:0, w:0, h:0};
        this.graphicObject = graphicObject;
        this.ignoreBounds = false;


    }
    requestElement(box: IBox): void {
        var id: string = box.getNode().getId();
        if(!this.inBounds(box)) {
            return;
        }

        if(this.needsMake(box)) {
            this.make(box);
        }
        else {
            if(this.needsDefine(box)) {
                this.define(box);
            }
            else if(this.needsMove(box)) {
                this.move(box);
            }
            this.currentMap[id] = this.elementMap[id];
            delete this.elementMap[id];
        }

    }
    clearUnusedElement(): void {
        for (var key in this.elementMap) {
            if (this.elementMap.hasOwnProperty(key)) {
                this.removeElement(this.elementMap[key].getLastBox());
            }
        }
        this.elementMap = this.currentMap;
        this.currentMap = {};
    }
    setBounds(x: number, y: number, w: number, h: number): void {
        this.bounds = {x: x, y:y, w:w, h:h};
    }
    private needsMake(box: IBox): boolean {
        if(!this.elementMap.hasOwnProperty(box.getNode().getId())) {
            return true;
        }
        return false;
    }
    private needsDefine(box: IBox): boolean {
        var element: IElement = this.elementMap[box.getNode().getId()];
        var lastBox: IBox = element.getLastBox();

        if(box.getColor() !== lastBox.getColor()) {
            return true;
        }
        if(box.getType() !== lastBox.getType()) {
            return true;
        }
        if(box.isCollapsed() !== lastBox.isCollapsed()) {
            return true;
        }
        if(JSON.stringify(box.getRenderInstructions()) !== JSON.stringify(lastBox.getRenderInstructions())) {
            return true;
        }

        return false;
    }
    private needsMove(box: IBox): boolean {
        var element: IElement = this.elementMap[box.getNode().getId()];
        var lastBox: IBox = element.getLastBox();
        if(box.getX() !== lastBox.getX()) {
            return true;
        }
        if(box.getY() !== lastBox.getY()) {
            return true;
        }
        return false;
    }
    private getNewElement(): IElement {
        return new BElement();
    }
    private make(box: IBox): void {
        var element: IElement = this.getNewElement();
        element.make(box, this.elementContainer, this.graphicObject);
        this.currentMap[box.getNode().getId()] = element;
    }
    private define(box: IBox): void {
        this.removeElement(box);

        var element: IElement = this.getNewElement();
        element.make(box, this.elementContainer, this.graphicObject);
        this.elementMap[box.getNode().getId()] = element;
    }
    private move(box: IBox): void {
        this.elementMap[box.getNode().getId()].move(box, this.elementContainer);
    }
    private removeElement(box: IBox): void {
        if(box.getNode()) {
            var current:IElement = this.elementMap[box.getNode().getId()];
            current.remove(this.elementContainer);
            delete this.elementMap[box.getNode().getId()];
        }
    }
    setIgnoreBound(ignore: boolean): void {
        this.ignoreBounds = ignore;
    }
    private inBounds(box: IBox): boolean {
        if(this.ignoreBounds) {
            return true;
        }
        var inBound: boolean = true;
        var b = this.bounds;

        var minx: number = Math.min(b.x, b.w);
        var maxx: number = Math.max(b.x, b.w);

        var miny: number = Math.min(b.y, b.h);
        var maxy: number = Math.max(b.y, b.h);

        if(box.getX() > maxx) {
            inBound = false;
        }
        if(box.getX() + box.getWidth() < minx){
            inBound = false;
        }
        if(box.getY() > maxy) {
            inBound = false;
        }
        if(box.getY() + box.getHeight() < miny) {
            inBound = false;
        }
        return inBound;
    }
}