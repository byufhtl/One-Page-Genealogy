///<reference path="../../model/IBox.ts"/>
///<reference path="../boxRenderers/RenderInstructionSchedule.ts"/>
/**
 * Created by calvinmcm on 4/14/16.
 * Last Updated 5/13/16
 *
 *
 * The Medium Box Style is a good-sized box suitable for various roles in most charts. The box has a standard height of 300
 * pixels, and a width of 1000/740 pixels for married/single flavors respectively. The style has two flavors: Married,
 * and Single. It includes all available information without restrictions.
 */
class MediumBoxStyle{

    public static applyStyleTo(box :IBox, flavor_key :string, deep :boolean = true) :void{
        var big_font_size = 28;
        var small_font_size = 14;

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

        if(render_sched.getFlavorKey() === MediumBoxStyle.MARRIED_WIDE){
            MediumBoxStyle.applyMarriedWideFlavor(box, render_sched);
            styled = true;
        }

        //~~~ Single Flavors ~~~

        if(render_sched.getFlavorKey() === MediumBoxStyle.SINGLE_WIDE){
            MediumBoxStyle.applySingleWideFlavor(box, render_sched);
            styled = true;
        }
        else if(render_sched.getFlavorKey() === MediumBoxStyle.SINGLE_LONG){
            MediumBoxStyle.applySingleLongFlavor(box, render_sched);
            styled = true;
        }
        else if(render_sched.getFlavorKey() === MediumBoxStyle.SINGLE_LONG_FAT){
            MediumBoxStyle.applySingleLongFatFlavor(box, render_sched);
            styled = true;
        }
        else if(render_sched.getFlavorKey() === MediumBoxStyle.SINGLE_BUBBLE){
            MediumBoxStyle.applySingleBubbleFlavor(box, render_sched);
            styled = true;
        }

        if(!styled){
            MediumBoxStyle.applyStyleTo(box, MediumBoxStyle.SINGLE_LONG, deep);
        }

        box.setRenderInstructions(render_sched);
    }

    private static applyMarriedWideFlavor(box :IBox, render_sched :RenderInstructionSchedule) :void{

        if(box.getNode().getSpouses().length == 0){
            render_sched.setFlavorKey(MediumBoxStyle.SINGLE_LONG_FAT);
            return;
        }

        box.setHeight(340);
        box.setWidth(235);

        var start_x = 22;
        var s_start_x = 22;
        var s_start_y :number;
        var start_y :number;
        var big_font_size = 28;
        var small_font_size = 14;
        var nameLength = 16;
        var dateLength = 18;
        var placeLength = 18;

        if (box.getNode().getAttr('gender') === "Male") {
            start_y = 29;
            s_start_y = 140;
        }
        else {
            start_y = 140;
            s_start_y = 29;
        }

        render_sched
            .setNodeName(new Instruction(start_x, start_y, nameLength))
            .setSpouseName(new Instruction(s_start_x, s_start_y, nameLength));

        if (render_sched.getHasPicture() || render_sched.getSpouseHasPicture()) {
            start_x += 72;
            s_start_x += 72;
            if (render_sched.getHasPicture()) {
                render_sched
                    .setPicturePlace(new Instruction(start_x - 80, start_y + 7))
                    .setPictureDim(new Instruction(75, 75, null));
            }
            else {
                render_sched
                    .setSpousePicturePlace(new Instruction(start_x - 80, start_y + 7))
                    .setSpousePictureDim(new Instruction(75, 75, null));
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

            .setMarriageDate(new Instruction(s_start_x, 221))
            .setMarriagePlace(new Instruction(s_start_x + 55, 221))

            .setBoldID(box.getNode().getId())
            .setRotation(true);

    }

    private static applySingleWideFlavor(box :IBox, render_sched :RenderInstructionSchedule) :void{
        var start_x = 22;
        var start_y = 29;
        var big_font_size = 28;
        var small_font_size = 14;
        var nameLength = 16;
        var dateLength = 18;
        var placeLength = 18;

        box.setHeight(380);
        box.setWidth(130);

        if (render_sched.getHasPicture()) {
            start_x += 72;
            render_sched
                .setPicturePlace(new Instruction(start_x - 80, start_y - 20))
                .setPictureDim(new Instruction(75, 75));
        }

        render_sched
            .setNodeName(new Instruction(start_x, start_y, nameLength))
            .setNodeBDate(new Instruction(start_x, start_y + big_font_size - 6, dateLength))
            .setNodeBPlace(new Instruction(start_x + 93, start_y + big_font_size - 6, placeLength))
            .setNodeDDate(new Instruction(start_x, start_y + big_font_size + small_font_size - 2, dateLength))
            .setNodeDPlace(new Instruction(start_x + 93, start_y + big_font_size + small_font_size - 2, placeLength))
            .setRotation(true);
    }

    private static applySingleLongFlavor(box :IBox, render_sched :RenderInstructionSchedule) :void{
        var start_x = 8;
        var start_y = 29;
        var big_font_size = 28;
        var small_font_size = 14;
        var nameLength = 16;
        var dateLength = 18;
        var placeLength = 18;

        box.setHeight(130);
        box.setWidth(380);

        if (render_sched.getHasPicture()) {
            start_x += 72;
        }

        render_sched
            .setPicturePlace(new Instruction(start_x - 80, start_y - 20, placeLength))
            .setPictureDim(new Instruction(75, 75))
            .setNodeName(new Instruction(start_x, start_y, nameLength))
            .setNodeBDate(new Instruction(start_x, start_y + big_font_size - 6, dateLength))
            .setNodeBPlace(new Instruction(start_x + 93, start_y + big_font_size - 6, placeLength))
            .setNodeDDate(new Instruction(start_x, start_y + big_font_size + small_font_size - 2, dateLength))
            .setNodeDPlace(new Instruction(start_x + 93, start_y + big_font_size + small_font_size - 2, placeLength));
    }

    private static applySingleLongFatFlavor(box :IBox, render_sched :RenderInstructionSchedule) :void{
        var start_x = 8;
        var start_y = 29;
        var big_font_size = 28;
        var small_font_size = 14;
        var nameLength = 12;
        var dateLength = 11;
        var placeLength = 14;

        box.setHeight(115);
        box.setWidth(235);

        render_sched
            .setNodeName(new Instruction(start_x, start_y, nameLength));

        if (render_sched.getHasPicture()) {
            render_sched
                .setPicturePlace(new Instruction(start_x, start_y + 5, placeLength))
                .setPictureDim(new Instruction(75, 70));
            start_x += 80;
        }

        render_sched
            .setNodeBDate(new Instruction(start_x, start_y + big_font_size - 6, dateLength))
            .setNodeBPlace(new Instruction(start_x, start_y + big_font_size + small_font_size - 2, placeLength))
            .setNodeDDate(new Instruction(start_x, start_y + big_font_size + small_font_size*2 - 2, dateLength))
            .setNodeDPlace(new Instruction(start_x, start_y + big_font_size + small_font_size*3 - 2, placeLength));
    }

    private static applySingleBubbleFlavor(box :IBox, render_sched :RenderInstructionSchedule) :void{
        var start_x = 42;
        var start_y = 150;
        var big_font_size = 28;
        var small_font_size = 14;
        var nameLength = 15;
        var dateLength = 18;
        var placeLength = 18;

        box.setHeight(310);
        box.setWidth(310);

        render_sched
            .setPicturePlace(new Instruction(start_x + 68, start_y + big_font_size + small_font_size*2, placeLength))
            .setPictureDim(new Instruction(90, 90))
            .setNodeName(new Instruction(start_x, start_y, nameLength))
            .setNodeBDate(new Instruction(start_x, start_y + big_font_size - 6, dateLength))
            .setNodeBPlace(new Instruction(start_x + 80, start_y + big_font_size - 6, placeLength))
            .setNodeDDate(new Instruction(start_x, start_y + big_font_size + small_font_size - 2, dateLength))
            .setNodeDPlace(new Instruction(start_x + 80, start_y + big_font_size + small_font_size - 2, placeLength))
            .setBorderWidth(6)
            .setCornerRounding(190)
            .setRotation(true);
    }

    static MARRIED_WIDE     = "m_w";
    static SINGLE_WIDE      = "s_w";
    static SINGLE_LONG      = "s_l";
    static SINGLE_LONG_FAT  = "s_l_f";
    static SINGLE_BUBBLE    = "s_b";
}