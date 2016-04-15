///<reference path="IBoxStyler.ts"/>
/**
 * Created by calvinmcm on 4/14/16.
 */

/**
 * The Tiny Box Style is a compact box suitable for most charts. It is designed to be the minimal size box - containing
 * only the information regarding names and abbreviated dates. This makes it ideal for most compact styles, and allows
 * it to have a faster loading speed. The box has a standard height of 300 pixels, and a width of 1000/750 pixels for
 * married/single flavors respectively. The style has two flavors: Married, and Single. It includes only names and
 * abbreviated dates.
 */
class TinyBoxStyle implements IBoxStyler{
    getName(){return StyleManager.TINY;}

    applyStyleTo(box :IBox, showMarriage :boolean){
        var start_x = 5;
        var start_y = 18;
        var s_start_x = 55;
        var s_start_y = 18;
        var big_font_size = 14;
        var small_font_size = 9;

        // Basic data
        var render_sched = new RenderInstructionSchedule(big_font_size,small_font_size)
            .addInstruction(RenderInstructionSchedule.BORDER_WIDTH,3)
            .addInstruction(RenderInstructionSchedule.NAME_L,18)
            .addInstruction(RenderInstructionSchedule.DATE_L,18)
            .addInstruction(RenderInstructionSchedule.PLACE_L,18);

        box.setWidth(200);

        if(box.getSpouseNode() && box.getNode().getDisplaySpouse() && showMarriage){
            // Married Flavor

            box.setHeight(50);
            render_sched
                .addInstruction(RenderInstructionSchedule.NAME,start_x,start_y)
                .addInstruction(RenderInstructionSchedule.B_DATE,start_x,start_y + big_font_size - 6)
                .addInstruction(RenderInstructionSchedule.S_NAME,s_start_x,s_start_y)
                .addInstruction(RenderInstructionSchedule.S_B_DATE,s_start_x,s_start_y + big_font_size - 6);
        }
        else{
            // Single Flavor
            box.setHeight(35);
            render_sched
                .addInstruction(RenderInstructionSchedule.NAME,start_x,start_y)
                .addInstruction(RenderInstructionSchedule.B_DATE,start_x + 135,start_y - 5)
                .addInstruction(RenderInstructionSchedule.D_DATE,start_x + 135,start_y + small_font_size - 4);
        }

        box.setRenderInstructions(render_sched);
    }
}