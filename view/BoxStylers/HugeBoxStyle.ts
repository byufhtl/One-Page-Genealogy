///<reference path="../../model/IBox.ts"/>
///<reference path="../boxRenderers/RenderInstructionSchedule.ts"/>
/**
 * Created by calvinmcm on 4/14/16.
 * Last Updated 5/13/16
 *
 *
 * The Huge Box Style is a very large box designed for family reunion style charts. The box has a standard height of 300
 * pixels, and a width of 1000/750 pixels for married/single flavors respectively. The style has two flavors: Married,
 * and Single. It includes all available information without restrictions.
 */
class HugeBoxStyle{

    public static applyStyleTo(box :IBox, flavor_key :string, deep :boolean = true) :void{
        var big_font_size = 50;
        var small_font_size = 35;

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

        if(render_sched.getFlavorKey() === HugeBoxStyle.MARRIED){
            HugeBoxStyle.applyMarriedFlavor(box, render_sched);
            styled = true;
        }

        //~~~Single Flavors ~~~

        if(render_sched.getFlavorKey() === HugeBoxStyle.SINGLE){
            HugeBoxStyle.applySingleFlavor(box, render_sched);
            styled = true;
        }

        if(!styled){
            HugeBoxStyle.applyStyleTo(box, HugeBoxStyle.SINGLE, deep);
        }

        box.setRenderInstructions(render_sched);
    }

    private static applyMarriedFlavor(box :IBox, render_sched :RenderInstructionSchedule) :void{

        if(box.getNode().getSpouses().length === 0){
            render_sched.setFlavorKey(HugeBoxStyle.SINGLE);
            return;
        }

        box.setHeight(1250);
        box.setWidth(300);
        var start_x :number;
        var start_y = 53;
        var s_start_x :number;
        var s_start_y = 53;
        var big_font_size = 50;
        var small_font_size = 35;
        var nameLength = 18;
        var dateLength = 18;
        var placeLength = 18;

        if (box.getNode().getAttr('gender') === "Male") {
            start_x = 55;
            s_start_x = 625;
        }
        else {
            start_x = 625;
            s_start_x = 55;
        }

        render_sched
            .setNodeName(new Instruction(start_x, start_y, nameLength))
            .setSpouseName(new Instruction(s_start_x, s_start_y, nameLength));

        if(render_sched.getHasPicture() || render_sched.getSpouseHasPicture()) {
            start_x += 280;
            s_start_x += 280;
            if (render_sched.getHasPicture()) {
                render_sched
                    .setPicturePlace(new Instruction(start_x - 275, start_y + 8))
                    .setPictureDim(new Instruction(275, 200, null));
            }
            else {
                render_sched
                    .setSpousePicturePlace(new Instruction(start_x - 275, start_y + 8))
                    .setSpousePictureDim(new Instruction(275, 200, null));
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


            .setMarriageDate(new Instruction(400, 280, dateLength))
            .setMarriagePlace(new Instruction(550, 280, placeLength))

            .setCornerRounding(17)
            .setRotation(true);
    }

    private static applySingleFlavor(box :IBox, render_sched :RenderInstructionSchedule) :void{
        box.setHeight(850);
        box.setWidth(300);
        var start_x = 27;
        var start_y = 53;
        var big_font_size = 50;
        var small_font_size = 35;
        var nameLength = 18;
        var dateLength = 18;
        var placeLength = 18;

        if(render_sched.getHasPicture()) {
            start_x += 280;
            render_sched
                .setPicturePlace(new Instruction(start_x - 280, start_y - 40))
                .setPictureDim(new Instruction(275,275));
        }

        render_sched
            .setNodeName(new Instruction(start_x, start_y, nameLength))
            .setNodeBDate(new Instruction(start_x, start_y + big_font_size + 10, dateLength))
            .setNodeBPlace(new Instruction(start_x + 230, start_y + big_font_size + 10, placeLength))
            .setNodeDDate(new Instruction(start_x, start_y + big_font_size + small_font_size + 20, dateLength))
            .setNodeDPlace(new Instruction(start_x + 230, start_y + big_font_size + small_font_size + 20, placeLength))
            .setRotation(true);
    }

    static MARRIED = "m";
    static SINGLE  = "s";
}