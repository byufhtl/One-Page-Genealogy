///<reference path="INode.ts"/>
/**
 * Created by krr428 on 3/7/15.
 */

interface IBox {
    getHeight(): number;
    setHeight(h: number);
    getWidth(): number;
    setWidth(w: number);
    getX(): number;
    setX(x: number);
    getY(): number;
    setY(y: number);
    getNode(): INode;
    getType(): string;
    setType(type: string);
    copy():IBox;
}

