///<reference path="INode.ts"/>
/**
 * Created by krr428 on 3/7/15.
 */

interface IBox {
    getHeight(): number;
    getWidth(): number;
    getX(): number;
    getY(): number;
    getNode(): INode;
    getType(): string;
}

