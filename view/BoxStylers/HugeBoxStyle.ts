///<reference path="IBoxStyler.ts"/>
/**
 * Created by calvinmcm on 4/14/16.
 */

/**
 * The Huge Box Style is a very large box designed for family reunion style charts. The box has a standard height of 300
 * pixels, and a width of 1000/750 pixels for married/single flavors respectively. The style has two flavors: Married,
 * and Single. It includes all available information without restrictions.
 */
class HugeBoxStyle implements IBoxStyler{
    getName(){return StyleManager.HUGE;}

    applyStyleTo(box :IBox, showMarriage :boolean, flavor_key :string = null){
        var start_x = 100;
        var start_y = 53;
        var s_start_x = 625;
        var s_start_y = 53;
        var big_font_size = 50;
        var small_font_size = 35;

        if(!PictureManager.hasPicture(box.getNode().getId())) {
            start_x -= 95;
        }

        // Basic data
        var render_sched = box.getRenderInstructions().wipe();

        render_sched
            .addInstruction(RenderInstructionSchedule.DEF_FONT_SIZE,big_font_size)
            .addInstruction(RenderInstructionSchedule.ALT_FONT_SIZE,small_font_size)
            .addInstruction(RenderInstructionSchedule.PICTURE,start_x - 95,start_y)
            .addInstruction(RenderInstructionSchedule.PICTURES_DIM,90,90)
            .addInstruction(RenderInstructionSchedule.NAME,start_x,start_y)
            .addInstruction(RenderInstructionSchedule.B_DATE,start_x,start_y + big_font_size + 10)
            .addInstruction(RenderInstructionSchedule.B_PLACE,start_x + 120,start_y + big_font_size + 10)
            .addInstruction(RenderInstructionSchedule.D_DATE,start_x,start_y + big_font_size + small_font_size + 20)
            .addInstruction(RenderInstructionSchedule.D_PLACE,start_x + 120,start_y + big_font_size + small_font_size + 20)
            .addInstruction(RenderInstructionSchedule.NAME_L,18)
            .addInstruction(RenderInstructionSchedule.DATE_L,18)
            .addInstruction(RenderInstructionSchedule.PLACE_L,18)
            .addInstruction(RenderInstructionSchedule.TEXT_ROTATED,1);

        box.setWidth(300);

        if(box.getSpouseNode() && box.getNode().getDisplaySpouse() && showMarriage){
            // Married Flavor

            box.setHeight(1000);
            render_sched
                .addInstruction(RenderInstructionSchedule.S_PICTURE,s_start_x - 95,s_start_y)
                .addInstruction(RenderInstructionSchedule.S_NAME,s_start_x,s_start_y)
                .addInstruction(RenderInstructionSchedule.S_B_DATE,s_start_x,s_start_y + big_font_size + 10)
                .addInstruction(RenderInstructionSchedule.S_B_PLACE,s_start_x + 120,s_start_y + big_font_size + 10)
                .addInstruction(RenderInstructionSchedule.S_D_DATE,s_start_x,s_start_y + big_font_size + small_font_size + 20)
                .addInstruction(RenderInstructionSchedule.S_D_PLACE,s_start_x + 120, s_start_y + big_font_size + small_font_size*2 + 20)
                .addInstruction(RenderInstructionSchedule.M_DATE, 450,s_start_y + big_font_size + small_font_size*2 + 30)
                .addInstruction(RenderInstructionSchedule.M_PLACE, 550,s_start_y + big_font_size + small_font_size*2 + 30);
        }
        else{
            // Single Flavor
            box.setHeight(750);
        }

        box.setRenderInstructions(render_sched);
    }
}