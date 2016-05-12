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
        var start_x = 8;
        var start_y = 29;
        var s_start_x = 80;
        var s_start_y = 219;
        var big_font_size = 28;
        var small_font_size = 14;
        var nameLength = 16;
        var dateLength = 18;
        var placeLength = 18;

        // Basic data
        var render_sched :RenderInstructionSchedule = new RenderInstructionSchedule()
            //.setBoxInstructions(box.getRenderInstructions().getBoxInstructions())
            //.setTextInstructions(box.getRenderInstructions().getTextInstructions())
            .setFlavorKey(flavor_key)
            .setDefTextSize(big_font_size)
            .setAltTextSize(small_font_size)
            .setHasPicture(box.getRenderInstructions().getHasPicture())
            .setSpouseHasPicture(box.getRenderInstructions().getSpouseHasPicture());

        if(flavor_key === MediumBoxStyle.MARRIED_WIDE){

            if(box.getNode().getSpouses().length == 0){
                flavor_key = MediumBoxStyle.SINGLE_LONG_FAT;
                render_sched.setFlavorKey(flavor_key);
            }
            else {
                box.setHeight(340);
                box.setWidth(235);

                start_x = 22;
                s_start_x = 22;

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

                    .setMarriageDate(new Instruction(125, 221))
                    .setMarriagePlace(new Instruction(180, 221))

                    .setBoldID(box.getNode().getId())
                    .setRotation(true);
            }
        }
        //if(flavor_key === MediumBoxStyle.MARRIED_LONG){
        //
        //    box.setHeight(325);
        //    box.setWidth(360);
        //
        //    if(render_sched.getHasPicture()) {
        //        start_x += 65;
        //        s_start_x += 65;
        //    }
        //
        //    //render_sched
        //    //    .addInstruction(RenderInstructionSchedule.PICTURE,start_x - 65,start_y-20)
        //    //    .addInstruction(RenderInstructionSchedule.PICTURES_DIM,70,70)
        //    //    .addInstruction(RenderInstructionSchedule.NAME,start_x,start_y)
        //    //    .addInstruction(RenderInstructionSchedule.B_DATE,start_x,start_y + big_font_size + 6)
        //    //    .addInstruction(RenderInstructionSchedule.B_PLACE,start_x + 105,start_y + big_font_size + 6)
        //    //    .addInstruction(RenderInstructionSchedule.D_DATE,start_x,start_y + big_font_size + small_font_size + 10)
        //    //    .addInstruction(RenderInstructionSchedule.D_PLACE,start_x + 105,start_y + big_font_size + small_font_size + 10)
        //    //    .addInstruction(RenderInstructionSchedule.S_PICTURE,s_start_x - 65,s_start_y)
        //    //    .addInstruction(RenderInstructionSchedule.S_NAME,s_start_x,s_start_y)
        //    //    .addInstruction(RenderInstructionSchedule.S_B_DATE,s_start_x,s_start_y + big_font_size + 6)
        //    //    .addInstruction(RenderInstructionSchedule.S_B_PLACE,s_start_x + 105,s_start_y + big_font_size + 6)
        //    //    .addInstruction(RenderInstructionSchedule.S_D_DATE,s_start_x,s_start_y + big_font_size + small_font_size + 10)
        //    //    .addInstruction(RenderInstructionSchedule.S_D_PLACE,s_start_x + 105, s_start_y + big_font_size + small_font_size*2 + 10)
        //    //    .addInstruction(RenderInstructionSchedule.M_DATE, 140,s_start_y + big_font_size + small_font_size*2 + 10)
        //    //    .addInstruction(RenderInstructionSchedule.M_PLACE, 200,s_start_y + big_font_size + small_font_size*2 + 10)
        //    //    .addInstruction(RenderInstructionSchedule.TEXT_ROTATED,1);
        //
        //}
        //else
        if(flavor_key === MediumBoxStyle.SINGLE_WIDE){

            //console.log("MED::SINGLE_WIDE on [" + box.getNode().getAttr("name").toString() + "] @ pre-render with key [" + box.getRenderInstructions().getFlavorKey() + "]");

            box.setHeight(380);
            box.setWidth(130);

            start_x = 22;
            start_y = 29;

            if (render_sched.getHasPicture()) {
                start_x += 72;
                render_sched
                    .setPicturePlace(new Instruction(start_x - 80, start_y - 20))
                    .setPictureDim(new Instruction(75, 75));
            }

            render_sched
                .setNodeName(new Instruction(start_x, start_y, nameLength))
                .setNodeBDate(new Instruction(start_x, start_y + big_font_size - 6, dateLength))
                .setNodeBPlace(new Instruction(start_x + 80, start_y + big_font_size - 6, placeLength))
                .setNodeDDate(new Instruction(start_x, start_y + big_font_size + small_font_size - 2, dateLength))
                .setNodeDPlace(new Instruction(start_x + 80, start_y + big_font_size + small_font_size - 2, placeLength))
                .setRotation(true);

            //console.log(JSON.stringify(render_sched.getNameInstruction()) + " on [" + box.getNode().getAttr("name").toString() + "] @ post-render");
        }
        else if(flavor_key === MediumBoxStyle.SINGLE_LONG){

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
                .setNodeBPlace(new Instruction(start_x + 80, start_y + big_font_size - 6, placeLength))
                .setNodeDDate(new Instruction(start_x, start_y + big_font_size + small_font_size - 2, dateLength))
                .setNodeDPlace(new Instruction(start_x + 80, start_y + big_font_size + small_font_size - 2, placeLength));
        }
        else if(flavor_key === MediumBoxStyle.SINGLE_LONG_FAT){

            box.setHeight(115);
            box.setWidth(235);

            nameLength = 12;
            dateLength = 11;
            placeLength = 14;

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
        else if(flavor_key === MediumBoxStyle.SINGLE_BUBBLE){

            box.setHeight(310);
            box.setWidth(310);

            start_x = 42;
            start_y = 150;
            nameLength = 15;

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


        box.setRenderInstructions(render_sched);
    }

    static SINGLE_LONG      = "s_l";
    static SINGLE_LONG_FAT  = "s_l_f";
    static SINGLE_WIDE      = "s_w";
    static SINGLE_BUBBLE    = "s_b";
    static MARRIED_LONG     = "m_l";
    static MARRIED_WIDE     = "m_w";
}