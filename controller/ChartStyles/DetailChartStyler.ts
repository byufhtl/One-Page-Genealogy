///<reference path="../AbstractChartStyle.ts"/>
/**
 * Created by calvinmcm on 4/14/16.
 */

class DetailChartStyler extends AbstractChartStyle{

    constructor(){
        super("DetailChartStyler");
    }

    setBasedOnGeneration(parentBox :IBox, branchBox :IBox, generation :number) :void{
        switch(generation){
            case 0:
                branchBox.setX(0);
                branchBox.setType(StyleManager.LARGE);
                StyleManager.stylize(branchBox,true);
                break;
            case 1:
                branchBox.setX(parentBox.getX() + parentBox.getWidth()/2);
                branchBox.setType(StyleManager.LARGE);
                StyleManager.stylize(branchBox,true);
                break;
            case 2:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 20);
                branchBox.setType(StyleManager.MEDIUM);
                StyleManager.stylize(branchBox,true);
                break;
            case 3:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 20);
                branchBox.setType(StyleManager.SMALL);
                StyleManager.stylize(branchBox,true);
                break;
            case 4:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 20);
                branchBox.setType(StyleManager.SMALL);
                StyleManager.stylize(branchBox,true);
                break;
            case 5:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 20);
                branchBox.setType(StyleManager.MINI);
                StyleManager.stylize(branchBox,true);
                break;
            case 6:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 20);
                branchBox.setType(StyleManager.MINI);
                StyleManager.stylize(branchBox,true);
                break;
            case 7:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 20);
                branchBox.setType(StyleManager.MINI);
                StyleManager.stylize(branchBox,true);
                break;
            default:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 20);
                branchBox.setType(StyleManager.TINY);
                StyleManager.stylize(branchBox,true);
        }
    }
}