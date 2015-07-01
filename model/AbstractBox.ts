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
    private grey: boolean;
    private x: number;
    private y: number;
    private w: number;
    private h: number;
    private type: string = null;
    private collapsed: boolean;

    constructor(node: INode) {
        this.node = node;
        this.collapsed = false;
    }
    setGray(b:boolean) {
        this.grey = b;
    }
    isGray() {
        return this.grey;
    }
    getHeight(): number {
        return this.h;
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
    getNode(): INode {
        return this.node;
    }
    getType(): string {
        return this.type;
    }
    setType(type: string) {
        this.type = type;
        var render:IBoxRender = BoxStyleFactory.getNewBoxStyle(type);

        this.setHeight(render.getHeight());
        this.setWidth(render.getWidth());

    }
    copy(): IBox {
        var b:Box = new AbstractBox(this.getNode());
        b.setGray(this.isGray());
        b.setHeight(this.getHeight());
        b.setWidth(this.getWidth());
        b.setType(this.getType());
        b.setX(this.getX());
        b.setY(this.getY());
        b.setCollapsed(this.isCollapsed());
        return b;
    }
    copyContents(b: IBox): void {
        b.setGray(this.isGray());
        b.setHeight(this.getHeight());
        b.setWidth(this.getWidth());
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