///<reference path="INode.ts"/>
///<reference path="../util/Point.ts"/>
///<reference path="../view/boxRenderers/RenderInstructionSchedule.ts"/>

/**
 * Created by krr428 on 3/7/15.
 */

interface IBox {
    setColor(c:string);
    getColor(): string;
    setTextColor(c:string);
    getTextColor();
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
    getRenderInstructions() :RenderInstructionSchedule;
    setRenderInstructions(instr :RenderInstructionSchedule);
    copy():IBox;
    copyContents(original:IBox): void;
    isCollapsed(): boolean;
    setCollapsed(collapsed: boolean);
    setNeedsUpdate(need: boolean);
    getNeedsUpdate(): boolean;
    hitTest(pt: Point): boolean;
    clear():void;
}

