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

    applyStyleTo(box :IBox, flavor_key :string){
        var start_x = 8;
        var start_y = 10;
        var s_start_x = 55;
        var s_start_y = 18;
        var big_font_size = 9;
        var small_font_size = 8;

        // Basic data
        var render_sched = new RenderInstructionSchedule().setFlavorKey(flavor_key);

        render_sched
            .setDefTextSize(big_font_size)
            .setAltTextSize(small_font_size)
            .setBoxBorder(1);

        box.setWidth(200);

        if(flavor_key === TinyBoxStyle.MARRIED){
            // Married Flavor

            box.setHeight(30);
            render_sched
                .setNodeName(new Instruction(start_x, start_y, 16))
                .setNodeSpan(new Instruction(start_x, start_y + 5 + big_font_size, null))
                .setSpouseName(new Instruction(s_start_x + 105, s_start_y, 16))
                .setSpouseSpan(new Instruction(s_start_x + 105, s_start_y + 5 + big_font_size, null));
        }
        else if(flavor_key === TinyBoxStyle.SINGLE){
            // Single Flavor
            box.setHeight(21);
            render_sched
                .setNodeName(new Instruction(start_x,start_y,24))
                .setNodeSpan(new Instruction(start_x + 135, start_y, null));
        }
        else{
            console.log("Bad flavor in tiny box for [" + box.getNode().getAttr("name") + "], [" + flavor_key + "]!");
        }

        box.setRenderInstructions(render_sched);
    }

    static SINGLE  = "s";
    static MARRIED = "m";
}