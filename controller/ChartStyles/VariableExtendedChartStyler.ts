///<reference path="../AbstractChartStyle.ts"/>
/**
 * Created by calvinmcm on 4/14/16.
 */

class VariableExtendedChartStyler extends AbstractChartStyle{

    constructor(){
        super("VariableExtendedChartStyler");
    }

    setBasedOnGeneration(parentBox :IBox, branchBox :IBox, generation :number) :void{
        branchBox.getRenderInstructions().clear();

        var maxGenerations = $("option:selected", ('#fsGenerationsSelect'))[0].value;

        // BUILD A BIGGER-CHART VERSION OF THE VARIABLE DEPTH CHART STYLE

        switch(generation){
            case 0:
                branchBox.setX(0);
                branchBox.setType(StyleManager.ENORMOUS);
                StyleManager.stylize(branchBox, EnrBoxStyle.SINGLE);
                break;
            case 1:
                branchBox.setX(parentBox.getX() + parentBox.getWidth()/2);
                branchBox.setType(StyleManager.HUGE);
                StyleManager.stylize(branchBox, HugeBoxStyle.SINGLE);
                break;
            case 2:
                branchBox.setX(parentBox.getX() + parentBox.getWidth()/2);
                branchBox.setType(StyleManager.HUGE);
                StyleManager.stylize(branchBox, HugeBoxStyle.SINGLE);
                break;
            case 3:
                branchBox.setX(parentBox.getX() + parentBox.getWidth()/2);
                branchBox.setType(StyleManager.LARGE);
                StyleManager.stylize(branchBox, LargeBoxStyle.SINGLE_WIDE);
                break;
            case 4:
                branchBox.setX(parentBox.getX() + parentBox.getWidth()/2);
                branchBox.setType(StyleManager.LARGE);
                StyleManager.stylize(branchBox, LargeBoxStyle.SINGLE_WIDE);
                break;
            case 5:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 20);
                branchBox.setType(StyleManager.MEDIUM);
                StyleManager.stylize(branchBox, MediumBoxStyle.SINGLE_WIDE);
                break;
            case 6:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 70);
                branchBox.setType(StyleManager.MEDIUM);
                StyleManager.stylize(branchBox, MediumBoxStyle.SINGLE_WIDE);
                break;
            case 7:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 20);
                branchBox.setType(StyleManager.MEDIUM);
                StyleManager.stylize(branchBox, MediumBoxStyle.SINGLE_LONG);
                break;
            case 8:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 20);
                branchBox.setType(StyleManager.SMALL);
                StyleManager.stylize(branchBox, SmallBoxStyle.SINGLE_LONG);
                break;
            case 9:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 20);
                branchBox.setType(StyleManager.SMALL);
                StyleManager.stylize(branchBox, SmallBoxStyle.SINGLE_LONG);
                break;
            case 10:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 20);
                branchBox.setType(StyleManager.MINI);
                StyleManager.stylize(branchBox, MiniBoxStyle.SINGLE);
                break;
            case 11:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 20);
                branchBox.setType(StyleManager.MINI);
                StyleManager.stylize(branchBox, MiniBoxStyle.SINGLE);
                break;
            case 12:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 20);
                branchBox.setType(StyleManager.TINY);
                StyleManager.stylize(branchBox, TinyBoxStyle.SINGLE);
                break;
            default:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 20);
                branchBox.setType(StyleManager.TINY);
                StyleManager.stylize(branchBox, TinyBoxStyle.SINGLE);
        }
    }
}