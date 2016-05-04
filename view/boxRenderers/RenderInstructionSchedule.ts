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

    private map : {[i:string] :number};

    /**
     * A default font size is required for rendering. An alternative font size for non-emphasized text may also be
     * passed, but is optional and is set to be the default font size if no other value is provided.
     * @param default_font_size
     * @param alternative_font_size
     */
    constructor(default_font_size :number, alternative_font_size :number = default_font_size){
        this.map = {};
        this.addInstruction(RenderInstructionSchedule.DEF_FONT_SIZE, default_font_size)
            .addInstruction(RenderInstructionSchedule.ALT_FONT_SIZE, alternative_font_size)
            .addInstruction(RenderInstructionSchedule.PICTURE_STATUS, 0);
    }

    /**
     * Removes everything from the RIS except for the default font size, alt font size, and the picture status.
     * @returns {RenderInstructionSchedule}
     */
    public clear() : RenderInstructionSchedule{
        var def_font = this.getInstruction(RenderInstructionSchedule.DEF_FONT_SIZE);
        var alt_font = this.getInstruction(RenderInstructionSchedule.ALT_FONT_SIZE);
        var pic_stat = this.getInstruction(RenderInstructionSchedule.PICTURE_STATUS);
        this.map = {};
        if(def_font !== null) {
            this.addInstruction(RenderInstructionSchedule.DEF_FONT_SIZE, def_font);
        }
        if(alt_font !== null) {
            this.addInstruction(RenderInstructionSchedule.ALT_FONT_SIZE, alt_font);
        }
        if(pic_stat !== null) {
            this.addInstruction(RenderInstructionSchedule.PICTURE_STATUS, pic_stat);
        }
        return this;
    }

    /**
     * The only items remaining in the RIS are:
     * default font size
     * alternative font size
     * picture status
     * border width (if previously set)
     * border color (if previously set)
     * picture rotation (if previously set)
     * text rotation (if previously set)
     * box rotation (if previously set)
     * @returns {RenderInstructionSchedule}
     */
    public wipe() :RenderInstructionSchedule{
        var bor_widt = this.getInstruction(RenderInstructionSchedule.BORDER_WIDTH);
        var col_bord = this.getInstruction(RenderInstructionSchedule.COLORED_BORDER);
        var p_rot = this.getInstruction(RenderInstructionSchedule.PICTURE_ROTATED);
        var t_rot = this.getInstruction(RenderInstructionSchedule.TEXT_ROTATED);
        this.clear();
        if(bor_widt !== null) {
            this.addInstruction(RenderInstructionSchedule.BORDER_WIDTH, bor_widt);
        }
        if(col_bord !== null) {
            this.addInstruction(RenderInstructionSchedule.COLORED_BORDER, col_bord);
        }
        if(p_rot !== null) {
            this.addInstruction(RenderInstructionSchedule.PICTURE_ROTATED, p_rot);
        }
        if(t_rot !== null) {
            this.addInstruction(RenderInstructionSchedule.TEXT_ROTATED, t_rot);
        }
        return this;
    }

    /**
     * A clever little way of creating a reduced RIS. Font sizes are picture status are automatically retained, and then only
     * the elements called for in the argument list (the RIS static constants) are maintained. If no parameters are
     * supplied, ought to operate simliarly to the clear() function, although it will be a bit slower and it will return
     * a new RIS rather than overriding the old one.
     * @param args
     * @returns {RenderInstructionSchedule}
     */
    public getReducedRIS(...args :string[]) :RenderInstructionSchedule{
        var ris = this.clone().clear();
        for(var a of args){
            ris.addInstruction(args[a],this.getInstruction(args[a]));
        }
        return ris;
    }


    public clone() :RenderInstructionSchedule{
        return <RenderInstructionSchedule>JSON.parse(JSON.stringify(this));
    }

    /**
     * Adds an instruction to the schedule. This function is implemented in an interesting, but hopefully useful way.
     * The instruction is a string identifier that the renderer can pick up later. If 1 parameter is included after the
     * identifier, the identifier will then be associated with that parameter. If 2 parameters are entered, the
     * identifier will be split into identifier_x and identifier_y, associated with the first and second parameters
     * respectively. This was done to allow the code on the other end to be abbreviated by entering x,y coordinates
     * simultaneously through using the generic static identifiers provided by the class, while still allowing single
     * digit modifiers like font size to be manipulated directly. Also allows for direct parameter manipulation, as well
     * as custom parameters.
     * If it's a mess, you can change it as you like. I was just trying to speed things up a bit with some nifty
     * functions.
     * @param instr An identifier for the parameters
     * @param x     The x coordinate for the instruction or default value
     * @param y     The y coordinate for the instruction (OPTIONAL).
     * @returns {RenderInstructionSchedule}
     */
    public addInstruction(instr :string, x :number, y :number = null) :RenderInstructionSchedule{
        if(x != null && y != null) {        // If two parameters were included.
            this.map[instr + "_x"] = x;
            this.map[instr + "_y"] = y;
        }
        else if(x != null || y != null) {   // If only one parameter was included.
            this.map[instr] = x;
        }
        return this;
    }

    /**
     * Retrieves an instruction corresponding to the given string, if one exists. If no such identifier can be found,
     * returns null.
     * @param instr The instruction identifier used as a key for finding the parameter information.
     * @returns {any} the value coming out of the map, or null if no value could be found
     */
    public getInstruction(instr :string) :any{
        for(var n in this.map){             // Find the matching entry in the map
            if(n === instr){
                return this.map[n];
            }
        }
        return null;
    }

    public toString() :string{
        var str = '\n\n';
        for(var n in this.map){             // Find the matching entry in the map
            str += '[' + n + ',' + this.map[n] + ']\n';
        }
        return str;
    }

    // Generic (2-parameter) Controls for setting
    static NAME = "name";
    static PICTURE = "pic";
    static PICTURES_DIM = "pics_dim"; // Picture width and height (for both pictures)
    static B_DATE = "b_d";
    static B_PLACE = "b_p";
    static D_DATE = "d_d";
    static D_PLACE = "d_p";
    static LIFE_SPAN = "life_span";
    static S_NAME = "s_name";
    static S_PICTURE = "s_pic";
    static S_B_DATE = "s_b_d";
    static S_B_PLACE = "s_b_p";
    static S_D_DATE = "s_d_d";
    static S_D_PLACE = "s_d_p";
    static S_LIFE_SPAN = "s_life_span";
    static M_DATE = "m_d";
    static M_PLACE = "m_p";

    // Specific (1-parameter) Controls for getting
    static DEF_FONT_SIZE = "d_f_size";
    static ALT_FONT_SIZE = "a_f_size";
    static BORDER_WIDTH = "bor_width";
    static COLORED_BORDER = "col_border";
    static TEXT_ROTATED = "t_rot";
    static PICTURE_ROTATED = "p_rot";
    static BOX_ROTATED = "b_rot";
    static BOLD = "bold";
    static NAME_L = "name_l";
    static DATE_L = "date_l";
    static PLACE_L = "place_l";
    static PICTURE_STATUS = "pic_stat"; // used to track the picture status.

    static NAME_X = "name_x";
    static PICTURE_X = "pic_x";
    static PICTURES_DIM_X = "pics_dim_x"; // Picture x dimension (for both pictures)
    static B_DATE_X = "b_d_x";
    static B_PLACE_X = "b_p_x";
    static D_DATE_X = "d_d_x";
    static D_PLACE_X = "d_p_x";
    static LIFE_SPAN_X = "life_span_x";
    static S_NAME_X = "s_name_x";
    static S_PICTURE_X = "s_pic_x";
    static S_B_DATE_X = "s_b_d_x";
    static S_B_PLACE_X = "s_b_p_x";
    static S_D_DATE_X = "s_d_d_x";
    static S_D_PLACE_X = "s_d_p_x";
    static S_LIFE_SPAN_X = "s_life_span_x";
    static M_DATE_X = "m_d_x";
    static M_PLACE_X = "m_p_x";

    static NAME_Y = "name_y";
    static PICTURE_Y = "pic_y";
    static PICTURES_DIM_Y = "pics_dim_y"; // Picture y dimension (for both pictures)
    static B_DATE_Y = "b_d_y";
    static B_PLACE_Y = "b_p_y";
    static D_DATE_Y = "d_d_y";
    static D_PLACE_Y = "d_p_y";
    static LIFE_SPAN_Y = "life_span_y";
    static S_NAME_Y = "s_name_y";
    static S_PICTURE_Y = "s_pic_y";
    static S_B_DATE_Y = "s_b_d_y";
    static S_B_PLACE_Y = "s_b_p_y";
    static S_D_DATE_Y = "s_d_d_y";
    static S_D_PLACE_Y = "s_d_p_y";
    static S_LIFE_SPAN_Y = "s_life_span_y";
    static M_DATE_Y = "m_d_y";
    static M_PLACE_Y = "m_p_y";
}