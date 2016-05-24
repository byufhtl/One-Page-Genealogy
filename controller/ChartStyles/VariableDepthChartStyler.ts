///<reference path="../AbstractChartStyle.ts"/>
/**
 * Created by calvinmcm on 4/14/16.
 * This chart is fun because it will look different based on the number of generations that are available.
 * The first box is HUGE:WIDE. The rest of the boxes are on a 5-section grade, putting roughly 20 percent of the boxes
 * in each category from top to bottom as follows: LARGE:WIDE,MEDIUM:WIDE,SMALL:LONG,MINI,TINY
 */

class VariableDepthChartStyler extends AbstractChartStyle{

    constructor(){
        super("VariableDepthChartStyler");
    }

    setBasedOnGeneration(parentBox :IBox, branchBox :IBox, generation :number) :void{
        branchBox.getRenderInstructions().clear();

        var maxGenerations = $("option:selected", ('#fsGenerationsSelect'))[0].value;

        var level = (generation*10/maxGenerations);

        if(generation == 0){
            branchBox.setX(0);
            if(maxGenerations > 8) {
                branchBox.setType(StyleManager.HUGE);
                StyleManager.stylize(branchBox, HugeBoxStyle.SINGLE);
            }
            else{
                branchBox.setType(StyleManager.ENORMOUS);
                StyleManager.stylize(branchBox, EnrBoxStyle.SINGLE);
            }
        }
        else if(level < 1){
            branchBox.setX(parentBox.getX() + parentBox.getWidth() + 40);
            branchBox.setType(StyleManager.HUGE);
            StyleManager.stylize(branchBox, HugeBoxStyle.SINGLE);
        }
        else if(level < 2){
            branchBox.setX(parentBox.getX() + parentBox.getWidth() + 40);
            branchBox.setType(StyleManager.LARGE);
            StyleManager.stylize(branchBox, LargeBoxStyle.SINGLE_WIDE);
        }
        else if(level < 4){
            branchBox.setX(parentBox.getX() + parentBox.getWidth() + 60);
            branchBox.setType(StyleManager.MEDIUM);
            StyleManager.stylize(branchBox, MediumBoxStyle.SINGLE_WIDE);
        }
        else if(level < 6){
            branchBox.setX(parentBox.getX() + parentBox.getWidth() + 20);
            branchBox.setType(StyleManager.SMALL);
            StyleManager.stylize(branchBox, SmallBoxStyle.SINGLE_LONG_FAT);
        }
        else if(level < 7){
            branchBox.setX(parentBox.getX() + parentBox.getWidth() + 20);
            branchBox.setType(StyleManager.SMALL);
            StyleManager.stylize(branchBox, SmallBoxStyle.SINGLE_LONG);
        }
        else if(level < 9){
            branchBox.setX(parentBox.getX() + parentBox.getWidth() + 20);
            branchBox.setType(StyleManager.MINI);
            StyleManager.stylize(branchBox, MiniBoxStyle.SINGLE);
        }
        else{
            branchBox.setX(parentBox.getX() + parentBox.getWidth() + 20);
            branchBox.setType(StyleManager.TINY);
            StyleManager.stylize(branchBox, TinyBoxStyle.SINGLE);
        }
    }
}