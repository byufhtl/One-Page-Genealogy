///<reference path="../../model/IBox.ts"/>
///<reference path="RenderInstructionSchedule.ts"/>

/**
 * Created by calvinmcm on 4/13/16.
 */

class StyleManager{

    static ENORMOUS = "Enormous";
    static HUGE     = "Huge";
    static LARGE    = "Large";
    static MEDIUM   = "Medium";
    static SMALL    = "Small";
    static MINI     = "Mini";
    static TINY     = "Tiny";

    static stylize(box :IBox, showMarriage :boolean) :void{
        switch(box.getType()){
            case StyleManager.ENORMOUS:
                StyleManager.s_enr(box,showMarriage);
                break;
            case StyleManager.HUGE:
                StyleManager.s_huge(box,showMarriage);
                break;
            case StyleManager.LARGE:
                StyleManager.s_lrg(box,showMarriage);
                break;
            case StyleManager.MEDIUM:
                StyleManager.s_med(box,showMarriage);
                break;
            case StyleManager.SMALL:
                StyleManager.s_sml(box,showMarriage);
                break;
            case StyleManager.MINI:
                StyleManager.s_mini(box,showMarriage);
                break;
            case StyleManager.TINY:
                StyleManager.s_tiny(box,showMarriage);
                break;
        }
    }

    private static s_enr(box :IBox, showMarriage :boolean) :void{

        // YOU WILL NEED TO ADD PICTURE CHECKS!!!

        var render_sched = new RenderInstructionSchedule(36,27)
            .addInstruction(RenderInstructionSchedule.PICTURE,5,5)
            .addInstruction(RenderInstructionSchedule.NAME,105,5)
            .addInstruction(RenderInstructionSchedule.B_DATE,105,15)
            .addInstruction(RenderInstructionSchedule.B_PLACE,145,5)
            .addInstruction(RenderInstructionSchedule.D_DATE,105,25)
            .addInstruction(RenderInstructionSchedule.D_PLACE,145,25);

        box.setRenderInstructions(render_sched);

        if(box.getSpouseNode() && box.getNode().getDisplaySpouse() && showMarriage){
            // Married Flavor

        }
    }
    private static s_huge(box :IBox, showMarriage :boolean) :void{

    }
    private static s_lrg(box :IBox, showMarriage :boolean) :void{

    }
    private static s_sml(box :IBox, showMarriage :boolean) :void{

    }
    private static s_med(box :IBox, showMarriage :boolean) :void{

    }
    private static s_mini(box :IBox, showMarriage :boolean) :void{

    }
    private static s_tiny(box :IBox, showMarriage :boolean) :void{

    }


}