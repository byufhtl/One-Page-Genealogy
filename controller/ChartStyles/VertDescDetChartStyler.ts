///<reference path="../AbstractChartStyle.ts"/>
/**
 * Created by calvinmcm on 4/14/16.
 */

class VertDescDetChartStyler extends AbstractChartStyle{

    constructor(){
        super("VertDescDetChartStyler");
    }

    //applyStyle2(boxes: BoxMap): void {
    //    // console.log("Using VDDCS");
    //    var rootId: string = boxes.getRoot();
    //    var root = boxes.getId(rootId);
    //    this.setBasedOnGeneration(null, root, 0);
    //
    //    var queue = [];
    //    queue.push([rootId,0]);
    //
    //    while(queue.length > 0) {
    //        var data = queue.shift();
    //        var box:IBox = boxes.getId(data[0]);
    //        var generation: number= data[1];
    //        var node:INode = box.getNode();
    //        var branchIds = node.getBranchIds();
    //
    //        for(var i:number=0; i<branchIds.length; i++) {
    //            var branchBox:IBox = boxes.getId(branchIds[i]);
    //            if(!branchBox) {
    //                continue;
    //            }
    //            if(box.getNode().getSpouses().length>1){
    //
    //                branchBox.setX(box.getX() + box.getWidth() + 20);
    //                branchBox.setType(NullBoxStyle.NULL);
    //                StyleManager.stylize(branchBox, NullBoxStyle.NULL);
    //
    //                //this.setBasedOnGeneration(box, branchBox, generation);
    //
    //                queue.push([branchIds[i], generation]);
    //            }
    //            else {
    //                this.setBasedOnGeneration(box, branchBox, generation + 1);
    //
    //                queue.push([branchIds[i], generation + 1]);
    //            }
    //        }
    //    }
    //}
    //
    //protected setBasedOnGeneration(parentBox: IBox, childBox: IBox, generation: number) {
    //
    //    var numSpouses :number = childBox.getNode().getSpouses().length;
    //
    //    if(parentBox != undefined && parentBox != null) {
    //        console.log(parentBox.getX() + parentBox.getWidth());
    //    }
    //
    //
    //    switch(generation) {
    //        case 0: // must be polygamous and hidden
    //            var bx :number = 0;
    //            childBox.setX(bx);
    //            childBox.setType(StyleManager.NULL);
    //            StyleManager.stylize(childBox, NullBoxStyle.NULL);
    //            break;
    //        /*case 1: // The real head of the tree
    //            var bx = 0;
    //            if(numSpouses > 1){
    //                bx = 250;
    //                childBox.setType(StyleManager.NULL);
    //                StyleManager.stylize(childBox, NullBoxStyle.NULL);
    //            }
    //            else if(numSpouses == 1){
    //                childBox.setType(StyleManager.SMALL);
    //                StyleManager.stylize(childBox, SmallBoxStyle.MARRIED_WIDE);
    //            }
    //            else{
    //                childBox.setType(StyleManager.SMALL);
    //                StyleManager.stylize(childBox, SmallBoxStyle.SINGLE_LONG_FAT);
    //            }
    //            childBox.setX(bx);
    //            //// Default - there were plural wives, so only move down a little bit.
    //            //var bx = parentBox.getX() + parentBox.getWidth()+ 10;
    //            //// If there were not plural wives, move the box down by the parent's width.
    //            //bx += (parentBox.getNode().getSpouses().length > 1) ? bx + 8 : bx;
    //            //childBox.setX(bx);
    //            //this.setChildStyle(childBox, numSpouses,
    //            //    StyleManager.SMALL, SmallBoxStyle.SINGLE_LONG_FAT, // Single Information
    //            //    StyleManager.SMALL, SmallBoxStyle.MARRIED_WIDE); // Married Information
    //            break;
    //        case 2:
    //            var bx = parentBox.getX() + parentBox.getWidth() + 10;
    //            if(numSpouses > 1){
    //                bx = parentBox.getX() + 25;
    //                childBox.setType(StyleManager.NULL);
    //                StyleManager.stylize(childBox, NullBoxStyle.NULL);
    //            }
    //            else if(numSpouses == 1){
    //                childBox.setType(StyleManager.SMALL);
    //                StyleManager.stylize(childBox, SmallBoxStyle.MARRIED_WIDE);
    //            }
    //            else{
    //                childBox.setType(StyleManager.SMALL);
    //                StyleManager.stylize(childBox, SmallBoxStyle.SINGLE_LONG_FAT);
    //            }
    //            childBox.setX(bx);
    //            //// Default - there were plural wives, so only move down a little bit.
    //            //var bx = parentBox.getX() + parentBox.getWidth()+ 10;
    //            //// If there were not plural wives, move the box down by the parent's width.
    //            //bx += (parentBox.getNode().getSpouses().length > 1) ? bx + 8 : bx;
    //            //childBox.setX(bx);
    //            //this.setChildStyle(childBox, numSpouses,
    //            //    StyleManager.SMALL, SmallBoxStyle.SINGLE_LONG_FAT, // Single Information
    //            //    StyleManager.SMALL, SmallBoxStyle.MARRIED_WIDE); // Married Information
    //            break;
    //        case 3:
    //            var bx = parentBox.getX() + parentBox.getWidth() + 10;
    //            if(numSpouses > 1){
    //                bx = bx + 250;
    //                childBox.setType(StyleManager.NULL);
    //                StyleManager.stylize(childBox, NullBoxStyle.NULL);
    //            }
    //            else if(numSpouses == 1){
    //                childBox.setType(StyleManager.SMALL);
    //                StyleManager.stylize(childBox, SmallBoxStyle.MARRIED_WIDE);
    //            }
    //            else{
    //                childBox.setType(StyleManager.SMALL);
    //                StyleManager.stylize(childBox, SmallBoxStyle.SINGLE_LONG_FAT);
    //            }
    //            childBox.setX(bx);
    //            //// Default - there were plural wives, so only move down a little bit.
    //            //var bx = parentBox.getX() + parentBox.getWidth()+ 10;
    //            //// If there were not plural wives, move the box down by the parent's width.
    //            //bx += (parentBox.getNode().getSpouses().length > 1) ? bx + 8 : bx;
    //            //childBox.setX(bx);
    //            //this.setChildStyle(childBox, numSpouses,
    //            //    StyleManager.SMALL, SmallBoxStyle.SINGLE_LONG_FAT, // Single Information
    //            //    StyleManager.SMALL, SmallBoxStyle.MARRIED_WIDE); // Married Information
    //            break;
    //        case 4:
    //            var bx = parentBox.getX() + parentBox.getWidth() + 10;
    //            if(numSpouses > 1){
    //                bx = bx + 250;
    //                childBox.setType(StyleManager.NULL);
    //                StyleManager.stylize(childBox, NullBoxStyle.NULL);
    //            }
    //            else if(numSpouses == 1){
    //                childBox.setType(StyleManager.SMALL);
    //                StyleManager.stylize(childBox, SmallBoxStyle.MARRIED_WIDE);
    //            }
    //            else{
    //                childBox.setType(StyleManager.SMALL);
    //                StyleManager.stylize(childBox, SmallBoxStyle.SINGLE_LONG_FAT);
    //            }
    //            childBox.setX(bx);
    //            //// Default - there were plural wives, so only move down a little bit.
    //            //var bx = parentBox.getX() + parentBox.getWidth()+ 10;
    //            //// If there were not plural wives, move the box down by the parent's width.
    //            //bx += (parentBox.getNode().getSpouses().length > 1) ? bx + 8 : bx;
    //            //childBox.setX(bx);
    //            //this.setChildStyle(childBox, numSpouses,
    //            //    StyleManager.SMALL, SmallBoxStyle.SINGLE_LONG_FAT, // Single Information
    //            //    StyleManager.SMALL, SmallBoxStyle.MARRIED_WIDE); // Married Information
    //            break;
    //        case 5:
    //            var bx = parentBox.getX() + parentBox.getWidth() + 10;
    //            if(numSpouses > 1){
    //                bx = bx + 250;
    //                childBox.setType(StyleManager.NULL);
    //                StyleManager.stylize(childBox, NullBoxStyle.NULL);
    //            }
    //            else if(numSpouses == 1){
    //                childBox.setType(StyleManager.SMALL);
    //                StyleManager.stylize(childBox, SmallBoxStyle.MARRIED_WIDE);
    //            }
    //            else{
    //                childBox.setType(StyleManager.SMALL);
    //                StyleManager.stylize(childBox, SmallBoxStyle.SINGLE_LONG_FAT);
    //            }
    //            childBox.setX(bx);
    //            //// Default - there were plural wives, so only move down a little bit.
    //            //var bx = parentBox.getX() + parentBox.getWidth()+ 10;
    //            //// If there were not plural wives, move the box down by the parent's width.
    //            //bx += (parentBox.getNode().getSpouses().length > 1) ? bx + 8 : bx;
    //            //childBox.setX(bx);
    //            //this.setChildStyle(childBox, numSpouses,
    //            //    StyleManager.SMALL, SmallBoxStyle.SINGLE_LONG_FAT, // Single Information
    //            //    StyleManager.SMALL, SmallBoxStyle.MARRIED_WIDE); // Married Information
    //            break;
    //        case 6:
    //            // Default - there were plural wives, so only move down a little bit.
    //            var bx = parentBox.getX() + parentBox.getWidth()+ 10;
    //            // If there were not plural wives, move the box down by the parent's width.
    //            bx += (parentBox.getNode().getSpouses().length > 1) ? bx + 8 : bx;
    //            childBox.setX(bx);
    //            this.setChildStyle(childBox, numSpouses,
    //                StyleManager.SMALL, SmallBoxStyle.SINGLE_LONG_FAT, // Single Information
    //                StyleManager.SMALL, SmallBoxStyle.MARRIED_WIDE); // Married Information
    //            break;
    //        case 7:
    //            // Default - there were plural wives, so only move down a little bit.
    //            var bx = parentBox.getX() + parentBox.getWidth()+ 10;
    //            // If there were not plural wives, move the box down by the parent's width.
    //            bx += (parentBox.getNode().getSpouses().length > 1) ? bx + 8 : bx;
    //            childBox.setX(bx);
    //            this.setChildStyle(childBox, numSpouses,
    //                StyleManager.SMALL, SmallBoxStyle.SINGLE_LONG_FAT, // Single Information
    //                StyleManager.SMALL, SmallBoxStyle.MARRIED_WIDE); // Married Information
    //            break;*/
    //        default:
    //            // Default - there were plural wives, so only move down a little bit.
    //            var bx = parentBox.getX() + parentBox.getWidth()+ 10;
    //            // If there were not plural wives, move the box down by the parent's width.
    //            bx += (parentBox.getNode().getSpouses().length > 1) ? bx + 8 : bx;
    //            childBox.setX(bx);
    //            this.setChildStyle(childBox, numSpouses,
    //                StyleManager.SMALL, SmallBoxStyle.SINGLE_LONG_FAT, // Single Information
    //                StyleManager.SMALL, SmallBoxStyle.MARRIED_WIDE); // Married Information
    //    }
    //}
    //
    //private setChildStyle(box :IBox, nSpouses :number, t_0 :string, s_0 :string, t_1 :string = t_0, s_1 :string = s_0){
    //    if (nSpouses == 0) {
    //        box.setType(t_0);
    //        StyleManager.stylize(box,s_0);
    //        box.setSpouseNode(null);
    //    }
    //    else {
    //        box.setType(t_1);
    //        StyleManager.stylize(box,s_1);
    //        box.setSpouseNode(box.getNode().getDisplaySpouse());
    //    }
    //}

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
        console.log("Using VDDCS 2");
        var rootId: string = boxes.getRoot();
        var root = boxes.getId(rootId);
        var p = (root.getNode().getSpouses().length > 1 ? 1 : 0);
        this.setBasedOnGeneration(null, root, p);

        var queue = [];
        queue.push([rootId,p,]);

        while(queue.length > 0) {
            var data = queue.shift();
            var box:IBox = boxes.getId(data[0]);
            var counter: number= data[1];
            var node:INode = box.getNode();
            var branchIds = node.getBranchIds();

            for(var i:number=0; i<branchIds.length; i++) {
                var branchBox:IBox = boxes.getId(branchIds[i]);
                if(!branchBox) {
                    continue;
                }
                if(box.getNode().getSpouses().length <= 1 && (counter%2 == 1)){
                    counter++;
                }

                this.setBasedOnGeneration(box, branchBox, counter);
                queue.push([branchIds[i], ++counter]);

                branchBox.getRenderInstructions().setColoredBorder(true);
            }
        }
    }

    /**
     * Even Generations are renderable. Odd generations are placeholders
     * @param parentBox
     * @param childBox
     * @param generation
     * @returns {number}
     */
    protected setBasedOnGeneration(parentBox :IBox, childBox :IBox, generation :number) :void{
        console.log("\tUsing VDDCS PSEUDO");

        if(parentBox) {

            if(childBox.getNode().getSpouses().length > 1){ // If plural box, drop 20
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
            console.assert(generation === 0);
        }

        var numSpouses = childBox.getNode().getSpouses().length;

        switch(generation/2){
            case 0:
                if(numSpouses) {
                    childBox.setType(StyleManager.SMALL);
                    StyleManager.stylize(childBox, SmallBoxStyle.MARRIED_WIDE);
                }
                else{
                    childBox.setType(StyleManager.SMALL);
                    StyleManager.stylize(childBox, SmallBoxStyle.SINGLE_LONG_FAT);
                }
                childBox.setX(0);
                break;
            case 1:
                if(numSpouses) {
                    childBox.setType(StyleManager.SMALL);
                    StyleManager.stylize(childBox, SmallBoxStyle.MARRIED_WIDE);
                }
                else{
                    childBox.setType(StyleManager.SMALL);
                    StyleManager.stylize(childBox, SmallBoxStyle.SINGLE_LONG_FAT);
                }
                break;
            case 2:
                if(numSpouses) {
                    childBox.setType(StyleManager.SMALL);
                    StyleManager.stylize(childBox, SmallBoxStyle.MARRIED_WIDE);
                }
                else{
                    childBox.setType(StyleManager.SMALL);
                    StyleManager.stylize(childBox, SmallBoxStyle.SINGLE_LONG_FAT);
                }
                break;
            case 3:
                if(numSpouses) {
                    childBox.setType(StyleManager.SMALL);
                    StyleManager.stylize(childBox, SmallBoxStyle.MARRIED_WIDE);
                }
                else{
                    childBox.setType(StyleManager.SMALL);
                    StyleManager.stylize(childBox, SmallBoxStyle.SINGLE_LONG_FAT);
                }
                break;
            case 4:
                if(numSpouses) {
                    childBox.setType(StyleManager.SMALL);
                    StyleManager.stylize(childBox, SmallBoxStyle.MARRIED_WIDE);
                }
                else{
                    childBox.setType(StyleManager.SMALL);
                    StyleManager.stylize(childBox, SmallBoxStyle.SINGLE_LONG_FAT);
                }
                break;
            case 5:
                if(numSpouses) {
                    childBox.setType(StyleManager.SMALL);
                    StyleManager.stylize(childBox, SmallBoxStyle.MARRIED_WIDE);
                }
                else{
                    childBox.setType(StyleManager.SMALL);
                    StyleManager.stylize(childBox, SmallBoxStyle.SINGLE_LONG_FAT);
                }
                break;
            case 6:
                if(numSpouses) {
                    childBox.setType(StyleManager.SMALL);
                    StyleManager.stylize(childBox, SmallBoxStyle.MARRIED_WIDE);
                }
                else{
                    childBox.setType(StyleManager.SMALL);
                    StyleManager.stylize(childBox, SmallBoxStyle.SINGLE_LONG_FAT);
                }
                break;
            case 7:
                if(numSpouses) {
                    childBox.setType(StyleManager.SMALL);
                    StyleManager.stylize(childBox, SmallBoxStyle.MARRIED_WIDE);
                }
                else{
                    childBox.setType(StyleManager.SMALL);
                    StyleManager.stylize(childBox, SmallBoxStyle.SINGLE_LONG_FAT);
                }
                break;
            default:
                if(numSpouses) {
                    childBox.setType(StyleManager.SMALL);
                    StyleManager.stylize(childBox, SmallBoxStyle.MARRIED_WIDE);
                }
                else{
                    childBox.setType(StyleManager.SMALL);
                    StyleManager.stylize(childBox, SmallBoxStyle.SINGLE_LONG_FAT);
                }
        }
        return;
    }

}