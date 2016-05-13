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
        var start_y = 11;
        var s_start_x = 8;
        var s_start_y = 23;
        var big_font_size = 9;
        var small_font_size = 8;

        // Basic data
        var render_sched = new RenderInstructionSchedule().setFlavorKey(flavor_key);

        render_sched
            .setDefTextSize(big_font_size)
            .setAltTextSize(small_font_size)
            .setBorderWidth(1);

        box.setWidth(160);

        if(flavor_key === TinyBoxStyle.MARRIED){
            // Married Flavor
            if(box.getNode().getSpouses().length === 0){
                flavor_key = TinyBoxStyle.SINGLE;
            }
            else {
                box.setHeight(34);
                render_sched
                    .setNodeName(new Instruction(start_x, start_y, 17))
                    .setNodeSpan(new Instruction(start_x + 100, start_y, null))
                    .setSpouseName(new Instruction(s_start_x, s_start_y, 17))
                    .setSpouseSpan(new Instruction(s_start_x + 100, s_start_y, null));
            }
        }
        // No else to allow for emergency overflow from married flavors.
        if(flavor_key === TinyBoxStyle.SINGLE){
            // Single Flavor
            box.setHeight(21);
            render_sched
                .setNodeName(new Instruction(start_x,start_y,17))
                .setNodeSpan(new Instruction(start_x + 100, start_y, null));
        }
        else{
            //console.log("Bad flavor in tiny box for [" + box.getNode().getAttr("name") + "], [" + flavor_key + "]!");
            render_sched
                .setNodeName(new Instruction(start_x,start_y,17));
        }

        box.setRenderInstructions(render_sched);
    }

    static SINGLE  = "s";
    static MARRIED = "m";
}