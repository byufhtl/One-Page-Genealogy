///<reference path="../../model/IBox.ts"/>
///<reference path="../boxRenderers/RenderInstructionSchedule.ts"/>
/**
 * Created by calvinmcm on 4/14/16.
 * Last Updated 5/13/16
 *
 *
 * The Enormous Box Style is a massive box designed for family reunion style charts. The box has a standard height of 400
 * pixels, and a width of 1600/1000 pixels for married/single flavors respectively. The style has two flavors: Married,
 * and Single. It includes all available information without restrictions.
 */
class EnrBoxStyle{

    public static applyStyleTo(box :IBox, flavor_key :string, deep :boolean = true) :void{
        var big_font_size = 60;
        var small_font_size = 40;

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

        if(render_sched.getFlavorKey() === EnrBoxStyle.MARRIED){
            EnrBoxStyle.applyMarriedFlavor(box, render_sched);
            styled = true;
        }

        //~~~ Single Flavors ~~~

        if(render_sched.getFlavorKey() === EnrBoxStyle.SINGLE){
            EnrBoxStyle.applySingleFlavor(box, render_sched);
            styled = true;
        }

        if(!styled){
            EnrBoxStyle.applyStyleTo(box, EnrBoxStyle.SINGLE, deep);
        }

        box.setRenderInstructions(render_sched);
    }

    private static applyMarriedFlavor(box :IBox, render_sched :RenderInstructionSchedule) :void{

        if(box.getNode().getSpouses().length === 0){
            render_sched.setFlavorKey(EnrBoxStyle.SINGLE);
            return;
        }

        box.setHeight(2000);
        box.setWidth(400);
        var start_x :number;
        var start_y = 70;
        var s_start_x :number;
        var s_start_y = 70;
        var big_font_size = 60;
        var small_font_size = 40;
        var nameLength = 22;
        var dateLength = 18;
        var placeLength = 18;

        if (box.getNode().getAttr('gender') === "Male") {
            start_x = 45;
            s_start_x = 1000;
        }
        else {
            start_x = 1000;
            s_start_x = 45;
        }

        render_sched
            .setNodeName(new Instruction(start_x, start_y, nameLength))
            .setSpouseName(new Instruction(s_start_x, s_start_y, nameLength));

        if(render_sched.getHasPicture() || render_sched.getSpouseHasPicture()) {
            start_x += 345;
            s_start_x += 345;
            if (render_sched.getHasPicture()) {
                render_sched
                    .setPicturePlace(new Instruction(start_x - 340, start_y + 8))
                    .setPictureDim(new Instruction(325, 325, null));
            }
            else {
                render_sched
                    .setSpousePicturePlace(new Instruction(start_x - 340, start_y + 8))
                    .setSpousePictureDim(new Instruction(325, 325, null));
            }
        }

        render_sched
            .setNodeBDate(new Instruction( start_x, start_y + big_font_size + 10,                     dateLength))
            .setNodeBPlace(new Instruction(start_x, start_y + big_font_size + small_font_size + 10,   placeLength))
            .setNodeDDate(new Instruction( start_x, start_y + big_font_size + small_font_size*2 + 20, dateLength))
            .setNodeDPlace(new Instruction(start_x, start_y + big_font_size + small_font_size*3 + 20, placeLength))

            .setSpouseBDate(new Instruction( s_start_x, s_start_y + big_font_size + 10,                     dateLength))
            .setSpouseBPlace(new Instruction(s_start_x, s_start_y + big_font_size + small_font_size + 10,   placeLength))
            .setSpouseDDate(new Instruction( s_start_x, s_start_y + big_font_size + small_font_size*2 + 20, dateLength))
            .setSpouseDPlace(new Instruction(s_start_x, s_start_y + big_font_size + small_font_size*3 + 20, placeLength))


            .setMarriageDate(new Instruction(700, 355, dateLength))
            .setMarriagePlace(new Instruction(850, 355, placeLength))

            .setCornerRounding(25)
            .setRotation(true);
    }

    private static applySingleFlavor(box :IBox, render_sched :RenderInstructionSchedule) :void{
        box.setHeight(1200);
        box.setWidth(400);
        var start_x = 45;
        var start_y = 60;
        var big_font_size = 60;
        var small_font_size = 40;
        var nameLength = 22;
        var dateLength = 18;
        var placeLength = 18;

        if(render_sched.getHasPicture()) {
            start_x += 255;
            render_sched
                .setPicturePlace(new Instruction(start_x - 255, start_y))
                .setPictureDim(new Instruction(250,250));
        }

        render_sched
            .setNodeName(new Instruction(start_x, start_y, nameLength))
            .setNodeBDate(new Instruction(start_x, start_y + big_font_size + 10, dateLength))
            .setNodeBPlace(new Instruction(start_x + 260, start_y + big_font_size + 10, placeLength))
            .setNodeDDate(new Instruction(start_x, start_y + big_font_size + small_font_size + 20, dateLength))
            .setNodeDPlace(new Instruction(start_x + 260, start_y + big_font_size + small_font_size + 20, placeLength))
            .setRotation(true);
    }

    static MARRIED = "m";
    static SINGLE  = "s";
}