///<reference path="../../model/IBox.ts"/>
///<reference path="../boxRenderers/RenderInstructionSchedule.ts"/>
/**
 * Created by calvinmcm on 4/14/16.
 * Last Updated 5/13/16
 *
 *
 * The Mini Box Style is a compact box suitable for most charts. It is designed to be the minimal size box that still
 * contains all of the information available for the person, leaving out the picture information. This makes it ideal
 * for most compact styles, and allows it to have a faster loading speed. The box has a standard height of 300 pixels,
 * and a width of 1000/750 pixels for married/single flavors respectively. The style has two flavors: Married, and
 * Single. It includes all available information except for pictures.
 */
class MiniBoxStyle{

    public static applyStyleTo(box :IBox, flavor_key :string, deep :boolean  = true) :void{
        var big_font_size = 10;
        var small_font_size = 9;

        //~~~ Setup ~~~

        var render_sched :RenderInstructionSchedule;

        if(deep){
            render_sched = new RenderInstructionSchedule()
                .setFlavorKey(flavor_key)
                .setDefTextSize(big_font_size)
                .setAltTextSize(small_font_size);
        }
        else{
            render_sched = box.getRenderInstructions();
        }

        var styled :boolean = false;

        //~~~ Married Flavors ~~~

        if(render_sched.getFlavorKey() === MiniBoxStyle.MARRIED){
            MiniBoxStyle.applyMarriedFlavor(box, render_sched);
            styled = true;
        }

        //~~~ Single Flavors ~~~

        if(render_sched.getFlavorKey() === MiniBoxStyle.SINGLE){
            MiniBoxStyle.applySingleFlavor(box, render_sched);
            styled = true;
        }
        else if(render_sched.getFlavorKey() === MiniBoxStyle.SINGLE_BUBBLE){
            MiniBoxStyle.applySingleBubbleFlavor(box, render_sched);
            styled = true;
        }

        if(!styled){
            MiniBoxStyle.applyStyleTo(box, MiniBoxStyle.SINGLE, deep);
        }

        box.setRenderInstructions(render_sched);
    }

    private static applyMarriedFlavor(box :IBox, render_sched :RenderInstructionSchedule) :void{
        if(box.getNode().getSpouses().length === 0){
            render_sched.setFlavorKey(MiniBoxStyle.SINGLE);
            return;
        }
        var start_x = 5;
        var start_y = 13;
        var s_start_x = 5;
        var s_start_y = 35;
        var small_font_size = 9;
        var dateLength = 18;
        var placeLength = 16;
        box.setHeight(60);
        box.setWidth(255);

        render_sched
            .setBorderWidth(2)
            .setNodeName(new Instruction(start_x, start_y + 2, 17))
            .setNodeBDate(new Instruction(start_x + 107, start_y - 4, dateLength))
            .setNodeBPlace(new Instruction(start_x + 169, start_y - 4, placeLength))
            .setNodeDDate(new Instruction(start_x + 107, start_y + small_font_size - 3, dateLength))
            .setNodeDPlace(new Instruction(start_x + 169, start_y + small_font_size - 3, placeLength))

            .setSpouseName(new Instruction(s_start_x, s_start_y + 2, 18))
            .setSpouseBDate(new Instruction(s_start_x + 107, s_start_y - 4, dateLength))
            .setSpouseBPlace(new Instruction(s_start_x + 169, s_start_y - 4, placeLength))
            .setSpouseDDate(new Instruction(s_start_x + 107, s_start_y + small_font_size - 3, dateLength))
            .setSpouseDPlace(new Instruction(s_start_x + 169, s_start_y + small_font_size - 3, placeLength))

            .setMarriageDate(new Instruction(75, s_start_y + 17, dateLength))
            .setMarriagePlace(new Instruction(175, s_start_y + 17, dateLength))

    }

    private static applySingleFlavor(box :IBox, render_sched :RenderInstructionSchedule) :void{
        var start_x = 5;
        var start_y = 13;
        var small_font_size = 9;
        var dateLength = 18;
        var placeLength = 16;
        box.setHeight(28);
        box.setWidth(255);

        render_sched
            .setBorderWidth(2)
            .setNodeName(new Instruction(start_x, start_y+2, 16))
            .setNodeBDate(new Instruction(start_x + 107, start_y - 4,dateLength))
            .setNodeBPlace(new Instruction(start_x + 169, start_y - 4,placeLength))
            .setNodeDDate(new Instruction(start_x + 107, start_y + small_font_size - 3,dateLength))
            .setNodeDPlace(new Instruction(start_x + 169, start_y + small_font_size - 3,placeLength));
    }

    private static applySingleBubbleFlavor(box :IBox, render_sched :RenderInstructionSchedule) :void{
        box.setHeight(105);
        box.setWidth(105);

        var start_x = 20;
        var start_y = 38;
        var big_font_size = 10;
        var small_font_size = 9;
        var dateLength = 14;
        var placeLength = 14;

        render_sched
            .setNodeName(new Instruction(start_x, start_y+2, 15))
            .setNodeBDate(new Instruction(start_x, start_y + big_font_size + 2,dateLength))
            .setNodeBPlace(new Instruction(start_x, start_y + big_font_size + small_font_size + 1,placeLength))
            .setNodeDDate(new Instruction(start_x, start_y + big_font_size + small_font_size*2 + 1,dateLength))
            .setNodeDPlace(new Instruction(start_x, start_y + big_font_size + small_font_size*3 + 1,placeLength))
            .setBorderWidth(4)
            .setCornerRounding(52)
            .setRotation(true);
    }

    static MARRIED       = "m";
    static SINGLE        = "s";
    static SINGLE_BUBBLE = "s_b";
}