///<reference path="../ColorManager.ts"/>
///<reference path="Instruction.ts"/>

/**
 * Created by calvinmcm on 4/13/16.
 */

/**
 * The RenderInstructionSchedule class is designed as a container for information that the renderer will need in addition
 * to the box dimensions in order to render the box as an SVG element. Essentially, it contains a work order for the renderer.
 * The information is set (presumably) by the StyleManager as a style is applied to a box. The Style really consists of
 * creating and then populating this object, after which it attaches this object to the box being stylized. The box will
 * then pass this object to the renderer, which will systematically check for instructions and render the box appropriately
 * based on the instructions and information stored in the box object.
 */
class RenderInstructionSchedule{

    private boxInstructions :{[s:string] : any};
    private textInstructions :{[s:string] : any};
    private nodeInstructions :{[s:string] : Instruction};
    private spouseInstructions :{[s:string] : Instruction};
    private pictureInstructions :{[s:string] : Instruction};

    constructor(){
        this.boxInstructions = {};
        this.textInstructions = {};
        this.nodeInstructions = {};
        this.spouseInstructions = {};
        this.pictureInstructions = {};
    }

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[]||[]>
//[o]=[o]==[o]=[o]=[o]=[o][o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=]/                    \[[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o][]||[]>
//============================================================]>       SETTERS      <[===========================================================[]()[]>
//[o]=[o]==[o]=[o]=[o]=[o][o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=]\                    /[[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o][]||[]>
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[]||[]>

    // Box, Text, Rotation (10)
    public setFlavorKey(flavor_key :string) :RenderInstructionSchedule{
        this.boxInstructions[RenderInstructionSchedule.FLAVOR_KEY] = flavor_key;
        return this;
    }

    public setBorderWidth(borderWidth :number) :RenderInstructionSchedule{
        this.boxInstructions[RenderInstructionSchedule.BORDER_WIDTH] = borderWidth;
        return this;
    }

    public setSpouseBox(spouseBox : boolean) :RenderInstructionSchedule{
        this.boxInstructions[RenderInstructionSchedule.BORDER_WIDTH] = spouseBox;
        return this;
    }

    public setBorderColor(color :string) :RenderInstructionSchedule{
        this.boxInstructions[RenderInstructionSchedule.BORDER_COLOR] = color;
        return this;
    }

    public setCornerRounding(round_amount :number) :RenderInstructionSchedule{
        this.boxInstructions[RenderInstructionSchedule.CORNER_ROUNDING] = round_amount;
        return this;
    }

    public setColoredBorder(colored :boolean){
        this.boxInstructions[RenderInstructionSchedule.BORDER_WIDTH] = colored;
        return this;
    }

    public setRotation(rotated :boolean){
        this.boxInstructions[RenderInstructionSchedule.BOX_ROTATED] = rotated;
        return this;
    }

    public setDefTextSize(default_size :number) :RenderInstructionSchedule{
        this.textInstructions[RenderInstructionSchedule.DEF_FONT_SIZE] = default_size;
        return this;
    }

    public setAltTextSize(alt_size :number) :RenderInstructionSchedule{
        this.textInstructions[RenderInstructionSchedule.ALT_FONT_SIZE] = alt_size;
        return this;
    }

    public setBoldID(bold_id :string) :RenderInstructionSchedule{
        this.boxInstructions[RenderInstructionSchedule.BOLD] = bold_id;
        return this;
    }

    // Node (9)
    public setNodeName(i :Instruction) :RenderInstructionSchedule{
        this.nodeInstructions[RenderInstructionSchedule.NAME] = i;
        return this;
    }

    public setNodeBDate(i :Instruction) :RenderInstructionSchedule{
        this.nodeInstructions[RenderInstructionSchedule.B_DATE] = i;
        return this;
    }

    public setNodeDDate(i :Instruction) :RenderInstructionSchedule{
        this.nodeInstructions[RenderInstructionSchedule.D_DATE] = i;
        return this;
    }

    public setNodeBPlace(i :Instruction) :RenderInstructionSchedule{
        this.nodeInstructions[RenderInstructionSchedule.B_PLACE] = i;
        return this;
    }

    public setNodeDPlace(i :Instruction) :RenderInstructionSchedule{
        this.nodeInstructions[RenderInstructionSchedule.D_PLACE] = i;
        return this;
    }

    public setNodeSpan(i :Instruction) :RenderInstructionSchedule{
        this.nodeInstructions[RenderInstructionSchedule.LIFE_SPAN] =i;
        return this;
    }

    public setPicturePlace(i :Instruction) :RenderInstructionSchedule{
        this.pictureInstructions[RenderInstructionSchedule.PICTURE] = i;
        return this;
    }

    public setPictureDim(i :Instruction) :RenderInstructionSchedule{
        this.pictureInstructions[RenderInstructionSchedule.PICTURE_DIM] = i;
        return this;
    }

    public setHasPicture(loaded :boolean) :RenderInstructionSchedule{
        this.boxInstructions[RenderInstructionSchedule.HAS_PICTURE] = loaded;
        return this;
    }

    // Spouse (9)
    public setSpouseName(i :Instruction) :RenderInstructionSchedule{
        this.spouseInstructions[RenderInstructionSchedule.S_NAME] = i;
        return this;
    }

    public setSpouseBDate(i :Instruction) :RenderInstructionSchedule{
        this.spouseInstructions[RenderInstructionSchedule.S_B_DATE] = i;
        return this;
    }

    public setSpouseDDate(i :Instruction) :RenderInstructionSchedule{
        this.spouseInstructions[RenderInstructionSchedule.S_D_DATE] = i;
        return this;
    }

    public setSpouseBPlace(i :Instruction) :RenderInstructionSchedule{
        this.spouseInstructions[RenderInstructionSchedule.S_B_PLACE] = i;
        return this;
    }

    public setSpouseDPlace(i :Instruction) :RenderInstructionSchedule{
        this.spouseInstructions[RenderInstructionSchedule.S_D_PLACE] = i;
        return this;
    }

    public setSpouseSpan(i :Instruction) :RenderInstructionSchedule{
        this.spouseInstructions[RenderInstructionSchedule.S_LIFE_SPAN] =i;
        return this;
    }

    public setSpousePicturePlace(i :Instruction) :RenderInstructionSchedule{
        this.pictureInstructions[RenderInstructionSchedule.S_PICTURE] = i;
        return this;
    }

    public setSpousePictureDim(i :Instruction) :RenderInstructionSchedule{
        this.pictureInstructions[RenderInstructionSchedule.S_PICTURE_DIM] = i;
        return this;
    }

    public setSpouseHasPicture(loaded :boolean) :RenderInstructionSchedule{
        this.boxInstructions[RenderInstructionSchedule.S_HAS_PICTURE] = loaded;
        return this;
    }

    // Marriage (2)
    public setMarriageDate(i :Instruction) :RenderInstructionSchedule{
        this.spouseInstructions[RenderInstructionSchedule.M_DATE] = i;
        return this;
    }

    public setMarriagePlace(i :Instruction) :RenderInstructionSchedule{
        this.spouseInstructions[RenderInstructionSchedule.M_PLACE] = i;
        return this;
    }

    // Instruction Sets (5)
    public setBoxInstructions(bi :{[s:string] :any}) :RenderInstructionSchedule{
        this.boxInstructions = bi;
        return this;
    }

    public setTextInstructions(ti :{[s:string] :any}) :RenderInstructionSchedule{
        this.textInstructions = ti;
        return this;
    }

    public setNodeInstructions(ni :{[s:string] :Instruction}) :RenderInstructionSchedule{
        this.nodeInstructions = ni;
        return this;
    }

    public setSpouseInstructions(si :{[s:string] :Instruction}) :RenderInstructionSchedule{
        this.spouseInstructions = si;
        return this;
    }

    public setPictureInstructions(pi :{[s:string] :Instruction}) :RenderInstructionSchedule{
        this.pictureInstructions = pi;
        return this;
    }

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[]||[]>
//[o]=[o]==[o]=[o]=[o]=[o][o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=]/                    \[[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o][]||[]>
//============================================================]>       GETTERS      <[===========================================================[]()[]>
//[o]=[o]==[o]=[o]=[o]=[o][o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=]\                    /[[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o][]||[]>
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[]||[]>

    // Box, Text, Rotation (10)
    public getFlavorKey() :string{
        if(!this.boxInstructions[RenderInstructionSchedule.FLAVOR_KEY]) {
            console.log("Flavor key will fail: " + this.boxInstructions[RenderInstructionSchedule.FLAVOR_KEY]);
            return null;
        }
        else {
            return this.boxInstructions[RenderInstructionSchedule.FLAVOR_KEY];
        }
    }

    public getBorderWidth() :number{
        return this.boxInstructions[RenderInstructionSchedule.BORDER_WIDTH];
    }

    public isSpouseBox() :boolean{
        return this.boxInstructions[RenderInstructionSchedule.SPOUSE_BOX];
    }

    public isColoredBorder() :boolean{
        return this.boxInstructions[RenderInstructionSchedule.AUTO_PASTEL_BORDER_MODE];
    }

    public getBorderColor() :string{
        return this.boxInstructions[RenderInstructionSchedule.BORDER_COLOR];
    }

    public getCornerRounding() :number{
        return this.boxInstructions[RenderInstructionSchedule.CORNER_ROUNDING];
    }

    public isRotated() :boolean{
        return this.boxInstructions[RenderInstructionSchedule.BOX_ROTATED];
    }

    public getDefTextSize() :number{
        return this.textInstructions[RenderInstructionSchedule.DEF_FONT_SIZE];
    }

    public getAltTextSize() :number{
        return this.textInstructions[RenderInstructionSchedule.ALT_FONT_SIZE];
    }

    public getBoldID() :string{
        var id = this.boxInstructions[RenderInstructionSchedule.BOLD];
        if(!id){return null;}
        return id;
    }

    // Node (9)
    public getNameInstruction() :Instruction{
        if(RenderInstructionSchedule.NAME in this.nodeInstructions){
            return this.nodeInstructions[RenderInstructionSchedule.NAME];
        }
        return null;
    }

    public getBDateInstruction() :Instruction{
        if(RenderInstructionSchedule.B_DATE in this.nodeInstructions){
            return this.nodeInstructions[RenderInstructionSchedule.B_DATE];
        }
        return null;
    }

    public getDDateInstruction() :Instruction{
        if(RenderInstructionSchedule.D_DATE in this.nodeInstructions){
            return this.nodeInstructions[RenderInstructionSchedule.D_DATE];
        }
        return null;
    }

    public getBPlaceInstruction() :Instruction{
        if(RenderInstructionSchedule.B_PLACE in this.nodeInstructions){
            return this.nodeInstructions[RenderInstructionSchedule.B_PLACE];
        }
        return null;
    }

    public getDPlaceInstruction() :Instruction{
        if(RenderInstructionSchedule.D_PLACE in this.nodeInstructions){
            return this.nodeInstructions[RenderInstructionSchedule.D_PLACE];
        }
        return null;
    }

    public getSpanInstruction() :Instruction{
        if(RenderInstructionSchedule.LIFE_SPAN in this.nodeInstructions){
            return this.nodeInstructions[RenderInstructionSchedule.LIFE_SPAN];
        }
        return null;
    }

    public getPicturePlaceInstruction() :Instruction{
        if(RenderInstructionSchedule.PICTURE in this.pictureInstructions){
            return this.pictureInstructions[RenderInstructionSchedule.PICTURE];
        }
        return null;
    }

    public getPictureDimInstruction() :Instruction{
        if(RenderInstructionSchedule.PICTURE_DIM in this.pictureInstructions){
            return this.pictureInstructions[RenderInstructionSchedule.PICTURE_DIM];
        }
        return null;
    }

    /**
     * @returns {boolean} true if the toggle has been set to true, false otherwise.
     */
    public getHasPicture() :boolean{
        return <boolean>this.boxInstructions[RenderInstructionSchedule.HAS_PICTURE];
    }

    // Spouse (9)
    public getSpouseNameInstruction() :Instruction{
        if(RenderInstructionSchedule.S_NAME in this.spouseInstructions){
            return this.spouseInstructions[RenderInstructionSchedule.S_NAME];
        }
        return null;
    }

    public getSpouseBDateInstruction() :Instruction{
        if(RenderInstructionSchedule.S_B_DATE in this.spouseInstructions){
            return this.spouseInstructions[RenderInstructionSchedule.S_B_DATE];
        }
        return null;
    }

    public getSpouseDDateInstruction() :Instruction{
        if(RenderInstructionSchedule.S_D_DATE in this.spouseInstructions){
            return this.spouseInstructions[RenderInstructionSchedule.S_D_DATE];
        }
        return null;
    }

    public getSpouseBPlaceInstruction() :Instruction{
        if(RenderInstructionSchedule.S_B_PLACE in this.spouseInstructions){
            return this.spouseInstructions[RenderInstructionSchedule.S_B_PLACE];
        }
        return null;
    }

    public getSpouseDPlaceInstruction() :Instruction{
        if(RenderInstructionSchedule.S_D_PLACE in this.spouseInstructions){
            return this.spouseInstructions[RenderInstructionSchedule.S_D_PLACE];
        }
        return null;
    }

    public getSpouseSpanInstruction() :Instruction{
        if(RenderInstructionSchedule.S_LIFE_SPAN in this.spouseInstructions){
            return this.spouseInstructions[RenderInstructionSchedule.S_LIFE_SPAN];
        }
        return null;
    }

    public getSpousePicturePlaceInstruction() :Instruction{
        if(RenderInstructionSchedule.S_PICTURE in this.pictureInstructions){
            return this.pictureInstructions[RenderInstructionSchedule.S_PICTURE];
        }
        return null;
    }

    public getSpousePictureDimInstruction() :Instruction{
        if(RenderInstructionSchedule.S_PICTURE_DIM in this.pictureInstructions){
            return this.pictureInstructions[RenderInstructionSchedule.S_PICTURE_DIM];
        }
        return null;
    }

    /**
     * @returns {boolean} true if the toggle has been set to true, false otherwise.
     */
    public getSpouseHasPicture() :boolean{
        return <boolean>this.boxInstructions[RenderInstructionSchedule.S_HAS_PICTURE];
    }

    // Marriage (2)
    public getMDateInstruction() :Instruction{
        if(RenderInstructionSchedule.M_DATE in this.spouseInstructions){
            return this.spouseInstructions[RenderInstructionSchedule.M_DATE];
        }
        return null;
    }

    public getMPlaceInstruction() :Instruction{
        if(RenderInstructionSchedule.M_PLACE in this.spouseInstructions){
            return this.spouseInstructions[RenderInstructionSchedule.M_PLACE];
        }
        return null;
    }

    // Instruction Sets (5)
    public getBoxInstructions() :{[s:string] :any}{
        return this.boxInstructions;
    }

    public getTextInstructions() :{[s:string] :any}{
        return this.textInstructions;
    }

    public getNodeInstructions() :{[s:string] :Instruction}{
        return this.nodeInstructions;
    }

    public getSpouseInstructions() :{[s:string] :Instruction}{
        return this.spouseInstructions;
    }

    public getPictureInstructions() :{[s:string] :Instruction}{
        return this.pictureInstructions;
    }

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[]||[]>
//[o]=[o]==[o]=[o]=[o]=[o][o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=]/                    \[[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o][]||[]>
//============================================================]>        OTHER       <[===========================================================[]()[]>
//[o]=[o]==[o]=[o]=[o]=[o][o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=]\                    /[[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o][]||[]>
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[]||[]>

    /**
     * Removes everything from the RIS EXCEPT for the status of the pictures.
     * @returns {RenderInstructionSchedule} The blank-slate RIS
     */
    public clear() : RenderInstructionSchedule{
        var has_pic = this.boxInstructions[RenderInstructionSchedule.HAS_PICTURE];
        var s_has_pic = this.boxInstructions[RenderInstructionSchedule.S_HAS_PICTURE];
        this.boxInstructions = {};
        this.textInstructions = {};
        this.nodeInstructions = {};
        this.spouseInstructions = {};
        this.pictureInstructions = {};
        this.boxInstructions[RenderInstructionSchedule.HAS_PICTURE] = has_pic;
        this.boxInstructions[RenderInstructionSchedule.S_HAS_PICTURE] = s_has_pic;
        return this;
    }

    public clone() :RenderInstructionSchedule{
        return <RenderInstructionSchedule>JSON.parse(JSON.stringify(this));
    }

    public toString() :string{
        return JSON.stringify(this);
    }

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[]||[]>
//[o]=[o]==[o]=[o]=[o]=[o][o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=]/                    \[[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o][]||[]>
//============================================================]>       STATICS      <[===========================================================[]()[]>
//[o]=[o]==[o]=[o]=[o]=[o][o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=]\                    /[[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o][]||[]>
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[]||[]>

    // Generic (2-parameter) Controls for node-specific options:
    static NAME = "name";
    static PICTURE = "pic";
    static PICTURE_DIM = "pic_dim";
    static S_PICTURE_DIM = "s_pic_dim";
    static B_DATE = "b_d";
    static B_PLACE = "b_p";
    static D_DATE = "d_d";
    static D_PLACE = "d_p";
    static LIFE_SPAN = "life_span";
    static HAS_PICTURE = "has_pic"; // used to track the picture status.

    static S_NAME = "s_name";
    static S_PICTURE = "s_pic";
    static S_B_DATE = "s_b_d";
    static S_B_PLACE = "s_b_p";
    static S_D_DATE = "s_d_d";
    static S_D_PLACE = "s_d_p";
    static S_LIFE_SPAN = "s_life_span";
    static S_HAS_PICTURE = "s_has_pic"; // used to track the picture status.
    static MULTIPLE_SPOUSES = "multi_spouse"; // Changes the way that the computer makes use of the RIS information.

    static M_DATE = "m_d";
    static M_PLACE = "m_p";

    // Specific (1-parameter) Controls for box-scope options:
    static DEF_FONT_SIZE = "d_f_size";
    static ALT_FONT_SIZE = "a_f_size";
    static BORDER_WIDTH = "bor_width";
    static TEXT_ROTATED = "t_rot"; // Not currently implemented for use.
    static PICTURE_ROTATED = "p_rot"; // Not currently implemented for use.
    static BOX_ROTATED = "b_rot";
    static SPOUSE_BOX = "s_box";
    static AUTO_PASTEL_BORDER_MODE = "auto_pastel_border";
    static BOLD = "bold";
    static FLAVOR_KEY = "flavor_key";
    static CORNER_ROUNDING = "rounding";
    static BORDER_COLOR = "border_color"
}