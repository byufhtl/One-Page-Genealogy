///<reference path="../../model/IBox.ts"/>
///<reference path="../boxRenderers/RenderInstructionSchedule.ts"/>
/**
 * Created by calvinmcm on 4/14/16.
 * Last Updated 5/13/16
 *
 *
 * The Tiny Box Flavor is a compact box suitable for most charts. It is designed to be the minimal size box - containing
 * only the information regarding names and abbreviated dates. This makes it ideal for most compact styles, and allows
 * it to have a faster loading speed. The box has a standard height of 300 pixels, and a width of 1000/750 pixels for
 * married/single flavors respectively. The style has two flavors: Married, and Single. It includes only names and
 * abbreviated dates.
 */
class TinyBoxStyle{

    public static applyStyleTo(box :IBox, flavor_key :string, deep :boolean = true) :void{
        var big_font_size = 7;
        var small_font_size = 6;

        //~~~ Setup ~~~

        var render_sched :RenderInstructionSchedule;

        if(deep){
            render_sched = new RenderInstructionSchedule()
                .setFlavorKey(flavor_key)
                .setDefTextSize(big_font_size)
                .setAltTextSize(small_font_size)
                .setBorderWidth(1);
        }
        else{
            render_sched = box.getRenderInstructions();
        }

        var styled :boolean = false;

        //~~~ Married Flavors ~~~

        if(render_sched.getFlavorKey() === TinyBoxStyle.MARRIED){
            TinyBoxStyle.applyMarriedFlavor(box, render_sched);
            styled = true;
        }

        //~~~ Single Flavors ~~~
        // No 'else' allows married flavors to default to single flavors if needed.

        if(render_sched.getFlavorKey() === TinyBoxStyle.SINGLE){
            TinyBoxStyle.applySingleFlavor(box, render_sched);
            styled = true;
        }
        else if(render_sched.getFlavorKey() === TinyBoxStyle.SINGLE_FAT){
            TinyBoxStyle.applySingleFatFlavor(box, render_sched);
            styled = true;
        }

        if(!styled){
            //console.log("No suitable tiny box flavor was found for " + box.getNode().getAttr('name') + " with key " + render_sched.getFlavorKey());
            TinyBoxStyle.applyStyleTo(box, TinyBoxStyle.SINGLE, deep);
        }
        //console.log(render_sched.toString());

        box.setRenderInstructions(render_sched);
    }

    private static applyMarriedFlavor(box :IBox, render_sched :RenderInstructionSchedule) :void{

        if(box.getNode().getSpouses().length === 0){
            render_sched.setFlavorKey(TinyBoxStyle.SINGLE);
            return;
        }

        box.setWidth(145);
        box.setHeight(29);
        box.setSpace(1);

        var start_x = 8;
        var s_start_x = 8;
        var start_y: number;
        var s_start_y: number;

        if(box.getNode().getAttr('gender') === "Male"){
            start_y = 7;
            s_start_y = 15;
        }
        else{
            start_y = 15;
            s_start_y = 7;
        }

        render_sched
            .setNodeName(new Instruction(start_x, start_y, 17))
            .setNodeSpan(new Instruction(start_x + 90, start_y, null))
            .setSpouseName(new Instruction(s_start_x, s_start_y, 17))
            .setSpouseSpan(new Instruction(s_start_x + 90, s_start_y, null));
    }

    private static applySingleFlavor(box :IBox, render_sched :RenderInstructionSchedule) :void{
        var start_x = 8;
        var start_y = 6;
        box.setWidth(145);
        box.setHeight(8);
        box.setSpace(2);
        render_sched
            .setNodeName(new Instruction(start_x,start_y,17))
            .setNodeSpan(new Instruction(start_x + 90, start_y, null));
    }

    private static applySingleFatFlavor(box :IBox, render_sched :RenderInstructionSchedule) :void{
        var start_x = 8;
        var start_y = 6;
        var dateLength = 14;
        box.setWidth(145);
        box.setHeight(15);
        box.setSpace(1);
        render_sched
            .setNodeName(new Instruction(start_x, start_y + 5, 17))
            .setNodeBDate(new Instruction(start_x + 90, start_y, dateLength))
            .setNodeDDate(new Instruction(start_x + 90, start_y + 8, dateLength));
    }

    static MARRIED      = "m";
    static SINGLE       = "s";
    static SINGLE_FAT   = "s_f";
}