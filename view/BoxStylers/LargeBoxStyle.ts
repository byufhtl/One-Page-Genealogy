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
        var start_x = 160;
        var start_y = 45;
        var s_start_x = 440;
        var s_start_y = 45;
        var big_font_size = 40;
        var small_font_size = 28;

        if(!PictureManager.hasPicture(box.getNode().getId())) {
            s_start_x -= 155;
        }

        // Basic data
        var render_sched = new RenderInstructionSchedule(big_font_size,small_font_size);

        render_sched
            .addInstruction(RenderInstructionSchedule.DEF_FONT_SIZE,big_font_size)
            .addInstruction(RenderInstructionSchedule.ALT_FONT_SIZE,small_font_size)
            .addInstruction(RenderInstructionSchedule.PICTURE,start_x - 155,start_y)
            .addInstruction(RenderInstructionSchedule.PICTURES_DIM,150,150)
            .addInstruction(RenderInstructionSchedule.NAME,start_x,start_y)
            .addInstruction(RenderInstructionSchedule.B_DATE,start_x,start_y + big_font_size + 8)
            .addInstruction(RenderInstructionSchedule.B_PLACE,start_x + 140,start_y + big_font_size + 8)
            .addInstruction(RenderInstructionSchedule.D_DATE,start_x,start_y + big_font_size + small_font_size + 16)
            .addInstruction(RenderInstructionSchedule.D_PLACE,start_x + 140,start_y + big_font_size + small_font_size + 16)
            .addInstruction(RenderInstructionSchedule.ROTATED,1)
            .addInstruction(RenderInstructionSchedule.NAME_L,18)
            .addInstruction(RenderInstructionSchedule.DATE_L,16)
            .addInstruction(RenderInstructionSchedule.PLACE_L,16);


        box.setWidth(225);

        if(box.getSpouseNode() && box.getNode().getDisplaySpouse() && showMarriage){
            // Married Flavor

            box.setHeight(890);

            if(!PictureManager.hasPicture(box.getNode().getId())) {
                s_start_x -= 155;
            }

            render_sched
                .addInstruction(RenderInstructionSchedule.S_PICTURE,s_start_x - 155,s_start_y)
                .addInstruction(RenderInstructionSchedule.S_NAME,s_start_x,s_start_y)
                .addInstruction(RenderInstructionSchedule.S_B_DATE,s_start_x,s_start_y + big_font_size + 8)
                .addInstruction(RenderInstructionSchedule.S_B_PLACE,s_start_x + 140,s_start_y + big_font_size + 8)
                .addInstruction(RenderInstructionSchedule.S_D_DATE,s_start_x,s_start_y + big_font_size + small_font_size + 16)
                .addInstruction(RenderInstructionSchedule.S_D_PLACE,s_start_x + 140, s_start_y + big_font_size + small_font_size*2 + 16)
                .addInstruction(RenderInstructionSchedule.M_DATE, 300,s_start_y + big_font_size + small_font_size*2 + 16)
                .addInstruction(RenderInstructionSchedule.M_PLACE, 400,s_start_y + big_font_size + small_font_size*2 + 16);
        }
        else{
            // Single Flavor
            box.setHeight(610);
        }

        box.setRenderInstructions(render_sched);
    }
}