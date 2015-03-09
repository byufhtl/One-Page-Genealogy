///<reference path="IBox.ts"/>
/**
 * Created by curtis on 3/7/15.
 */
class Box implements IBox {
    private node: INode;
    private x: number;
    private y: number;
    private w: number;
    private h: number;
    private type: string = null;

    constructor(node: INode) {
        this.node = node;
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
    }
}