///<reference path="IBoxStyler.ts"/>
/**
 * Created by calvinmcm on 4/14/16.
 */

/**
 * The Mini Box Style is a compact box suitable for most charts. It is designed to be the minimal size box that still
 * contains all of the information available for the person, leaving out the picture information. This makes it ideal
 * for most compact styles, and allows it to have a faster loading speed. The box has a standard height of 300 pixels,
 * and a width of 1000/750 pixels for married/single flavors respectively. The style has two flavors: Married, and
 * Single. It includes all available information except for pictures.
 */
class MiniBoxStyle implements IBoxStyler{
    getName(){return StyleManager.MINI;}

    applyStyleTo(box :IBox, flavor_key :string){
        var start_x = 5;
        var start_y = 16;
        var s_start_x = 80;
        var s_start_y = 20;
        var big_font_size = 10;
        var small_font_size = 9;
        var dateLength = 18;
        var placeLength = 16;

        // Basic data
        var render_sched = new RenderInstructionSchedule().setFlavorKey(flavor_key);

        render_sched
            .setDefTextSize(big_font_size)
            .setAltTextSize(small_font_size)
            .setBoxBorder(2)
            .setNodeName(new Instruction(start_x, start_y+2, 17))
            .setNodeBDate(new Instruction(start_x + 107, start_y - 4,dateLength))
            .setNodeBPlace(new Instruction(start_x + 162, start_y - 4,placeLength))
            .setNodeDDate(new Instruction(start_x + 107, start_y + small_font_size - 3,dateLength))
            .setNodeDPlace(new Instruction(start_x + 162, start_y + small_font_size - 3,placeLength));


        box.setWidth(255);

        if(flavor_key === MiniBoxStyle.MARRIED){
            // Married Flavor

            box.setHeight(70);
            render_sched

                .setSpouseName(new Instruction(s_start_x, s_start_y+2, 18))
                .setSpouseBDate(new Instruction(s_start_x + 104, s_start_y - 4,dateLength))
                .setSpouseBPlace(new Instruction(s_start_x + 159, s_start_y - 4,placeLength))
                .setSpouseDDate(new Instruction(s_start_x + 104, s_start_y + small_font_size - 3,dateLength))
                .setSpouseDPlace(new Instruction(s_start_x + 159, s_start_y + small_font_size - 3,placeLength))
                .setMarriageDate(new Instruction(75, s_start_y + big_font_size + small_font_size*2 -2,dateLength))
                .setMarriagePlace(new Instruction(175, s_start_y + big_font_size + small_font_size*2 -2,dateLength))
        }
        else{
            // Single Flavor
            box.setHeight(34);
        }
        console.log(render_sched.toString());

        box.setRenderInstructions(render_sched);
    }

    static SINGLE  = "s";
    static MARRIED = "m";
}