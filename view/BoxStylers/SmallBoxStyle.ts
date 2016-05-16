///<reference path="../../model/IBox.ts"/>
///<reference path="../boxRenderers/RenderInstructionSchedule.ts"/>
/**
 * Created by calvinmcm on 4/14/16.
 * Last Updated 5/13/16
 *
 *
 * The Small Box Flavor is a good-sized box suitable for most charts. It is designed to be the minimal size box that still
 * contains all of the information available for the person. This makes it ideal for most compact styles. The box has a
 * standard height of 300 pixels, and a width of 1000/750 pixels for married/single flavors respectively. The style has
 * two flavors: Married, and Single. It includes all available information without restrictions.
 */
class SmallBoxStyle{

    public static applyStyleTo(box :IBox, flavor_key :string, deep :boolean = true) :void{
        var big_font_size = 18;
        var small_font_size = 13;

        //~~~ Setup ~~~

        var render_sched :RenderInstructionSchedule;
        if(deep){
            render_sched = new RenderInstructionSchedule()
                .setFlavorKey(flavor_key)
                .setDefTextSize(big_font_size)
                .setAltTextSize(small_font_size)
                .setHasPicture(box.getRenderInstructions().getHasPicture())
                .setSpouseHasPicture(box.getRenderInstructions().getSpouseHasPicture());
        }
        else{
            render_sched = box.getRenderInstructions();
        }

        var styled :boolean = false;

        //~~~ Married Flavors ~~~

        if(render_sched.getFlavorKey() === SmallBoxStyle.MARRIED_WIDE){
            SmallBoxStyle.applyMarriedWideFlavor(box,render_sched);
            styled = true;
        }

        //~~~ Single Flavors ~~~

        if(render_sched.getFlavorKey() === SmallBoxStyle.SINGLE_WIDE){
            SmallBoxStyle.applySingleWideFlavor(box, render_sched);
            styled = true;
        }
        else if(render_sched.getFlavorKey() === SmallBoxStyle.SINGLE_LONG){
            SmallBoxStyle.applySingleLongFlavor(box, render_sched);
            styled = true;
        }
        else if(render_sched.getFlavorKey() === SmallBoxStyle.SINGLE_LONG_FAT) {
            SmallBoxStyle.applySingleLongFatFlavor(box, render_sched);
            styled = true;
        }
        else if(render_sched.getFlavorKey() === SmallBoxStyle.SINGLE_BUBBLE){
            SmallBoxStyle.applySingleBubbleFlavor(box, render_sched);
            styled = true;
        }

        if(!styled){
            SmallBoxStyle.applyStyleTo(box, SmallBoxStyle.SINGLE_LONG, deep);
        }

        box.setRenderInstructions(render_sched);
    }

    private static applyMarriedWideFlavor(box :IBox, render_sched :RenderInstructionSchedule) :void{
        var big_font_size = 18;
        var small_font_size = 13;
        var nameLength = 16;
        var dateLength = 12;
        var placeLength = 13;

        box.setHeight(250);
        box.setWidth(160);

        if(box.getNode().getSpouses().length == 0){
            render_sched.setFlavorKey(SmallBoxStyle.SINGLE_LONG_FAT);
            return;
        }

        var start_x = 10;
        var s_start_x = 10;
        var start_y :number;
        var s_start_y :number;

        // Put the man on top for consistency (Not sexism, just because there are likely to be fewer plural men)
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
            .setNodeBPlace(new Instruction(start_x + 90, start_y + big_font_size, placeLength))
            .setNodeDDate(new Instruction(start_x, start_y + big_font_size + small_font_size + 3, dateLength))
            .setNodeDPlace(new Instruction(start_x + 90, start_y + big_font_size + small_font_size + 3, placeLength))

            .setSpouseName(new Instruction(s_start_x, s_start_y, nameLength))
            .setSpouseBDate(new Instruction(s_start_x, s_start_y + big_font_size, dateLength))
            .setSpouseBPlace(new Instruction(s_start_x + 90, s_start_y + big_font_size, placeLength))
            .setSpouseDDate(new Instruction(s_start_x, s_start_y + big_font_size + small_font_size + 3, dateLength))
            .setSpouseDPlace(new Instruction(s_start_x + 90, s_start_x + big_font_size + small_font_size + 3 + 8))

            .setMarriageDate(new Instruction(s_start_x, 141))
            .setMarriagePlace(new Instruction(s_start_x + 45, 141))

            .setBoldID(box.getNode().getId())
            .setRotation(true);
    }

    private static applySingleWideFlavor(box :IBox, render_sched :RenderInstructionSchedule) :void{
        box.setHeight(250);
        box.setWidth(70);

        var start_x = 12;
        var start_y = 21;
        var big_font_size = 18;
        var small_font_size = 13;
        var nameLength = 16;
        var dateLength = 12;
        var placeLength = 12;

        if(render_sched.getHasPicture()){
            start_x += 60;
        }

        render_sched
            .setPicturePlace(new Instruction(start_x - 60, start_y - 16))
            .setPictureDim(new Instruction(55,55,null))
            .setNodeName(new Instruction(start_x, start_y, nameLength))
            .setNodeBDate(new Instruction(start_x, start_y + big_font_size, dateLength))
            .setNodeBPlace(new Instruction(start_x + 87, start_y + big_font_size, placeLength))
            .setNodeDDate(new Instruction(start_x, start_y + big_font_size + small_font_size + 3, dateLength))
            .setNodeDPlace(new Instruction(start_x + 87, start_y + big_font_size + small_font_size + 3, placeLength))
            .setRotation(true);
    }

    private static applySingleLongFlavor(box :IBox, render_sched :RenderInstructionSchedule) :void{

        var start_x = 5;
        var start_y = 21;
        var big_font_size = 18;
        var small_font_size = 13;
        var nameLength = 16;
        var dateLength = 12;
        var placeLength = 12;

        box.setHeight(73);
        box.setWidth(250);

        if(render_sched.getHasPicture()){
            start_x += 60;
        }

        render_sched
            .setPicturePlace(new Instruction(start_x - 60, start_y - 16))
            .setPictureDim(new Instruction(55,55,null))
            .setNodeName(new Instruction(start_x, start_y, nameLength))
            .setNodeBDate(new Instruction(start_x, start_y + big_font_size, dateLength))
            .setNodeBPlace(new Instruction(start_x + 87, start_y + big_font_size, placeLength))
            .setNodeDDate(new Instruction(start_x, start_y + big_font_size + small_font_size + 3, dateLength))
            .setNodeDPlace(new Instruction(start_x + 87, start_y + big_font_size + small_font_size + 3, placeLength));
    }

    private static applySingleLongFatFlavor(box :IBox, render_sched :RenderInstructionSchedule) :void{
        box.setHeight(105);
        box.setWidth(160);

        var start_x = 5;
        var start_y = 21;
        var big_font_size = 18;
        var small_font_size = 13;
        var nameLength = 13;
        var dateLength = 12;
        var placeLength = 13;

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
/**/
    private static applySingleBubbleFlavor(box :IBox, render_sched :RenderInstructionSchedule) :void{
        box.setHeight(212);
        box.setWidth(212);

        var start_x = 25;
        var start_y = 95;
        var big_font_size = 18;
        var small_font_size = 13;
        var nameLength = 17;
        var dateLength = 12;
        var placeLength = 14;

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

    static MARRIED_WIDE     = "m_w";
    static SINGLE_WIDE      = "s_w";
    static SINGLE_LONG      = "s_l";
    static SINGLE_LONG_FAT  = "s_l_f";
    static SINGLE_BUBBLE    = "s_b";
}