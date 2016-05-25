///<reference path="../AbstractChartStyle.ts"/>
/**
 * Created by calvinmcm on 4/14/16.
 */

class FamilyReunionDescChartStyler extends AbstractChartStyle{

    constructor(){
        super("FamilyReunionDescChartStyler");
    }


    /**
     * This is a function for descendancy trees that allows for easier rendering of multiple marriages. The idea is that
     * a counter is used to track the generational analysis where odd numbered 'generations' are null boxes that function
     * as splitters in the tree for the multiple spouses. The even numbered generations are regular, full size boxes. This
     * implementation forces some absolute distance setting, but is hopefully easier to understand.
     * The algorithm works like this:
     * A number (base case 0) is passed into a box. If that number is odd and the box does not have plural marriages, that
     * number is incremented by 1. Otherwise it is left as is. This number will determine pseudo-generation. After being applied
     * to the box as a generation, this number is again incremented and stored.
     * Why does this work? Start with the more common base case. It gets passed in a 0 (a 1 would indicate that the root
     * has multiple spouses, and places a splitter). As 0 is not odd, the first increment is skipped. The pseudo-generation
     * is 0 as a result. This gets passed into the setBasedOnGeneration2 method, which creates a box.
     * Thus the first box starts as generation 0, and it will always store a 1 for future generations.
     * In this second generation, the input is a 1. Lets say that there are two boxes in this generation, N and M. N has
     * only one wife. M has multiple wives. N inherits an input of 1 from the first generation. Since N is a single-marriage
     * box and its input is even, the input is incremented and becomes 2. This 2 is used as the pseudo-generation for N,
     * which causes it to have a box rendered for it. N's output will be 2 + 1, or 3.
     * M, however, is a plural marriage box, and as such its input is not incremented. Therefore its pseudo-generation
     * remains a 1, which causes it to become a splitter. It's output becomes 1 + 1, or 2.
     * N's decendants will inherit a 3, and may become either boxes or splitters. M's descendants inherit a 2, and may
     * ONLY become boxes. M's grandchildren will all inherit a 3, and may become splitters or boxes again.
     *
     * Rough pseudocode
     *  algorithm(box, input){
     *      var pseudo-gen = input;
     *      if(!(box.getSpouses().length > 1) && (input%2 ==1)){
     *          pseudo-gen++;
     *      }
     *      this.setBasedonPseudoGen(box, pseudo-gen)
     *      return ++pseudo-gen; // This gets stored.
     * @param boxes
     */
    applyStyle(boxes: BoxMap): void {
        var rootId: string = boxes.getRoot();
        var root = boxes.getId(rootId);
        var p = (root.getNode().getSpouses().length > 1 ? 1 : 0);
        this.setBasedOnGeneration(null, root, p);

        var queue = [];
        queue.push([rootId,p+1]);

        while(queue.length > 0) {
            var data = queue.shift();
            var box:IBox = boxes.getId(data[0]);
            var counter: number; // a pseudo-generational placeholder
            var node:INode = box.getNode();
            var branchIds = node.getBranchIds();

            for(var i:number=0; i<branchIds.length; i++) {
                var begin = JSON.parse(JSON.stringify(data[1]));
                counter = data[1];
                var gen :number = counter;
                var branchBox:IBox = boxes.getId(branchIds[i]);
                if(!branchBox) {
                    continue;
                }
                if((counter%2 == 1) && branchBox.getNode().getSpouses().length <= 1){
                    gen = ++counter;
                }

                this.setBasedOnGeneration(box, branchBox, counter);
                queue.push([branchIds[i], ++counter]);

                branchBox.getRenderInstructions().setColoredBorder(true);

                /*
                    This next line toggles on a measurer print out. The first number is the one they get from their
                    parent, and is the first number in the algorithm described above. The second number is their
                    pseudo-generation that can be used to determine if the node has multiple marriages. This is the
                    number that is passed in for processing. The third number is the number stored to for inheritance
                    by the next generation.
                    You can toggle it on or off if you are trying to check tree metrics for descendancy charts.
                 */
                //console.log("\t\t", branchBox.getNode().getAttr("name"), data[1] + "/" + gen + "/" + counter, begin === data[1], branchBox.getNode().getSpouses().length <= 1);
            }
        }
    }

    /**
     * Even-numbered generations are renderable. Odd-numbered generations are placeholders
     * @param parentBox
     * @param childBox
     * @param generation
     * @returns {number}
     */
    protected setBasedOnGeneration(parentBox :IBox, childBox :IBox, generation :number) :void{


        // Performs the styling adjustments for boxes while accounting for the possibility of null boxes.
        if(parentBox) {
            if(childBox.getNode().getSpouses().length > 1){ // If plural box, drop 20 and make it a null (invisible) box.
                childBox.setX(parentBox.getX() + parentBox.getWidth() + 20);
                childBox.setType(StyleManager.NULL);
                StyleManager.stylize(childBox, NullBoxStyle.NULL);
                return;
            }
            else if(parentBox.getNode().getSpouses().length > 1){ // If descendant of plural box, drop an additional 10
                childBox.setX(parentBox.getX() + parentBox.getWidth() + 10);
            }
            else{ // if single box and descended from single box, drop a full 30.
                childBox.setX(parentBox.getX() + parentBox.getWidth() + 30);
            }
        }
        else{
            childBox.setX(0);
            if(generation === 1){
                childBox.setType(StyleManager.NULL);
                StyleManager.stylize(childBox, NullBoxStyle.NULL);
                return;
            }
        }

        var numSpouses = childBox.getNode().getSpouses().length;

        // Performs the styling for each generation. Know the algorithm behind the generations before you make major edits.
        // Just changing the styles for the generation shouldn't give you any trouble.
        var generation_real = generation/2;
        switch(generation_real){
            case 0:
                childBox.setType(StyleManager.ENORMOUS);
                if(numSpouses) {
                    StyleManager.stylize(childBox, EnrBoxStyle.MARRIED);
                }
                else{
                    StyleManager.stylize(childBox, EnrBoxStyle.SINGLE);
                }
                break;
            case 1:
                if(numSpouses) {
                    childBox.setType(StyleManager.LARGE);
                    StyleManager.stylize(childBox, LargeBoxStyle.MARRIED_WIDE);
                }
                else{
                    childBox.setType(StyleManager.LARGE);
                    StyleManager.stylize(childBox, LargeBoxStyle.SINGLE_LONG_FAT);
                }
                break;
            case 2:
                if(numSpouses) {
                    childBox.setType(StyleManager.MEDIUM);
                    StyleManager.stylize(childBox, MediumBoxStyle.MARRIED_WIDE_SQ);
                }
                else{
                    childBox.setType(StyleManager.MEDIUM);
                    StyleManager.stylize(childBox, MediumBoxStyle.SINGLE_LONG_FAT);
                }
                break;
            case 3:
                if(numSpouses) {
                    childBox.setType(StyleManager.MINI);
                    StyleManager.stylize(childBox, MiniBoxStyle.MARRIED);
                }
                else{
                    childBox.setType(StyleManager.MINI);
                    StyleManager.stylize(childBox, MiniBoxStyle.SINGLE);
                }
                break;
            case 4:
                if(numSpouses) {
                    childBox.setType(StyleManager.TINY);
                    StyleManager.stylize(childBox, TinyBoxStyle.MARRIED);
                }
                else{
                    childBox.setType(StyleManager.TINY);
                    StyleManager.stylize(childBox, TinyBoxStyle.SINGLE);
                }
                break;
            case 5:
                if(numSpouses) {
                    childBox.setType(StyleManager.TINY);
                    StyleManager.stylize(childBox, TinyBoxStyle.MARRIED);
                }
                else{
                    childBox.setType(StyleManager.TINY);
                    StyleManager.stylize(childBox, TinyBoxStyle.SINGLE);
                }
                break;
            case 6:
                if(numSpouses) {
                    childBox.setType(StyleManager.TINY);
                    StyleManager.stylize(childBox, TinyBoxStyle.MARRIED);
                }
                else{
                    childBox.setType(StyleManager.TINY);
                    StyleManager.stylize(childBox, TinyBoxStyle.SINGLE);
                }
                break;
            case 7:
                if(numSpouses) {
                    childBox.setType(StyleManager.TINY);
                    StyleManager.stylize(childBox, TinyBoxStyle.MARRIED);
                }
                else{
                    childBox.setType(StyleManager.TINY);
                    StyleManager.stylize(childBox, TinyBoxStyle.SINGLE);
                }
                break;
            default:
                if(numSpouses) {
                    childBox.setType(StyleManager.TINY);
                    StyleManager.stylize(childBox, TinyBoxStyle.MARRIED);
                }
                else{
                    childBox.setType(StyleManager.TINY);
                    StyleManager.stylize(childBox, TinyBoxStyle.SINGLE);
                }
        }
        childBox.getRenderInstructions().setColoredBorder(true);
        return;
    }
}