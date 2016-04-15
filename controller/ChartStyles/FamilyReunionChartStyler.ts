///<reference path="../AbstractChartStyle.ts"/>
/**
 * Created by calvinmcm on 4/13/16.
 */

class FamilyReunionChartStyler extends AbstractChartStyle{

    constructor(){
        super("FamilyReunionChartStyler");
    }

    setBasedOnGeneration(parentBox :IBox, branchBox :IBox, generation :number) :void{
        switch(generation){
            case 0:
                branchBox.setX(0);
                branchBox.setType(StyleManager.ENORMOUS);
                StyleManager.stylize(branchBox,false);
                break;
            case 1:
                branchBox.setX(parentBox.getX() + parentBox.getWidth()+30);
                branchBox.setType(StyleManager.HUGE);
                StyleManager.stylize(branchBox,false);
                break;
            case 2:
                branchBox.setX(parentBox.getX() + parentBox.getWidth()/2);
                branchBox.setType(StyleManager.LARGE);
                StyleManager.stylize(branchBox,false);
                break;
            case 3:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 30);
                branchBox.setType(StyleManager.MEDIUM);
                StyleManager.stylize(branchBox,false);
                break;
            case 4:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 30);
                branchBox.setType(StyleManager.SMALL);
                StyleManager.stylize(branchBox,false);
                break;
            case 5:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 30);
                branchBox.setType(StyleManager.SMALL);
                StyleManager.stylize(branchBox,false);
                break;
            case 6:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 30);
                branchBox.setType(StyleManager.MINI);
                StyleManager.stylize(branchBox,false);
                break;
            case 7:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 30);
                branchBox.setType(StyleManager.TINY);
                StyleManager.stylize(branchBox,false);
                break;
            default:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 30);
                branchBox.setType(StyleManager.TINY);
                StyleManager.stylize(branchBox,false);
        }
    }
}