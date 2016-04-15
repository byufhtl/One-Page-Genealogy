/**
 * Created by curtis on 3/13/15.
 */
///<reference path="IBox.ts"/>
///<reference path="../view/IBoxRender.ts"/>
///<reference path="../view/BoxStyleFactory.ts"/>
///<reference path="Box.ts"/>
///<reference path="../view/boxRenderers/StyleManager.ts"/>
/**
 * Created by curtis on 3/7/15.
 */
class AbstractBox implements IBox {
    private node: INode;
    private spouseNode: INode;
    private x: number;
    private y: number;
    private space: number;
    private w: number;
    private h: number;
    private type: string = null;
    private collapsed: boolean;
    private ris :RenderInstructionSchedule;

    constructor(node: INode) {
        this.node = node;
        this.collapsed = false;
        this.ris = new RenderInstructionSchedule(24);
        this.ris.addInstruction(RenderInstructionSchedule.BOX_COLOR,0xffffff);
        this.ris.addInstruction(RenderInstructionSchedule.TEXT_COLOR,0x000000);
    }
    setColor(c:string){ // You could refactor to get rid of these functions and just manipulate them through the RIS. You'd have to change all of the color spacers though.
        this.ris.addInstruction(RenderInstructionSchedule.BOX_COLOR,ColorManager.stringToInt_hex(c));
    }
    getColor():string{
        var b_color = this.ris.getInstruction(RenderInstructionSchedule.BOX_COLOR);
        return (b_color) ? ColorManager.intToString_hex(b_color) : "#A0A0A0";
    }
    setTextColor(c:string){
        this.ris.addInstruction(RenderInstructionSchedule.TEXT_COLOR,ColorManager.stringToInt_hex(c));
    }
    getTextColor():string{
        var t_color = this.ris.getInstruction(RenderInstructionSchedule.TEXT_COLOR);
        return (t_color) ? ColorManager.intToString_hex(t_color) : "#ffffff";
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
        if(!type){
            type = StyleManager.TINY;
        }
        //var render:IBoxRender = BoxStyleFactory.getNewBoxStyle(type);
        //this.setHeight(render.getHeight());
        //this.setWidth(render.getWidth());

    }
    getRenderInstructions() :RenderInstructionSchedule{
        return this.ris;
    }
    setRenderInstructions(instr :RenderInstructionSchedule) :void{
        this.ris = instr;
    }
    copy(): IBox {
        var b:Box = new AbstractBox(this.getNode());
        b.setColor(this.getColor());
        b.setTextColor(this.getTextColor());
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
        b.setTextColor(this.getTextColor());
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