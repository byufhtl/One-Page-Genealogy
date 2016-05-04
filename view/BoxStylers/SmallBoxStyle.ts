///<reference path="IBoxStyler.ts"/>
///<reference path="../PictureManager.ts"/>
/**
 * Created by calvinmcm on 4/14/16.
 */

/**
 * The Small Box Style is a good-sized box suitable for most charts. It is designed to be the minimal size box that still
 * contains all of the information available for the person. This makes it ideal for most compact styles. The box has a
 * standard height of 300 pixels, and a width of 1000/750 pixels for married/single flavors respectively. The style has
 * two flavors: Married, and Single. It includes all available information without restrictions.
 */
class SmallBoxStyle implements IBoxStyler{
    getName(){return StyleManager.SMALL;}

    applyStyleTo(box :IBox, flavor_key :string){
        var start_x = 65;
        var start_y = 21;
        var s_start_x = 165;
        var s_start_y = 21;
        var big_font_size = 18;
        var small_font_size = 13;
        var nameLength = 17;
        var dateLength = 12;
        var placeLength = 14;

        if(!PictureManager.hasPicture(box.getNode().getId())){
            start_x -= 60;
            s_start_x -= 60;
        }

        // Basic data
        var render_sched = new RenderInstructionSchedule().setFlavorKey(flavor_key);

        render_sched
            .setDefTextSize(big_font_size)
            .setAltTextSize(small_font_size)
            .setPicturePlace(new Instruction(start_x - 60, start_y - 16))
            .setPictureDim(new Instruction(55,55,null))
            .setNodeName(new Instruction(start_x, start_y, nameLength))
            .setNodeBDate(new Instruction(start_x, start_y + big_font_size, dateLength))
            .setNodeBPlace(new Instruction(start_x + 80, start_y + big_font_size, placeLength))
            .setNodeDDate(new Instruction(start_x, start_y + big_font_size + small_font_size + 3, dateLength))
            .setNodeDPlace(new Instruction(start_x + 80, start_y + big_font_size + small_font_size + 3, placeLength));

        box.setWidth(250);

        if(flavor_key === SmallBoxStyle.MARRIED){
            // Married Flavor

            box.setHeight(100);
            if(!PictureManager.hasPicture(box.getNode().getId())) {
                s_start_x -= 35;
            }
            render_sched
                .setSpousePicturePlace(new Instruction(s_start_x - 65,s_start_y - 16))
                .setSpousePictureDim(new Instruction(55,55,null))
                .setSpouseName(new Instruction(s_start_x, s_start_y, nameLength))
                .setSpouseBDate(new Instruction(s_start_x, s_start_y + big_font_size + 5, dateLength))
                .setSpouseBPlace(new Instruction(s_start_x + 80, s_start_y + big_font_size + 5, placeLength))
                .setSpouseDDate(new Instruction(s_start_x, s_start_y + big_font_size + small_font_size + 8, dateLength))
                .setSpouseDPlace(new Instruction(s_start_x + 80, s_start_x + big_font_size + small_font_size*2 + 8))
                .setMarriageDate(new Instruction(75, s_start_y + big_font_size + small_font_size*2 + 8))
                .setMarriagePlace(new Instruction(125, s_start_y + big_font_size + small_font_size*2 + 8))
        }
        else{
            // Single Flavor
            box.setHeight(73);
        }

        box.setRenderInstructions(render_sched);
    }

    static SINGLE  = "s";
    static MARRIED = "m";
}