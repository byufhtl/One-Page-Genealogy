/**
 * Created by curtis on 3/13/15.
 */
///<reference path="IBox.ts"/>
///<reference path="../view/IBoxRender.ts"/>
///<reference path="../view/BoxStyleFactory.ts"/>
///<reference path="Box.ts"/>
/**
 * Created by curtis on 3/7/15.
 */
class AbstractBox implements IBox {
    private node: INode;
    private spouseNode: INode;
    private color: string;
    private x: number;
    private y: number;
    private space: number;
    private w: number;
    private h: number;
    private type: string = null;
    private collapsed: boolean;

    constructor(node: INode) {
        this.node = node;
        this.collapsed = false;
    }
    setColor(c:string){
        this.color = c;
    }
    getColor():string{
        return this.color;
    }
    getHeight(): number {
        return this.h + this.space;
    }
    setHeight(h: number) {
        this.h = h;
    }
    getWidth(): number {
        return this.w;
    }
    setWidth(w: number) {
        this.w = w;
    }
    getX(): number {
        return this.x;
    }
    setX(x: number) {
        this.x = x;
    }
    getY(): number {
        return this.y;
    }
    setY(y: number) {
        this.y = y;
    }
    getSpace():number {
        return this.space;
    }
    setSpace(space:number){
        this.space = space;
    }
    getNode(): INode {
        return this.node;
    }
    getSpouseNode(): INode {
        return this.spouseNode;
    }
    setSpouseNode(sn:INode) {
        this.spouseNode = sn;
    }
    getType(): string {
        return this.type;
    }
    setType(type: string) {
        this.type = type;
        //console.log("type: "+type);
        if(!type){
            type = "smallestNameBox";
        }
        var render:IBoxRender = BoxStyleFactory.getNewBoxStyle(type);
        //console.log("Is it here? "+render.getHeight());
        this.setHeight(render.getHeight());
        this.setWidth(render.getWidth());

    }
    copy(): IBox {
        var b:Box = new AbstractBox(this.getNode());
        b.setColor(this.getColor());
        b.setHeight(this.getHeight());
        b.setWidth(this.getWidth());
        b.setSpace(this.getSpace());
        b.setType(this.getType());
        b.setX(this.getX());
        b.setY(this.getY());
        b.setCollapsed(this.isCollapsed());
        return b;
    }
    copyContents(b: IBox): void {
        b.setColor(this.getColor());
        //console.log("Or here? "+this.getHeight());
        b.setHeight(this.getHeight());
        b.setWidth(this.getWidth());
        b.setSpace(this.getSpace());
        b.setType(this.getType());
        b.setX(this.getX());
        b.setY(this.getY());
        b.setCollapsed(this.isCollapsed());
    }
    isCollapsed(): boolean {
        return this.collapsed;
    }
    setCollapsed(collapsed: boolean) {
        this.collapsed = collapsed;
    }
    clear(): void {
        this.x = 0;
        this.y = 0;
        this.h = 0;
        this.w = 0;
        this.space = 0;
        this.type = null;
        this.collapsed = false;
    }
    hitTest(pt: Point): boolean {
        if(this.x > pt.getX()) {
            return false;
        }
        if(this.x + this.w < pt.getX()) {
            return false;
        }
        if(this.y > pt.getY()) {
            return false;
        }
        if(this.y + this.h < pt.getY()) {
            return false;
        }
        return true;
    }
}