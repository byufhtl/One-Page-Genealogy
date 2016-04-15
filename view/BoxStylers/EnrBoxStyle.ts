///<reference path="IBoxStyler.ts"/>
/**
 * Created by calvinmcm on 4/14/16.
 */

/**
 * The Enormous Box Style is a massive box designed for family reunion style charts. The box has a standard height of 400
 * pixels, and a width of 1600/1000 pixels for married/single flavors respectively. The style has two flavors: Married,
 * and Single. It includes all available information without restrictions.
 */
class EnrBoxStyle implements IBoxStyler{
    getName(){return StyleManager.ENORMOUS;}

    applyStyleTo(box :IBox, showMarriage :boolean){
        var start_x = 110;
        var start_y = 5;
        var s_start_x = 810;
        var s_start_y = 5;
        var big_font_size = 36;
        var small_font_size = 27;

        // Basic data
        var render_sched = new RenderInstructionSchedule(big_font_size,small_font_size)
            .addInstruction(RenderInstructionSchedule.PICTURE,start_x - 105,start_y)
            .addInstruction(RenderInstructionSchedule.PICTURES_DIM,100,100)
            .addInstruction(RenderInstructionSchedule.NAME,start_x,start_y)
            .addInstruction(RenderInstructionSchedule.B_DATE,start_x,start_y + big_font_size + 10)
            .addInstruction(RenderInstructionSchedule.B_PLACE,start_x + 100,start_y + big_font_size + 10)
            .addInstruction(RenderInstructionSchedule.D_DATE,start_x,start_y + big_font_size + small_font_size + 20)
            .addInstruction(RenderInstructionSchedule.D_PLACE,start_x + 100,start_y + big_font_size + small_font_size + 20)
            .addInstruction(RenderInstructionSchedule.ROTATED,1);

        box.setWidth(400);

        if(box.getSpouseNode() && box.getNode().getDisplaySpouse() && showMarriage){
            // Married Flavor

            box.setHeight(1600);
            render_sched
                .addInstruction(RenderInstructionSchedule.S_PICTURE,s_start_x - 105, s_start_y)
                .addInstruction(RenderInstructionSchedule.S_NAME,s_start_x, 5)
                .addInstruction(RenderInstructionSchedule.S_B_DATE,s_start_x, start_y + big_font_size + 10)
                .addInstruction(RenderInstructionSchedule.S_B_PLACE,s_start_x + 100, s_start_y + big_font_size + 10)
                .addInstruction(RenderInstructionSchedule.S_D_DATE,s_start_x, s_start_y + big_font_size + small_font_size + 20)
                .addInstruction(RenderInstructionSchedule.S_D_PLACE, s_start_y + big_font_size + small_font_size*2 + 20)
                .addInstruction(RenderInstructionSchedule.M_DATE,600, s_start_y + big_font_size + small_font_size*2 + 30)
                .addInstruction(RenderInstructionSchedule.M_PLACE,900, s_start_y + big_font_size + small_font_size*2 + 30);
        }
        else{
            // Single Flavor
            box.setHeight(1000);
        }

        box.setRenderInstructions(render_sched);
    }
}