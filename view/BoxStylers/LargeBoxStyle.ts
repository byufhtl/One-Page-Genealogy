///<reference path="IBoxStyler.ts"/>
/**
 * Created by calvinmcm on 4/14/16.
 */

/**
 * The Large Box Style is suitable for many charts, though is not the most compact and should be avoided in charts where
 * this is important. The box has a standard height of 250 pixels, and a width of 700/550 pixels for married/single
 * flavors respectively. The style has two flavors: Married, and Single. It includes all available information without
 * restrictions.
 */
class LargeBoxStyle implements IBoxStyler{
    getName(){return StyleManager.LARGE;}

    applyStyleTo(box :IBox, flavor_key :string){
        var start_x = 160;
        var start_y = 45;
        var s_start_x = 440;
        var s_start_y = 45;
        var big_font_size = 40;
        var small_font_size = 28;
        var nameLength = 18;
        var dateLength = 16;
        var placeLength = 16;

        if(!PictureManager.hasPicture(box.getNode().getId())) {
            start_x -= 145;
        }

        // Basic data
        var render_sched = new RenderInstructionSchedule().setFlavorKey(flavor_key);

        render_sched
            .setDefTextSize(big_font_size)
            .setAltTextSize(small_font_size)
            .setPicturePlace(new Instruction(start_x - 155, start_y))
            .setPictureDim(new Instruction(150,150))
            .setNodeName(new Instruction(start_x,start_y, nameLength))
            .setNodeBDate(new Instruction(start_x, start_y + big_font_size + 8, dateLength))
            .setNodeBPlace(new Instruction(start_x + 140, start_y + big_font_size + 8, placeLength))
            .setNodeDDate(new Instruction(start_x, start_y + big_font_size + small_font_size + 16, dateLength))
            .setNodeDPlace(new Instruction(start_x + 140,start_y + big_font_size + small_font_size + 16, placeLength))
            .setRotation(true);

        box.setWidth(225);

        if(flavor_key === LargeBoxStyle.MARRIED){
            // Married Flavor

            box.setHeight(890);

            if(!PictureManager.hasPicture(box.getNode().getId())) {
                s_start_x -= 155;
            }

            //render_sched
            //    .addInstruction(RenderInstructionSchedule.S_PICTURE,s_start_x - 155,s_start_y)
            //    .addInstruction(RenderInstructionSchedule.S_NAME,s_start_x,s_start_y)
            //    .addInstruction(RenderInstructionSchedule.S_B_DATE,s_start_x,s_start_y + big_font_size + 8)
            //    .addInstruction(RenderInstructionSchedule.S_B_PLACE,s_start_x + 140,s_start_y + big_font_size + 8)
            //    .addInstruction(RenderInstructionSchedule.S_D_DATE,s_start_x,s_start_y + big_font_size + small_font_size + 16)
            //    .addInstruction(RenderInstructionSchedule.S_D_PLACE,s_start_x + 140, s_start_y + big_font_size + small_font_size*2 + 16)
            //    .addInstruction(RenderInstructionSchedule.M_DATE, 300,s_start_y + big_font_size + small_font_size*2 + 16)
            //    .addInstruction(RenderInstructionSchedule.M_PLACE, 400,s_start_y + big_font_size + small_font_size*2 + 16);
        }
        else{
            // Single Flavor
            box.setHeight(610);
        }

        box.setRenderInstructions(render_sched);
    }

    static SINGLE  = "s";
    static MARRIED = "m";
}