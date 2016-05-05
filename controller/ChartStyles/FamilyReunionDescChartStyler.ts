///<reference path="../AbstractChartStyle.ts"/>
/**
 * Created by calvinmcm on 4/14/16.
 */

class FamilyReunionDescChartStyler extends AbstractChartStyle{

    constructor(){
        super("FamilyReunionDescChartStyler");
    }

    setBasedOnGeneration(parentBox :IBox, branchBox :IBox, generation :number) :void{
        branchBox.getRenderInstructions().clear();
        if(branchBox.isCollapsed()){
            branchBox.setCollapsed(false);
        }
        switch(generation){
            case 0:
                branchBox.setX(0);
                branchBox.setType(StyleManager.ENORMOUS);
                StyleManager.stylize(branchBox,true);
                branchBox.getRenderInstructions().addInstruction(RenderInstructionSchedule.AUTO_PASTEL_BORDER_MODE,5);
                break;
            case 1:
                branchBox.setX(parentBox.getX() + 2*parentBox.getWidth()/3);
                branchBox.setType(StyleManager.HUGE);
                StyleManager.stylize(branchBox,true);
                branchBox.getRenderInstructions().addInstruction(RenderInstructionSchedule.AUTO_PASTEL_BORDER_MODE,5);
                break;
            case 2:
                branchBox.setX(parentBox.getX() + 2*parentBox.getWidth()/3);
                branchBox.setType(StyleManager.LARGE);
                StyleManager.stylize(branchBox,true);
                branchBox.getRenderInstructions().addInstruction(RenderInstructionSchedule.AUTO_PASTEL_BORDER_MODE,5);
                break;
            case 3:
                branchBox.setX(parentBox.getX() + 2*parentBox.getWidth()/3);
                branchBox.setType(StyleManager.MEDIUM);
                StyleManager.stylize(branchBox,true);
                branchBox.getRenderInstructions().addInstruction(RenderInstructionSchedule.AUTO_PASTEL_BORDER_MODE,5);
                break;
            case 4:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 30);
                branchBox.setType(StyleManager.SMALL);
                StyleManager.stylize(branchBox,true);
                branchBox.getRenderInstructions()
                    .addInstruction(RenderInstructionSchedule.AUTO_PASTEL_BORDER_MODE,5);
                break;
            case 5:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 30);
                branchBox.setType(StyleManager.SMALL);
                StyleManager.stylize(branchBox,true);
                branchBox.getRenderInstructions()
                    .addInstruction(RenderInstructionSchedule.AUTO_PASTEL_BORDER_MODE,5);
                break;
            case 6:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 30);
                branchBox.setType(StyleManager.MINI);
                StyleManager.stylize(branchBox,true);
                branchBox.getRenderInstructions()
                    .addInstruction(RenderInstructionSchedule.AUTO_PASTEL_BORDER_MODE,5);
                break;
            case 7:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 30);
                branchBox.setType(StyleManager.TINY);
                StyleManager.stylize(branchBox,true);
                branchBox.getRenderInstructions()
                    .addInstruction(RenderInstructionSchedule.AUTO_PASTEL_BORDER_MODE,5);
                break;
            default:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 30);
                branchBox.setType(StyleManager.TINY);
                StyleManager.stylize(branchBox,true);
                branchBox.getRenderInstructions()
                    .addInstruction(RenderInstructionSchedule.AUTO_PASTEL_BORDER_MODE,5)
                    .addInstruction(RenderInstructionSchedule.TEXT_ROTATED,1);
        }
    }
}/**
 * Created by calvinmcm on 4/14/16.
 */
