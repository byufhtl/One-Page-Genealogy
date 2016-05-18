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
    private node :INode;
    private spouseNode :INode;
    private x :number;
    private y :number;
    private space :number;
    private w :number;
    private h :number;
    private type :string = null;
    private collapsed :boolean;
    private ris :RenderInstructionSchedule;
    private picture :boolean;
    private color :string;
    private textColor :string;
    private needsUpdate :boolean;

    constructor(node :INode) {
        this.node = node;
        this.collapsed = false;
        this.picture = false;
        this.ris = new RenderInstructionSchedule()
            .setHasPicture(node.hasAttr("profilePicturePromise"));
        if(node.getDisplaySpouse()) {
            this.ris.setSpouseHasPicture(node.getDisplaySpouse().hasAttr("profilePicturePromise"));
        }

        this.color = "#FFFFFF";
        this.textColor = "#000000";
    }
    setColor(c:string){ // You could refactor to get rid of these functions and just manipulate them through the RIS. You'd have to change all of the color spacers though.
        this.color = c;
    }
    getColor():string{
        return this.color;
    }
    setTextColor(c:string){
        this.textColor = c;
    }
    getTextColor():string{
        return this.textColor;
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
        b.setRenderInstructions(this.ris);

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
        b.setRenderInstructions(this.ris);
    }
    setCollapsed(collapsed: boolean) {
        this.collapsed = collapsed;
    }
    isCollapsed(): boolean {
        return this.collapsed;
    }
    setNeedsUpdate(need: boolean){
        this.needsUpdate = need;
    }
    getNeedsUpdate(): boolean{
        return this.needsUpdate;
    }
    clear(): void {
        this.x = 0;
        this.y = 0;
        this.h = 0;
        this.w = 0;
        this.space = 0;
        this.type = null;
        this.collapsed = false;
        this.picture = false;
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
    toString() :string{
        return JSON.stringify(this);
    }
}