/**
 * Created by calvinmcm on 4/13/16.
 */
class RenderInstructionSchedule{

    private map : {[i:string] :number};

    constructor(default_font_size :number, alternative_font_size :number = default_font_size){
        this.map = {};
        this.addInstruction(RenderInstructionSchedule.DEF_FONT_SIZE,default_font_size);
        this.addInstruction(RenderInstructionSchedule.ALT_FONT_SIZE,alternative_font_size);
    }

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

    public getInstruction(instr :string) :any{
        for(var n in this.map){             // Find the matching entry in the map
            if(n === instr){
                return this.map[n];
            }
        }
        return null;
    }

    // Generic (2-parameter) Controls for setting
    static NAME = "name";
    static PICTURE = "pic";
    static B_DATE = "b_d";
    static B_PLACE = "b_p";
    static D_DATE = "d_d";
    static D_PLACE = "d_p";
    static S_NAME = "s_name";
    static S_PICTURE = "s_pic";
    static S_B_DATE = "s_b_d";
    static S_B_PLACE = "s_b_p";
    static S_D_DATE = "s_d_d";
    static S_D_PLACE = "s_d_p";
    static M_DATE = "m_d";
    static M_PLACE = "m_p";

    // Specific (1-parameter) Controls for getting
    static DEF_FONT_SIZE = "d_f_size";
    static ALT_FONT_SIZE = "a_f_size";

    static NAME_X = "name_x";
    static PICTURE_X = "pic_x";
    static B_DATE_X = "b_d_x";
    static B_PLACE_X = "b_p_x";
    static D_DATE_X = "d_d_x";
    static D_PLACE_X = "d_p_x";
    static S_NAME_X = "s_name_x";
    static S_PICTURE_X = "s_pic_x";
    static S_B_DATE_X = "s_b_d_x";
    static S_B_PLACE_X = "s_b_p_x";
    static S_D_DATE_X = "s_d_d_x";
    static S_D_PLACE_X = "s_d_p_x";
    static M_DATE_X = "m_d_x";
    static M_PLACE_X = "m_p_x";

    static NAME_Y = "name_y";
    static PICTURE_Y = "pic_y";
    static B_DATE_Y = "b_d_y";
    static B_PLACE_Y = "b_p_y";
    static D_DATE_Y = "d_d_y";
    static D_PLACE_Y = "d_p_y";
    static S_NAME_Y = "s_name_y";
    static S_PICTURE_Y = "s_pic_y";
    static S_B_DATE_Y = "s_b_d_y";
    static S_B_PLACE_Y = "s_b_p_y";
    static S_D_DATE_Y = "s_d_d_y";
    static S_D_PLACE_Y = "s_d_p_y";
    static M_DATE_Y = "m_d_y";
    static M_PLACE_Y = "m_p_y";
}