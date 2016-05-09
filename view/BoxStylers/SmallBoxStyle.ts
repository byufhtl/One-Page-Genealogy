///<reference path="IBoxStyler.ts"/>
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
        var start_x = 5;
        var start_y = 21;
        var s_start_x = 165;
        var s_start_y = 21;
        var big_font_size = 18;
        var small_font_size = 13;
        var nameLength = 17;
        var dateLength = 12;
        var placeLength = 14;

        // Basic data
        var render_sched = new RenderInstructionSchedule()
            .setFlavorKey(flavor_key)
            .setDefTextSize(big_font_size)
            .setAltTextSize(small_font_size)
            .setHasPicture(box.getRenderInstructions().getHasPicture())
            .setSpouseHasPicture(box.getRenderInstructions().getSpouseHasPicture());

        if(box.getRenderInstructions().getHasPicture() == undefined){
            console.log(box.getRenderInstructions().toString() + "::ERROR!!!");
        }

        if(flavor_key === SmallBoxStyle.MARRIED){
            // Married Flavor

            box.setHeight(100);
            box.setWidth(250);

            if(render_sched.getHasPicture()) {
                start_x += 60;
                s_start_x += 95;
            }
            render_sched
                .setPicturePlace(new Instruction(start_x - 60, start_y - 16))
                .setPictureDim(new Instruction(55,55,null))
                .setNodeName(new Instruction(start_x, start_y, nameLength))
                .setNodeBDate(new Instruction(start_x, start_y + big_font_size, dateLength))
                .setNodeBPlace(new Instruction(start_x + 80, start_y + big_font_size, placeLength))
                .setNodeDDate(new Instruction(start_x, start_y + big_font_size + small_font_size + 3, dateLength))
                .setNodeDPlace(new Instruction(start_x + 80, start_y + big_font_size + small_font_size + 3, placeLength))
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
        else if(flavor_key === SmallBoxStyle.SINGLE_LONG){
            // Single Flavor - long
            box.setHeight(73);
            box.setWidth(250);

            nameLength = 16;
            dateLength = 12;
            placeLength = 12;

            if(render_sched.getHasPicture()){
                start_x += 60;
            }

            render_sched
                .setPicturePlace(new Instruction(start_x - 60, start_y - 16))
                .setPictureDim(new Instruction(55,55,null))
                .setNodeName(new Instruction(start_x, start_y, nameLength))
                .setNodeBDate(new Instruction(start_x, start_y + big_font_size, dateLength))
                .setNodeBPlace(new Instruction(start_x + 80, start_y + big_font_size, placeLength))
                .setNodeDDate(new Instruction(start_x, start_y + big_font_size + small_font_size + 3, dateLength))
                .setNodeDPlace(new Instruction(start_x + 80, start_y + big_font_size + small_font_size + 3, placeLength));
        }
        else if(flavor_key === SmallBoxStyle.SINGLE_LONG_FAT){
            // Single Flavor - long
            box.setHeight(105);
            box.setWidth(190);

            render_sched
                .setNodeName(new Instruction(start_x, start_y, nameLength));

            if(render_sched.getHasPicture()){
                start_x += 60;
            }

            render_sched
                .setPicturePlace(new Instruction(start_x - 60, start_y - 9 + big_font_size)) // picture under name
                .setPictureDim(new Instruction(55,55,null))
                .setNodeBDate(new Instruction(start_x, start_y + big_font_size, dateLength))
                .setNodeBPlace(new Instruction(start_x, start_y + big_font_size + small_font_size +2, placeLength))
                .setNodeDDate(new Instruction(start_x, start_y + big_font_size + small_font_size*2 + 7, dateLength))
                .setNodeDPlace(new Instruction(start_x, start_y + big_font_size + small_font_size*3 + 9, placeLength));
        }
        else if(flavor_key === SmallBoxStyle.SINGLE_WIDE){
            // Single Flavor - wide
            box.setHeight(250);
            box.setWidth(70);

            start_x = 12;
            //start_y = 20;

            nameLength = 16;
            dateLength = 12;
            placeLength = 12;

            if(render_sched.getHasPicture()){
                start_x += 60;
            }

            render_sched
                .setPicturePlace(new Instruction(start_x - 60, start_y - 16))
                .setPictureDim(new Instruction(55,55,null))
                .setNodeName(new Instruction(start_x, start_y, nameLength))
                .setNodeBDate(new Instruction(start_x, start_y + big_font_size, dateLength))
                .setNodeBPlace(new Instruction(start_x + 80, start_y + big_font_size, placeLength))
                .setNodeDDate(new Instruction(start_x, start_y + big_font_size + small_font_size + 3, dateLength))
                .setNodeDPlace(new Instruction(start_x + 80, start_y + big_font_size + small_font_size + 3, placeLength))
                .setRotation(true);
        }
        else if(flavor_key === SmallBoxStyle.SINGLE_BUBBLE){
            // Single Flavor - wide
            box.setHeight(212);
            box.setWidth(212);

            start_x = 25;
            start_y = 95;

            render_sched
                .setPicturePlace(new Instruction(start_x + 57, start_y + big_font_size + small_font_size*2))
                .setPictureDim(new Instruction(55,55,null))
                .setNodeName(new Instruction(start_x, start_y, nameLength))
                .setNodeBDate(new Instruction(start_x, start_y + big_font_size, dateLength))
                .setNodeBPlace(new Instruction(start_x + 80, start_y + big_font_size, placeLength))
                .setNodeDDate(new Instruction(start_x, start_y + big_font_size + small_font_size + 3, dateLength))
                .setNodeDPlace(new Instruction(start_x + 80, start_y + big_font_size + small_font_size + 3, placeLength))
                .setBoxBorder(5)
                .setCornerRounding(106)
                .setRotation(true);
        }
        else{

        }

        box.setRenderInstructions(render_sched);
    }

    static SINGLE_LONG      = "s_l";
    static SINGLE_LONG_FAT  = "s_l_f";
    static SINGLE_WIDE      = "s_w";
    static SINGLE_BUBBLE    = "s_b";
    static MARRIED          = "m";
}