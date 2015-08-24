///<reference path="INode.ts"/>
///<reference path="../util/Point.ts"/>
/**
 * Created by krr428 on 3/7/15.
 */

interface IBox {
    setGray(b:boolean);
    isGray():boolean;
    setColor(c:string);
    getColor(): string;
    getHeight(): number;
    setHeight(h: number);
    getWidth(): number;
    setWidth(w: number);
    getX(): number;
    setX(x: number);
    getY(): number;
    setY(y: number);
    getSpace():number;
    setSpace(space:number);
    getNode(): INode;
    getSpouseNode(): INode;
    setSpouseNode(sn: INode);
    getType(): string;
    setType(type: string);
    copy():IBox;
    copyContents(original:IBox): void;
    isCollapsed(): boolean;
    setCollapsed(collapsed: boolean);
    hitTest(pt: Point): boolean;
    clear():void;
}

