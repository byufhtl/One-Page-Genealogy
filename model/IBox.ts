///<reference path="INode.ts"/>
///<reference path="../util/Point.ts"/>
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
    copyContents(original:IBox): void;
    isCollapsed(): boolean;
    setCollapsed(collapsed: boolean);
    hitTest(pt: Point): boolean;
    clear():void;
}

