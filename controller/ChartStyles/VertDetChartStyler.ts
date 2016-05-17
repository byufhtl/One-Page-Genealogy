///<reference path="../AbstractChartStyle.ts"/>
/**
 * Created by calvinmcm on 4/14/16.
 */

class VertDetChartStyler extends AbstractChartStyle{

    constructor(){
        super("VertDetChartStyler");
    }

    setBasedOnGeneration(parentBox :IBox, branchBox :IBox, generation :number) :void{
        branchBox.getRenderInstructions().clear();
        //if(branchBox.isCollapsed()){
        //    branchBox.setCollapsed(false);
        //}
        switch(generation){
            case 0:
                branchBox.setX(0);
                branchBox.setType(StyleManager.LARGE);
                StyleManager.stylize(branchBox, LargeBoxStyle.SINGLE_WIDE);
                break;
            case 1:
                branchBox.setX(parentBox.getX() + parentBox.getWidth()/2);
                branchBox.setType(StyleManager.LARGE);
                StyleManager.stylize(branchBox, LargeBoxStyle.SINGLE_WIDE);
                break;
            case 2:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 65);
                branchBox.setType(StyleManager.LARGE);
                StyleManager.stylize(branchBox, LargeBoxStyle.SINGLE_WIDE);
                break;
            case 3:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 80);
                branchBox.setType(StyleManager.MEDIUM);
                StyleManager.stylize(branchBox, MediumBoxStyle.SINGLE_WIDE);
                break;
            case 4:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 20);
                branchBox.setType(StyleManager.SMALL);
                StyleManager.stylize(branchBox, SmallBoxStyle.SINGLE_WIDE);
                break;
            case 5:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 20);
                branchBox.setType(StyleManager.SMALL);
                StyleManager.stylize(branchBox, SmallBoxStyle.SINGLE_WIDE);
                break;
            case 6:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 20);
                branchBox.setType(StyleManager.SMALL);
                StyleManager.stylize(branchBox, SmallBoxStyle.SINGLE_LONG_FAT);
                break;
            case 7:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 20);
                branchBox.setType(StyleManager.SMALL);
                StyleManager.stylize(branchBox, SmallBoxStyle.SINGLE_LONG);
                break;
            default:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 20);
                branchBox.setType(StyleManager.MINI);
                StyleManager.stylize(branchBox, MiniBoxStyle.SINGLE);
        }
    }
}