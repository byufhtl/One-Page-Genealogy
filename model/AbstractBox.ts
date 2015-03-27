/**
 * Created by curtis on 3/13/15.
 */
///<reference path="IBox.ts"/>
///<reference path="../view/IBoxRender.ts"/>
///<reference path="../view/BoxStyleFactory.ts"/>
/**
 * Created by curtis on 3/7/15.
 */
class AbstractBox implements IBox {
    private node: INode;
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
        b.setHeight(this.getHeight());
        b.setWidth(this.getWidth());
        b.setType(this.getType());
        b.setX(this.getX());
        b.setY(this.getY());
        return b;
    }
    isCollapsed(): boolean {
        return this.collapsed;
    }
    setCollapsed(collapsed: boolean) {
        this.collapsed = collapsed;
    }
}