///<reference path="IBoxStyler.ts"/>
/**
 * Created by calvinmcm on 4/14/16.
 */

/**
 * The Small Box Style is a good-sized box suitable for most charts. It is designed to be the minimal size box that still
 * contains all of the information available for the person. This makes it ideal for most compact styles. The box has a
 * standard height of 300 pixels, and a width of 1000/750 pixels for married/single flavors respectively. The style has
 * two flavors: Married, and Single. It includes all available information without restrictions.
 */
class SmallBoxStyle implements IBoxStyler{
    getName(){return StyleManager.SMALL;}

    applyStyleTo(box :IBox, showMarriage :boolean){
        var start_x = 50;
        var start_y = 21;
        var s_start_x = 165;
        var s_start_y = 21;
        var big_font_size = 18;
        var small_font_size = 13;

        // Basic data
        var render_sched = new RenderInstructionSchedule(big_font_size,small_font_size)
            .addInstruction(RenderInstructionSchedule.PICTURE,start_x - 35,start_y)
            .addInstruction(RenderInstructionSchedule.PICTURES_DIM,30,30)
            .addInstruction(RenderInstructionSchedule.NAME,start_x,start_y)
            .addInstruction(RenderInstructionSchedule.B_DATE,start_x,start_y + big_font_size + 5)
            .addInstruction(RenderInstructionSchedule.B_PLACE,start_x + 80,start_y + big_font_size + 5)
            .addInstruction(RenderInstructionSchedule.D_DATE,start_x,start_y + big_font_size + small_font_size + 8)
            .addInstruction(RenderInstructionSchedule.D_PLACE,start_x + 80,start_y + big_font_size + small_font_size + 8)
            .addInstruction(RenderInstructionSchedule.NAME_L,18)
            .addInstruction(RenderInstructionSchedule.DATE_L,12)
            .addInstruction(RenderInstructionSchedule.PLACE_L,14);

        box.setWidth(250);

        if(box.getSpouseNode() && box.getNode().getDisplaySpouse() && showMarriage){
            // Married Flavor

            box.setHeight(100);
            render_sched
                .addInstruction(RenderInstructionSchedule.S_PICTURE,s_start_x - 35,s_start_y)
                .addInstruction(RenderInstructionSchedule.S_NAME,s_start_x,s_start_y)
                .addInstruction(RenderInstructionSchedule.S_B_DATE,s_start_x,s_start_y + big_font_size + 5)
                .addInstruction(RenderInstructionSchedule.S_B_PLACE,s_start_x + 80,s_start_y + big_font_size + 5)
                .addInstruction(RenderInstructionSchedule.S_D_DATE,s_start_x,s_start_y + big_font_size + small_font_size + 8)
                .addInstruction(RenderInstructionSchedule.S_D_PLACE,s_start_x + 80, s_start_y + big_font_size + small_font_size*2 + 8)
                .addInstruction(RenderInstructionSchedule.M_DATE, 75,s_start_y + big_font_size + small_font_size*2 + 8)
                .addInstruction(RenderInstructionSchedule.M_PLACE, 125,s_start_y + big_font_size + small_font_size*2 + 8);
        }
        else{
            // Single Flavor
            box.setHeight(78);
        }

        box.setRenderInstructions(render_sched);
    }
}