///<reference path="IBoxStyler.ts"/>
/**
 * Created by calvinmcm on 4/14/10.
 */

/**
 * The Medium Box Style is a good-sized box suitable for various roles in most charts. The box has a standard height of 300
 * pixels, and a width of 1000/740 pixels for married/single flavors respectively. The style has two flavors: Married,
 * and Single. It includes all available information without restrictions.
 */
class MediumBoxStyle implements IBoxStyler{
    getName(){return StyleManager.MEDIUM;}

    applyStyleTo(box :IBox, flavor_key :string){
        var start_x = 85;
        var start_y = 29;
        var s_start_x = 80;
        var s_start_y = 219;
        var big_font_size = 28;
        var small_font_size = 14;
        var nameLength = 17;
        var dateLength = 18;
        var placeLength = 18;

        // Basic data
        var render_sched :RenderInstructionSchedule = new RenderInstructionSchedule().setFlavorKey(flavor_key);

        render_sched
            .setBoxInstructions(box.getRenderInstructions().getBoxInstructions())
            .setTextInstructions(box.getRenderInstructions().getTextInstructions())
            .setDefTextSize(big_font_size)
            .setAltTextSize(small_font_size);

        if(flavor_key === MediumBoxStyle.MARRIED_WIDE){

            box.setHeight(360);
            box.setWidth(100);

        }
        else if(flavor_key === MediumBoxStyle.MARRIED_LONG){

            box.setHeight(325);
            box.setWidth(360);

            if(!PictureManager.hasPicture(box.getNode().getId())) {
                start_x -= 65;
                s_start_x -= 65;
            }

            //render_sched
            //    .addInstruction(RenderInstructionSchedule.PICTURE,start_x - 65,start_y-20)
            //    .addInstruction(RenderInstructionSchedule.PICTURES_DIM,70,70)
            //    .addInstruction(RenderInstructionSchedule.NAME,start_x,start_y)
            //    .addInstruction(RenderInstructionSchedule.B_DATE,start_x,start_y + big_font_size + 6)
            //    .addInstruction(RenderInstructionSchedule.B_PLACE,start_x + 105,start_y + big_font_size + 6)
            //    .addInstruction(RenderInstructionSchedule.D_DATE,start_x,start_y + big_font_size + small_font_size + 10)
            //    .addInstruction(RenderInstructionSchedule.D_PLACE,start_x + 105,start_y + big_font_size + small_font_size + 10)
            //    .addInstruction(RenderInstructionSchedule.S_PICTURE,s_start_x - 65,s_start_y)
            //    .addInstruction(RenderInstructionSchedule.S_NAME,s_start_x,s_start_y)
            //    .addInstruction(RenderInstructionSchedule.S_B_DATE,s_start_x,s_start_y + big_font_size + 6)
            //    .addInstruction(RenderInstructionSchedule.S_B_PLACE,s_start_x + 105,s_start_y + big_font_size + 6)
            //    .addInstruction(RenderInstructionSchedule.S_D_DATE,s_start_x,s_start_y + big_font_size + small_font_size + 10)
            //    .addInstruction(RenderInstructionSchedule.S_D_PLACE,s_start_x + 105, s_start_y + big_font_size + small_font_size*2 + 10)
            //    .addInstruction(RenderInstructionSchedule.M_DATE, 140,s_start_y + big_font_size + small_font_size*2 + 10)
            //    .addInstruction(RenderInstructionSchedule.M_PLACE, 200,s_start_y + big_font_size + small_font_size*2 + 10)
            //    .addInstruction(RenderInstructionSchedule.TEXT_ROTATED,1);

        }
        else if(flavor_key === MediumBoxStyle.SINGLE_WIDE){

            box.setHeight(180);
            box.setWidth(100);
            box.setY(box.getY() - 180); // Shift the box down.
            box.setX(box.getX() - 50); // Shift the box over.

            var temp = start_x;
            start_x = start_y;
            start_y = temp;

            if (!PictureManager.hasPicture(box.getNode().getId())) {
                start_y -= 65;
            }

            render_sched
                .setPicturePlace(new Instruction(start_x - 20, start_y - 80))
                .setPictureDim(new Instruction(75, 75))
                .setRotation(true)
                .setSpouseName(new Instruction(start_x, start_y, nameLength))
                .setSpouseBDate(new Instruction(start_x + big_font_size - 6, start_y, dateLength))
                .setSpouseBPlace(new Instruction(start_x + big_font_size - 6, start_y + 80, placeLength))
                .setSpouseDDate(new Instruction(start_x + big_font_size + small_font_size - 2, start_y, dateLength))
                .setSpouseDPlace(new Instruction(start_x + big_font_size + small_font_size - 2, start_y + 80, placeLength));

        }
        else if(flavor_key === MediumBoxStyle.SINGLE_LONG){

            box.setHeight(100);
            box.setWidth(360);

            if (!PictureManager.hasPicture(box.getNode().getId())) {
                start_x -= 65;
            }

            render_sched
                .setPicturePlace(new Instruction(start_x - 80, start_y - 20, placeLength))
                .setPictureDim(new Instruction(75, 75))
                .setNodeName(new Instruction(start_x, start_y, nameLength))
                .setNodeBDate(new Instruction(start_x, start_y + big_font_size - 6, dateLength))
                .setNodeBPlace(new Instruction(start_x + 80, start_y + big_font_size - 6, placeLength))
                .setNodeDDate(new Instruction(start_x, start_y + big_font_size + small_font_size - 2, dateLength))
                .setNodeDPlace(new Instruction(start_x + 80, start_y + big_font_size + small_font_size - 2, placeLength))
        }
        else{

        }


        box.setRenderInstructions(render_sched);
    }

    static SINGLE_LONG = "s_l";
    static SINGLE_WIDE = "s_w";
    static MARRIED_LONG = "m_l";
    static MARRIED_WIDE = "m_w";
}