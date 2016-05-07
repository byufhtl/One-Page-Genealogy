///<reference path="IBoxStyler.ts"/>
/**
 * Created by calvinmcm on 4/14/16.
 */

/**
 * The Huge Box Style is a very large box designed for family reunion style charts. The box has a standard height of 300
 * pixels, and a width of 1000/750 pixels for married/single flavors respectively. The style has two flavors: Married,
 * and Single. It includes all available information without restrictions.
 */
class HugeBoxStyle implements IBoxStyler{
    getName(){return StyleManager.HUGE;}

    applyStyleTo(box :IBox, flavor_key :string){
        var start_x = 5;
        var start_y = 53;
        var s_start_x = 625;
        var s_start_y = 53;
        var big_font_size = 50;
        var small_font_size = 35;
        var nameLength = 18;
        var dateLength = 18;
        var placeLength = 18;


        // Basic data
        var render_sched = new RenderInstructionSchedule()
            .setFlavorKey(flavor_key)
            .setDefTextSize(big_font_size)
            .setAltTextSize(small_font_size)
            .setHasPicture(box.getRenderInstructions().getHasPicture())
            .setSpouseHasPicture(box.getRenderInstructions().getSpouseHasPicture());

        if(flavor_key === HugeBoxStyle.MARRIED){
            // Married Flavor

            box.setHeight(1000);
            box.setWidth(300);

            if(render_sched.getHasPicture()) {
                start_x += 275;
            }

            //render_sched
            //    .setPicturePlace(new Instruction(start_x - 95, start_y))
            //    .setPictureDim(new Instruction(90,90))
            //    .setNodeName(new Instruction(start_x, start_y, nameLength))
            //    .setNodeBDate(new Instruction(start_x, start_y + big_font_size + 10, dateLength))
            //    .setNodeBPlace(new Instruction(start_x + 120,start_y + big_font_size + 10, placeLength))
            //    .setNodeDDate(new Instruction(start_x,start_y + big_font_size + small_font_size + 20, dateLength))
            //    .setNodeDPlace(new Instruction(start_x + 120,start_y + big_font_size + small_font_size + 20, placeLength))
            //    .setRotation(true);
            //    .addInstruction(RenderInstructionSchedule.S_PICTURE,s_start_x - 95,s_start_y)
            //    .addInstruction(RenderInstructionSchedule.S_NAME,s_start_x,s_start_y)
            //    .addInstruction(RenderInstructionSchedule.S_B_DATE,s_start_x,s_start_y + big_font_size + 10)
            //    .addInstruction(RenderInstructionSchedule.S_B_PLACE,s_start_x + 120,s_start_y + big_font_size + 10)
            //    .addInstruction(RenderInstructionSchedule.S_D_DATE,s_start_x,s_start_y + big_font_size + small_font_size + 20)
            //    .addInstruction(RenderInstructionSchedule.S_D_PLACE,s_start_x + 120, s_start_y + big_font_size + small_font_size*2 + 20)
            //    .addInstruction(RenderInstructionSchedule.M_DATE, 450,s_start_y + big_font_size + small_font_size*2 + 30)
            //    .addInstruction(RenderInstructionSchedule.M_PLACE, 550,s_start_y + big_font_size + small_font_size*2 + 30);
        }
        else{
            // Single Flavor
            box.setHeight(830);
            box.setWidth(300);

            start_x = 5;
            start_y = 53;

            if(render_sched.getHasPicture()) {
                start_x += 275;
            }

            render_sched
                .setPicturePlace(new Instruction(start_x - 275, start_y))
                .setPictureDim(new Instruction(270,270))
                .setNodeName(new Instruction(start_x, start_y, nameLength))
                .setNodeBDate(new Instruction(start_x, start_y + big_font_size + 10, dateLength))
                .setNodeBPlace(new Instruction(start_x + 222,start_y + big_font_size + 10, placeLength))
                .setNodeDDate(new Instruction(start_x,start_y + big_font_size + small_font_size + 20, dateLength))
                .setNodeDPlace(new Instruction(start_x + 222,start_y + big_font_size + small_font_size + 20, placeLength))
                .setRotation(true);
        }

        box.setRenderInstructions(render_sched);
    }

    static SINGLE  = "s";
    static MARRIED = "m";
}