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

        //~~~ Married Flavors ~~~

        if(flavor_key === SmallBoxStyle.MARRIED_WIDE){
            // Married Flavor

            //console.log("Married Wide applied to " + box.getNode().getAttr("name"));
            box.setHeight(250);
            box.setWidth(160);

            if(box.getNode().getSpouses().length == 0){
                flavor_key = SmallBoxStyle.SINGLE_LONG_FAT;
                render_sched.setFlavorKey(flavor_key);
            }
            else {
                /*
                 Set height/width up to be different if there are multiple spouses? Or do you want to try to handle this
                 from the chart styler? You'll have to figure it out, but I think that the chart styler would be the
                 more cohesive method of making all of the boxes level.
                */

                start_x = 10;
                s_start_x = 10;

                // Put the man on top for consistency (Not sexist, just because there are likely to be fewer plural men)
                if(box.getNode().getAttr('gender') === "Male"){
                    start_y = 21;
                    s_start_y = 85;
                }
                else{
                    start_y = 85;
                    s_start_y = 21;
                }

                // Handle the Picture
                if (render_sched.getHasPicture() || render_sched.getSpouseHasPicture()) {
                    start_x += 60;
                    s_start_x += 60;
                    if(render_sched.getHasPicture()) {
                        render_sched
                            .setPicturePlace(new Instruction(start_x - 60, start_y - 16))
                            .setPictureDim(new Instruction(55, 55, null));
                    }
                    else {
                        render_sched
                            .setSpousePicturePlace(new Instruction(start_x - 60, start_y - 16))
                            .setSpousePictureDim(new Instruction(55, 55, null));
                    }
                }

                // Begin the setup
                render_sched
                    .setNodeName(new Instruction(start_x, start_y, nameLength))
                    .setNodeBDate(new Instruction(start_x, start_y + big_font_size, dateLength))
                    .setNodeBPlace(new Instruction(start_x + 80, start_y + big_font_size, placeLength))
                    .setNodeDDate(new Instruction(start_x, start_y + big_font_size + small_font_size + 3, dateLength))
                    .setNodeDPlace(new Instruction(start_x + 80, start_y + big_font_size + small_font_size + 3, placeLength))

                    .setSpouseName(new Instruction(s_start_x, s_start_y, nameLength))
                    .setSpouseBDate(new Instruction(s_start_x, s_start_y + big_font_size, dateLength))
                    .setSpouseBPlace(new Instruction(s_start_x + 80, s_start_y + big_font_size, placeLength))
                    .setSpouseDDate(new Instruction(s_start_x, s_start_y + big_font_size + small_font_size + 3, dateLength))
                    .setSpouseDPlace(new Instruction(s_start_x + 80, s_start_x + big_font_size + small_font_size + 3 + 8))

                    .setMarriageDate(new Instruction(75, 141))
                    .setMarriagePlace(new Instruction(125, 141))

                    .setBoldID(box.getNode().getId())
                    .setRotation(true);
            }
        }

        //~~~ Single Flavors ~~~

        if(flavor_key === SmallBoxStyle.SINGLE_LONG){
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
                .setNodeBPlace(new Instruction(start_x + 85, start_y + big_font_size, placeLength))
                .setNodeDDate(new Instruction(start_x, start_y + big_font_size + small_font_size + 3, dateLength))
                .setNodeDPlace(new Instruction(start_x + 85, start_y + big_font_size + small_font_size + 3, placeLength));
        }
        else if(flavor_key === SmallBoxStyle.SINGLE_LONG_FAT){
            // Single Flavor - long
            box.setHeight(105);
            box.setWidth(160);

            nameLength = 13;

            render_sched
                .setNodeName(new Instruction(start_x, start_y, nameLength));

            if(render_sched.getHasPicture()){
                start_x += 60;
                render_sched
                    .setPicturePlace(new Instruction(start_x - 60, start_y - 9 + big_font_size)) // picture under name
                    .setPictureDim(new Instruction(55,55,null));
            }

            render_sched
                .setNodeBDate(new Instruction(start_x, start_y + big_font_size, dateLength))
                .setNodeBPlace(new Instruction(start_x, start_y + big_font_size + small_font_size +2, placeLength))
                .setNodeDDate(new Instruction(start_x, start_y + big_font_size + small_font_size*2 + 7, dateLength))
                .setNodeDPlace(new Instruction(start_x, start_y + big_font_size + small_font_size*3 + 9, placeLength));
        }
        else if(flavor_key === SmallBoxStyle.SINGLE_WIDE){
            // Single Flavor - wide

            //console.log("Single Wide applied to " + box.getNode().getAttr("name"));
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
                .setBorderWidth(5)
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
    static MARRIED_WIDE     = "m_w";
}