///<reference path="IBoxStyler.ts"/>
/**
 * Created by calvinmcm on 4/14/10.
 */

/**
 * The Medium Box Style is a good-sized box suitable for various roles in most charts. The box has a standard height of 300
 * pixels, and a width of 1000/740 pixels for married/single flavors respectively. The style has two flavors: Married,
 * and Single. It includes all available information without restrictions.
 */
class MediumBoxStyle implements IBoxStyler{
    getName(){return StyleManager.MEDIUM;}

    applyStyleTo(box :IBox, showMarriage :boolean){
        var start_x = 85;
        var start_y = 29;
        var s_start_x = 80;
        var s_start_y = 219;
        var big_font_size = 28;
        var small_font_size = 14;

        // Basic data
        var render_sched = new RenderInstructionSchedule(big_font_size,small_font_size);

        render_sched
            .addInstruction(RenderInstructionSchedule.DEF_FONT_SIZE,big_font_size)
            .addInstruction(RenderInstructionSchedule.ALT_FONT_SIZE,small_font_size)
            .addInstruction(RenderInstructionSchedule.NAME_L,17)
            .addInstruction(RenderInstructionSchedule.DATE_L,18)
            .addInstruction(RenderInstructionSchedule.PLACE_L,18);

        box.setWidth(360);

        if(box.getSpouseNode() && box.getNode().getDisplaySpouse() && showMarriage){
            // Married Flavor

            box.setHeight(325);

            if(!PictureManager.hasPicture(box.getNode().getId())) {
                start_x -= 65;
                s_start_x -= 65;
            }

            render_sched
                .addInstruction(RenderInstructionSchedule.PICTURE,start_x - 65,start_y-20)
                .addInstruction(RenderInstructionSchedule.PICTURES_DIM,70,70)
                .addInstruction(RenderInstructionSchedule.NAME,start_x,start_y)
                .addInstruction(RenderInstructionSchedule.B_DATE,start_x,start_y + big_font_size + 6)
                .addInstruction(RenderInstructionSchedule.B_PLACE,start_x + 105,start_y + big_font_size + 6)
                .addInstruction(RenderInstructionSchedule.D_DATE,start_x,start_y + big_font_size + small_font_size + 10)
                .addInstruction(RenderInstructionSchedule.D_PLACE,start_x + 105,start_y + big_font_size + small_font_size + 10)
                .addInstruction(RenderInstructionSchedule.S_PICTURE,s_start_x - 65,s_start_y)
                .addInstruction(RenderInstructionSchedule.S_NAME,s_start_x,s_start_y)
                .addInstruction(RenderInstructionSchedule.S_B_DATE,s_start_x,s_start_y + big_font_size + 6)
                .addInstruction(RenderInstructionSchedule.S_B_PLACE,s_start_x + 105,s_start_y + big_font_size + 6)
                .addInstruction(RenderInstructionSchedule.S_D_DATE,s_start_x,s_start_y + big_font_size + small_font_size + 10)
                .addInstruction(RenderInstructionSchedule.S_D_PLACE,s_start_x + 105, s_start_y + big_font_size + small_font_size*2 + 10)
                .addInstruction(RenderInstructionSchedule.M_DATE, 140,s_start_y + big_font_size + small_font_size*2 + 10)
                .addInstruction(RenderInstructionSchedule.M_PLACE, 200,s_start_y + big_font_size + small_font_size*2 + 10)
                .addInstruction(RenderInstructionSchedule.ROTATED,1);
        }
        else{
            // Single Flavor
            box.setHeight(100);

            if(!PictureManager.hasPicture(box.getNode().getId())) {
                start_x -= 65;
            }

            render_sched
                .addInstruction(RenderInstructionSchedule.PICTURE,start_x - 80,start_y-20)
                .addInstruction(RenderInstructionSchedule.PICTURES_DIM,75,75)
                .addInstruction(RenderInstructionSchedule.NAME,start_x,start_y)
                .addInstruction(RenderInstructionSchedule.B_DATE,start_x,start_y + big_font_size + 6)
                .addInstruction(RenderInstructionSchedule.B_PLACE,start_x + 80,start_y + big_font_size + 6)
                .addInstruction(RenderInstructionSchedule.D_DATE,start_x,start_y + big_font_size + small_font_size + 10)
                .addInstruction(RenderInstructionSchedule.D_PLACE,start_x + 80,start_y + big_font_size + small_font_size + 10); // 145?
        }

        box.setRenderInstructions(render_sched);
    }
}