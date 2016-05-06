///<reference path="IBoxStyler.ts"/>
/**
 * Created by calvinmcm on 4/14/16.
 */

/**
 * The Enormous Box Style is a massive box designed for family reunion style charts. The box has a standard height of 400
 * pixels, and a width of 1600/1000 pixels for married/single flavors respectively. The style has two flavors: Married,
 * and Single. It includes all available information without restrictions.
 */
class EnrBoxStyle implements IBoxStyler{
    getName(){return StyleManager.ENORMOUS;}

    applyStyleTo(box :IBox, flavor_key :string){
        var start_x = 25;
        var start_y = 60;
        var s_start_x = 910;
        var s_start_y = 60;
        var big_font_size = 60;
        var small_font_size = 40;
        var nameLength = 22;
        var dateLength = 18;
        var placeLength = 18;


        // Basic data
        var render_sched = new RenderInstructionSchedule().setFlavorKey(flavor_key);

        render_sched
            .setDefTextSize(big_font_size)
            .setAltTextSize(small_font_size);

        if(flavor_key === EnrBoxStyle.MARRIED){
            // Married Flavor

            box.setHeight(2400);
            box.setWidth(350);

            if(!(box.getNode().getAttr("profilePicturePromise"))) {
                start_x -= 255;
            }

            //render_sched
            //    .setPicturePlace(new Instruction(start_x - 255, start_y))
            //    .setPictureDim(new Instruction(250,250))
            //    .setNodeName(new Instruction(start_x, start_y, nameLength))
            //    .setNodeBDate(new Instruction(start_x, start_y + big_font_size + 10, dateLength))
            //    .setNodeBPlace(new Instruction(start_x + 240, start_y + big_font_size + 10, placeLength))
            //    .setNodeDDate(new Instruction(start_x, start_y + big_font_size + small_font_size + 20, dateLength))
            //    .setNodeDPlace(new Instruction(start_x + 240, start_y + big_font_size + small_font_size + 20, placeLength))
            //    .setRotation(true)
            //    .addInstruction(RenderInstructionSchedule.S_PICTURE, s_start_x - 255, s_start_y)
            //    .addInstruction(RenderInstructionSchedule.S_NAME, s_start_x, 5)
            //    .addInstruction(RenderInstructionSchedule.S_B_DATE, s_start_x, start_y + big_font_size + 10)
            //    .addInstruction(RenderInstructionSchedule.S_B_PLACE, s_start_x + 240, s_start_y + big_font_size + 10)
            //    .addInstruction(RenderInstructionSchedule.S_D_DATE, s_start_x, s_start_y + big_font_size + small_font_size + 20)
            //    .addInstruction(RenderInstructionSchedule.S_D_PLACE, s_start_x + 240, s_start_y + big_font_size + small_font_size*2 + 20)
            //    .addInstruction(RenderInstructionSchedule.M_DATE,600, s_start_y + big_font_size + small_font_size*2 + 30)
            //    .addInstruction(RenderInstructionSchedule.M_PLACE,900, s_start_y + big_font_size + small_font_size*2 + 30);
        }
        else{
            // Single Flavor
            box.setHeight(1200);
            box.setWidth(350);

            if(box.getNode().getAttr("profilePicturePromise")) {
                start_x += 255;
            }

            render_sched
                .setPicturePlace(new Instruction(start_x, start_y))
                .setPictureDim(new Instruction(250,250))
                .setNodeName(new Instruction(start_x, start_y, nameLength))
                .setNodeBDate(new Instruction(start_x, start_y + big_font_size + 10, dateLength))
                .setNodeBPlace(new Instruction(start_x + 240, start_y + big_font_size + 10, placeLength))
                .setNodeDDate(new Instruction(start_x, start_y + big_font_size + small_font_size + 20, dateLength))
                .setNodeDPlace(new Instruction(start_x + 240, start_y + big_font_size + small_font_size + 20, placeLength))
                .setRotation(true);
        }

        box.setRenderInstructions(render_sched);
    }

    static SINGLE  = "s";
    static MARRIED = "m";
}