///<reference path="IBoxStyler.ts"/>
/**
 * Created by calvinmcm on 4/14/16.
 */

/**
 * The Mini Box Style is a compact box suitable for most charts. It is designed to be the minimal size box that still
 * contains all of the information available for the person, leaving out the picture information. This makes it ideal
 * for most compact styles, and allows it to have a faster loading speed. The box has a standard height of 300 pixels,
 * and a width of 1000/750 pixels for married/single flavors respectively. The style has two flavors: Married, and
 * Single. It includes all available information except for pictures.
 */
class MiniBoxStyle implements IBoxStyler{
    getName(){return StyleManager.MINI;}

    applyStyleTo(box :IBox, showMarriage :boolean){
        var start_x = 5;
        var start_y = 20;
        var s_start_x = 80;
        var s_start_y = 20;
        var big_font_size = 16;
        var small_font_size = 10;

        console.log("\t making mini box for " + box.getNode().getAttr("name"));

        // Basic data
        var render_sched = new RenderInstructionSchedule(big_font_size,small_font_size)
            .addInstruction(RenderInstructionSchedule.NAME,start_x,start_y)
            .addInstruction(RenderInstructionSchedule.B_DATE,start_x,start_y + big_font_size - 2)
            .addInstruction(RenderInstructionSchedule.B_PLACE,start_x + 70,start_y + big_font_size - 2)
            .addInstruction(RenderInstructionSchedule.D_DATE,start_x,start_y + big_font_size + small_font_size - 2)
            .addInstruction(RenderInstructionSchedule.D_PLACE,start_x + 70,start_y + big_font_size + small_font_size - 2)
            .addInstruction(RenderInstructionSchedule.NAME_L,18)
            .addInstruction(RenderInstructionSchedule.DATE_L,18)
            .addInstruction(RenderInstructionSchedule.PLACE_L,16);

        box.setWidth(180);

        if(box.getSpouseNode() && box.getNode().getDisplaySpouse() && showMarriage){
            // Married Flavor

            box.setHeight(70);
            render_sched
                .addInstruction(RenderInstructionSchedule.S_NAME,s_start_x,s_start_y)
                .addInstruction(RenderInstructionSchedule.S_B_DATE,s_start_x,s_start_y + big_font_size - 2)
                .addInstruction(RenderInstructionSchedule.S_B_PLACE,s_start_x + 70,s_start_y + big_font_size - 2)
                .addInstruction(RenderInstructionSchedule.S_D_DATE,s_start_x,s_start_y + big_font_size + small_font_size - 2)
                .addInstruction(RenderInstructionSchedule.S_D_PLACE,s_start_x + 70, s_start_y + big_font_size + small_font_size*2 - 2)
                .addInstruction(RenderInstructionSchedule.M_DATE, 300,s_start_y + big_font_size + small_font_size*2 - 2)
                .addInstruction(RenderInstructionSchedule.M_PLACE, 400,s_start_y + big_font_size + small_font_size*2 - 2);
        }
        else{
            // Single Flavor
            box.setHeight(60);
        }
        console.log(render_sched.toString());

        box.setRenderInstructions(render_sched);
    }
}