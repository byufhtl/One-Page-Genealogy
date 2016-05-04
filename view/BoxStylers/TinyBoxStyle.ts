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

    applyStyleTo(box :IBox, showMarriage :boolean, flavor_key :string = null){
        var start_x = 8;
        var start_y = 10;
        var s_start_x = 55;
        var s_start_y = 18;
        var big_font_size = 9;
        var small_font_size = 8;

        // Basic data
        var render_sched = box.getRenderInstructions().wipe();

        render_sched
            .addInstruction(RenderInstructionSchedule.DEF_FONT_SIZE, big_font_size)
            .addInstruction(RenderInstructionSchedule.ALT_FONT_SIZE, small_font_size)
            .addInstruction(RenderInstructionSchedule.BORDER_WIDTH, 1)
            .addInstruction(RenderInstructionSchedule.NAME_L, 24);

        box.setWidth(200);

        if(box.getSpouseNode() && box.getNode().getDisplaySpouse() && showMarriage){
            // Married Flavor

            box.setHeight(30);
            render_sched
                .addInstruction(RenderInstructionSchedule.NAME_L, 16)
                .addInstruction(RenderInstructionSchedule.NAME, start_x, start_y)
                .addInstruction(RenderInstructionSchedule.LIFE_SPAN, start_x, start_y + 5 + big_font_size)
                .addInstruction(RenderInstructionSchedule.S_NAME, s_start_x, s_start_y)
                .addInstruction(RenderInstructionSchedule.S_LIFE_SPAN, s_start_x, start_y + 5 + big_font_size);
        }
        else{
            // Single Flavor
            box.setHeight(21);
            render_sched
                .addInstruction(RenderInstructionSchedule.NAME, start_x, start_y)
                .addInstruction(RenderInstructionSchedule.LIFE_SPAN, start_x + 135, start_y );
        }

        box.setRenderInstructions(render_sched);
    }
}