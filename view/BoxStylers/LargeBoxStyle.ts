///<reference path="../../model/IBox.ts"/>
///<reference path="../boxRenderers/RenderInstructionSchedule.ts"/>
/**
 * Created by calvinmcm on 4/14/16.
 * Last Updated 5/13/16
 *
 *
 * The Large Box Style is suitable for many charts, though is not the most compact and should be avoided in charts where
 * this is important. The box has a standard height of 250 pixels, and a width of 700/550 pixels for married/single
 * flavors respectively. The style has two flavors: Married, and Single. It includes all available information without
 * restrictions.
 */
class LargeBoxStyle{

    public static applyStyleTo(box :IBox, flavor_key :string, deep :boolean =true) :void{
        var big_font_size = 40;
        var small_font_size = 22;

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

        if(render_sched.getFlavorKey() === LargeBoxStyle.MARRIED_WIDE){
            LargeBoxStyle.applyMarriedWideFlavor(box, render_sched);
            styled = true;
        }
        else if(render_sched.getFlavorKey() === LargeBoxStyle.MARRIED_WIDE_BROAD){
            LargeBoxStyle.applyMarriedWideBroadFlavor(box, render_sched);
            styled = true;
        }

        //~~~ Single Flavors ~~~

        if (render_sched.getFlavorKey() === LargeBoxStyle.SINGLE_WIDE){
            LargeBoxStyle.applySingleWideFlavor(box, render_sched);
            styled = true;
        }
        else if(render_sched.getFlavorKey() === LargeBoxStyle.SINGLE_LONG){
            LargeBoxStyle.applySingleLongFlavor(box, render_sched);
            styled = true;
        }
        else if(render_sched.getFlavorKey() === LargeBoxStyle.SINGLE_LONG_FAT){
            LargeBoxStyle.applySingleLongFatFlavor(box, render_sched);
            styled = true;
        }
        else if(render_sched.getFlavorKey() === LargeBoxStyle.SINGLE_BUBBLE){
            LargeBoxStyle.applySingleBubbleFlavor(box, render_sched);
            styled = true;
        }

        if(!styled){
            LargeBoxStyle.applyStyleTo(box, LargeBoxStyle.SINGLE_WIDE, deep);
        }

        box.setRenderInstructions(render_sched);
    }

    private static applyMarriedWideFlavor(box :IBox, render_sched :RenderInstructionSchedule) :void{
        if(box.getNode().getSpouses().length == 0){
            render_sched.setFlavorKey(LargeBoxStyle.SINGLE_LONG_FAT);
            return;
        }
        box.setHeight(450);
        box.setWidth(385);

        var start_x = 15;
        var start_y :number;
        var s_start_x = 15;
        var s_start_y :number;
        var big_font_size = 40;
        var small_font_size = 22;
        var nameLength = 18;
        var dateLength = 16;
        var placeLength = 16;

        if (box.getNode().getAttr('gender') === "Male") {
            start_y = 45;
            s_start_y = 220;
        }
        else {
            start_y = 220;
            s_start_y = 45;
        }

        render_sched
            .setNodeName(new Instruction(start_x, start_y, nameLength))
            .setSpouseName(new Instruction(s_start_x, s_start_y, nameLength));

        if (render_sched.getHasPicture() || render_sched.getSpouseHasPicture()) {
            start_x += 150;
            s_start_x += 150;
            if (render_sched.getHasPicture()) {
                render_sched
                    .setPicturePlace(new Instruction(start_x - 155, start_y + 8))
                    .setPictureDim(new Instruction(150, 130, null));
            }
            else {
                render_sched
                    .setSpousePicturePlace(new Instruction(start_x - 155, start_y + 8))
                    .setSpousePictureDim(new Instruction(150, 150, null));
            }
        }

        render_sched
            .setNodeBDate(new Instruction(start_x, start_y + big_font_size - 10, dateLength))
            .setNodeBPlace(new Instruction(start_x, start_y + big_font_size - 10 + small_font_size, placeLength))
            .setNodeDDate(new Instruction(start_x, start_y + big_font_size - 10 + small_font_size*2 + 3, dateLength))
            .setNodeDPlace(new Instruction(start_x, start_y + big_font_size - 10 + small_font_size*3 + 3, placeLength))

            .setSpouseBDate(new Instruction(s_start_x, s_start_y + big_font_size - 10, dateLength))
            .setSpouseBPlace(new Instruction(s_start_x, s_start_y + big_font_size - 10 + small_font_size, placeLength))
            .setSpouseDDate(new Instruction(s_start_x, s_start_y + big_font_size - 10 + small_font_size*2 + 3, dateLength))
            .setSpouseDPlace(new Instruction(s_start_x, s_start_x + big_font_size - 10 + small_font_size*3 + 3 + 8))

            .setMarriageDate(new Instruction(225, 360, dateLength))
            .setMarriagePlace(new Instruction(230, 360, placeLength))

            .setBoldID(box.getNode().getId())
            .setRotation(true);
    }

    private static applyMarriedWideBroadFlavor(box :IBox, render_sched :RenderInstructionSchedule) :void{
        if(box.getNode().getSpouses().length == 0){
            render_sched.setFlavorKey(LargeBoxStyle.SINGLE_WIDE);
            return;
        }
        box.setHeight(920);
        box.setWidth(185);

        var start_x :number;
        var start_y = 45;
        var s_start_x :number;
        var s_start_y = 45;
        var big_font_size = 40;
        var small_font_size = 22;
        var nameLength = 18;
        var dateLength = 16;
        var placeLength = 16;

        if (box.getNode().getAttr('gender') === "Male") {
            start_x = 27;
            s_start_x = 480;
        }
        else {
            start_x = 480;
            s_start_x = 27;
        }

        render_sched
            .setNodeName(new Instruction(start_x, start_y, nameLength))
            .setSpouseName(new Instruction(s_start_x, s_start_y, nameLength));

        if (render_sched.getHasPicture() || render_sched.getSpouseHasPicture()) {
            start_x += 150;
            s_start_x += 150;
            if (render_sched.getHasPicture()) {
                render_sched
                    .setPicturePlace(new Instruction(start_x - 155, start_y + 8))
                    .setPictureDim(new Instruction(150, 120, null));
            }
            else {
                render_sched
                    .setSpousePicturePlace(new Instruction(start_x - 155, start_y + 8))
                    .setSpousePictureDim(new Instruction(150, 120, null));
            }
        }

        render_sched
            .setNodeBDate(new Instruction(start_x, start_y + big_font_size - 10, dateLength))
            .setNodeBPlace(new Instruction(start_x, start_y + big_font_size - 10 + small_font_size, placeLength))
            .setNodeDDate(new Instruction(start_x, start_y + big_font_size - 10 + small_font_size*2 + 3, dateLength))
            .setNodeDPlace(new Instruction(start_x, start_y + big_font_size - 10 + small_font_size*3 + 3, placeLength))

            .setSpouseBDate(new Instruction(s_start_x, s_start_y + big_font_size - 10, dateLength))
            .setSpouseBPlace(new Instruction(s_start_x, s_start_y + big_font_size - 10 + small_font_size, placeLength))
            .setSpouseDDate(new Instruction(s_start_x, s_start_y + big_font_size - 10 + small_font_size*2 + 3, dateLength))
            .setSpouseDPlace(new Instruction(s_start_x, s_start_x + big_font_size - 10 + small_font_size*3 + 3 + 8))

            .setMarriageDate(new Instruction(300, 175, dateLength))
            .setMarriagePlace(new Instruction(450, 175, placeLength))

            .setBoldID(box.getNode().getId())
            .setRotation(true);
    }

    private static applySingleWideFlavor(box :IBox, render_sched :RenderInstructionSchedule) :void{
        box.setHeight(610);
        box.setWidth(185);

        var start_x = 15;
        var start_y = 45;
        var big_font_size = 40;
        var small_font_size = 22;
        var nameLength = 18;
        var dateLength = 16;
        var placeLength = 16;

        if(render_sched.getHasPicture()) {
            start_x += 150;
        }

        render_sched
            .setPicturePlace(new Instruction(start_x - 155, start_y - 40))
            .setPictureDim(new Instruction(150,150))
            .setNodeName(new Instruction(start_x,start_y, nameLength))
            .setNodeBDate(new Instruction(start_x, start_y + big_font_size + 8, dateLength))
            .setNodeBPlace(new Instruction(start_x + 160, start_y + big_font_size + 8, placeLength))
            .setNodeDDate(new Instruction(start_x, start_y + big_font_size + small_font_size + 16, dateLength))
            .setNodeDPlace(new Instruction(start_x + 160,start_y + big_font_size + small_font_size + 16, placeLength))
            .setRotation(true);
    }

    private static applySingleLongFlavor(box :IBox, render_sched :RenderInstructionSchedule) :void{
        box.setHeight(185);
        box.setWidth(610);

        var start_x = 15;
        var start_y = 45;
        var big_font_size = 40;
        var small_font_size = 22;
        var nameLength = 18;
        var dateLength = 16;
        var placeLength = 16;

        //box.setY(box.getY() - 305); // Shift the box down.
        //box.setX(box.getX() - 112); // Shift the box over.

        if(render_sched.getHasPicture()) {
            start_x += 145;
        }

        render_sched
            .setPicturePlace(new Instruction(start_x - 155, start_y))
            .setPictureDim(new Instruction(150,150))
            .setNodeName(new Instruction(start_x,start_y, nameLength))
            .setNodeBDate(new Instruction(start_x, start_y + big_font_size + 8, dateLength))
            .setNodeBPlace(new Instruction(start_x + 140, start_y + big_font_size + 8, placeLength))
            .setNodeDDate(new Instruction(start_x, start_y + big_font_size + small_font_size + 16, dateLength))
            .setNodeDPlace(new Instruction(start_x + 140,start_y + big_font_size + small_font_size + 16, placeLength))
            .setRotation(false);
    }

    private static applySingleLongFatFlavor(box :IBox, render_sched :RenderInstructionSchedule) :void{
        box.setHeight(225);
        box.setWidth(385);

        var start_x = 15;
        var start_y = 45;
        var big_font_size = 40;
        var small_font_size = 22;
        var nameLength = 14;
        var dateLength = 15;
        var placeLength = 13;

        render_sched
            .setNodeName(new Instruction(start_x,start_y, nameLength));

        if(render_sched.getHasPicture()) {
            start_x += 145;
            render_sched
                .setPicturePlace(new Instruction(start_x - 155, start_y + big_font_size + 2))
                .setPictureDim(new Instruction(150,150));
        }

        render_sched
            .setNodeBDate(new Instruction(start_x, start_y + big_font_size  + 8, dateLength))
            .setNodeBPlace(new Instruction(start_x, start_y + big_font_size  + small_font_size + 8, placeLength))
            .setNodeDDate(new Instruction(start_x, start_y + big_font_size + small_font_size*2 + 16, dateLength))
            .setNodeDPlace(new Instruction(start_x,start_y + big_font_size + small_font_size*3 + 16, placeLength))
            .setRotation(false);
    }

    private static applySingleBubbleFlavor(box :IBox, render_sched :RenderInstructionSchedule) :void{
        box.setHeight(524);
        box.setWidth(524);

        var start_x = 25;
        var start_y = 55;
        var big_font_size = 40;
        var small_font_size = 22;
        var nameLength = 18;
        var dateLength = 16;
        var placeLength = 16;

        render_sched
            .setPicturePlace(new Instruction(start_x + 162, start_y + big_font_size + small_font_size * 2 + 200))
            .setPictureDim(new Instruction(150,150))
            .setNodeName(new Instruction(start_x + 45, start_y + 190, nameLength))
            .setNodeBDate(new Instruction(start_x + 45, start_y + big_font_size + 198, dateLength))
            .setNodeBPlace(new Instruction(start_x + 210, start_y + big_font_size + 198, placeLength))
            .setNodeDDate(new Instruction(start_x + 45, start_y + big_font_size + small_font_size + 206, dateLength))
            .setNodeDPlace(new Instruction(start_x + 210, start_y + big_font_size + small_font_size + 206, placeLength))
            .setBorderWidth(7)
            .setCornerRounding(305)
            .setRotation(true);
    }

    static MARRIED_WIDE         = "m_w";
    static MARRIED_WIDE_BROAD   = "m_w_b";
    static SINGLE_LONG          = "s_l";
    static SINGLE_LONG_FAT      = "s_l_f";
    static SINGLE_WIDE          = "s_w";
    static SINGLE_BUBBLE        = "s_b";
}