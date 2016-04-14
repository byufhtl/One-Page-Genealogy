///<reference path="IBoxStyler.ts"/>
/**
 * Created by calvinmcm on 4/14/16.
 */

/**
 * The Large Box Style is suitable for many charts, though is not the most compact and should be avoided in charts where
 * this is important. The box has a standard height of 250 pixels, and a width of 700/550 pixels for married/single
 * flavors respectively. The style has two flavors: Married, and Single. It includes all available information without
 * restrictions.
 */
class LargeBoxStyle implements IBoxStyler{
    getName(){return StyleManager.LARGE;}

    applyStyleTo(box :IBox, showMarriage :boolean){
        var start_x = 60;
        var start_y = 5;
        var s_start_x = 340;
        var s_start_y = 5;
        var big_font_size = 19;
        var small_font_size = 14;

        // Basic data
        var render_sched = new RenderInstructionSchedule(big_font_size,small_font_size)
            .addInstruction(RenderInstructionSchedule.PICTURE,start_x - 55,start_y)
            .addInstruction(RenderInstructionSchedule.PICTURES_DIM,50,50)
            .addInstruction(RenderInstructionSchedule.NAME,start_x,start_y)
            .addInstruction(RenderInstructionSchedule.B_DATE,start_x,start_y + big_font_size + 8)
            .addInstruction(RenderInstructionSchedule.B_PLACE,start_x + 70,start_y + big_font_size + 8)
            .addInstruction(RenderInstructionSchedule.D_DATE,start_x,start_y + big_font_size + small_font_size + 16)
            .addInstruction(RenderInstructionSchedule.D_PLACE,start_x + 70,start_y + big_font_size + small_font_size + 16); // 145?

        box.setHeight(250);

        if(box.getSpouseNode() && box.getNode().getDisplaySpouse() && showMarriage){
            // Married Flavor

            box.setWidth(700);
            render_sched
                .addInstruction(RenderInstructionSchedule.S_PICTURE,s_start_x - 55,s_start_y)
                .addInstruction(RenderInstructionSchedule.S_NAME,s_start_x,s_start_y)
                .addInstruction(RenderInstructionSchedule.S_B_DATE,s_start_x,s_start_y + big_font_size + 8)
                .addInstruction(RenderInstructionSchedule.S_B_PLACE,s_start_x + 70,s_start_y + big_font_size + 8)
                .addInstruction(RenderInstructionSchedule.S_D_DATE,s_start_x,s_start_y + big_font_size + small_font_size + 16)
                .addInstruction(RenderInstructionSchedule.S_D_PLACE,s_start_x + 70, s_start_y + big_font_size + small_font_size*2 + 16)
                .addInstruction(RenderInstructionSchedule.M_DATE, 300,s_start_y + big_font_size + small_font_size*2 + 16)
                .addInstruction(RenderInstructionSchedule.M_PLACE, 400,s_start_y + big_font_size + small_font_size*2 + 16);
        }
        else{
            // Single Flavor
            box.setWidth(450);
        }

        box.setRenderInstructions(render_sched);
    }
}