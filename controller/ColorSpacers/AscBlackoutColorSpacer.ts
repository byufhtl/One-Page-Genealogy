///<reference path="../AbstractStyler.ts"/>
///<reference path="../../view/BoxStyleFactory.ts"/>
///<reference path="../../view/ColorManager.ts"/>
/**
 * Created by renae on 10/5/15.
 * Last updated 2/24/2016
 */

class AscBlackoutColorSpacer extends AbstractStyler {

    constructor(){
        super("AscBlackoutColorSpacer");
    }

    applyStyle(boxes: BoxMap): void {
        $("#opg-chart > g").css('fill','black');
        var rootId: string = boxes.getRoot();
        var root = boxes.getId(rootId);

        this.setBasedOnBranch(null, root, 0,0,1);

        var queue = [];
        queue.push([rootId,0]);

        while(queue.length > 0) {
            var data = queue.shift();
            var box:IBox = boxes.getId(data[0]);
            var generation: number= data[1];
            var node:INode = box.getNode();
            var branchIds = node.getBranchIds();

            for(var i:number=0; i<branchIds.length; i++) {
                var branchBox:IBox = boxes.getId(branchIds[i]);
                if(!branchBox) {
                    continue;
                }

                this.setBasedOnBranch(box,branchBox,generation+1,i,branchIds.length);

                queue.push([branchIds[i], generation+1]);
            }
        }
    }
    private setBasedOnGeneration(parentBox: IBox, childBox: IBox, generation: number) {
        if(generation == 0) {
            childBox.setColor(ColorManager.blue());
        }
        else {
            var newColor:number = (parseInt(parentBox.getColor().split("#")[1],16));
            newColor = newColor-20;
            var newHex = "#"+newColor.toString(16);
            childBox.setColor(newHex);
        }
    }
    private setBasedOnBranch(parentBox: IBox, childBox: IBox, generation: number, child: number, numSiblings: number){
        if(!childBox.getNode().hasAttr('name')){
            childBox.setColor(ColorManager.lightgray());
        }else {
            if (generation == 0) {
                /*if(childBox.getNode().getBranchIds().length>2)
                 childBox.setColor('#d5bde9');//blue
                 else*/
                childBox.setColor(ColorManager.black());
                childBox.setTextColor(ColorManager.purple());
                childBox.getRenderInstructions().setBorderColor(ColorManager.purple());
            }
            else if (generation == 1) {
                if (child == 0) {
                    childBox.setColor(ColorManager.black());
                    childBox.setTextColor(ColorManager.blue());
                    childBox.getRenderInstructions().setBorderColor(ColorManager.blue());
                }
                else {
                    childBox.setColor(ColorManager.black());
                    childBox.setTextColor(ColorManager.yellow());
                    childBox.getRenderInstructions().setBorderColor(ColorManager.yellow());
                }
            }
            else if (generation == 2) {
                // A gender-independent methodology that just uses the parent's Color.

                let parent_color = parentBox.getTextColor();
                let color: string = parent_color;

                if (parent_color == ColorManager.blue()){ // Right wing
                    color = (child) ? ColorManager.green() : ColorManager.blue(); // child = 0 => false
                }
                else if (parent_color == ColorManager.yellow()){ // Left wing
                    color = (child) ? ColorManager.yellow() : ColorManager.red(); // child = 0 => false
                }
                else{
                    console.log("Off-colored parent: " + parent_color + " on " + childBox.getNode().getId());
                }
                childBox.setColor(ColorManager.black());
                childBox.setTextColor(color);
                childBox.getRenderInstructions().setBorderColor(color);

                // The old, gender-dependent method
                //var gender = 'none';
                //if (parentBox.getNode().hasAttr('gender')) {
                //    gender = parentBox.getNode().getAttr('gender');
                //}
                //
                //if (child == 0 && gender === 'Male') {
                //    childBox.setColor(ColorManager.black());
                //    childBox.setTextColor(ColorManager.blue());
                //    childBox.getRenderInstructions().setBorderColor(ColorManager.blue());
                //}
                //else if (child == 1 && gender === 'Male') {
                //    childBox.setColor(ColorManager.black());
                //    childBox.setTextColor(ColorManager.green());
                //    childBox.getRenderInstructions().setBorderColor(ColorManager.green());
                //}
                //else if (child == 0 && gender === 'Female') {
                //    childBox.setColor(ColorManager.black());
                //    childBox.setTextColor(ColorManager.red());
                //    childBox.getRenderInstructions().setBorderColor(ColorManager.red());
                //}
                //else if (child == 1 && gender === 'Female') {
                //    childBox.setColor(ColorManager.black());
                //    childBox.setTextColor(ColorManager.yellow());
                //    childBox.getRenderInstructions().setBorderColor(ColorManager.yellow());
                //}
            }
            else {
                childBox.setColor(ColorManager.black());
                childBox.setTextColor(parentBox.getTextColor());
                childBox.getRenderInstructions().setBorderColor(parentBox.getTextColor());
            }
        }
    }

    private modifyColor(hex:string,type:string, amount: number): string{
        var r:number = parseInt( hex[0]+hex[1],16);
        var g:number = parseInt(hex[2]+hex[3],16);
        var b:number = parseInt(hex[4]+hex[5],16);
        if(type === 'subR'){
            r = r-amount;
        }
        else if(type === 'addR'){
            r = r+amount;
        }
        else if(type === 'subG'){
            g = g-amount;
        }
        else if(type === 'addG'){
            g = g+amount;
        }
        else if(type === 'subB'){
            b = b-amount;
        }
        else if(type === 'addB'){
            b = b+amount;
        }

        if(r > 255)
            r = 255;
        if(g > 255)
            g = 255;
        if(b > 255)
            b = 255;
        if(r < 0)
            r = 0;
        if(g < 1)
            g = 0;
        if(b < 0)
            b = 0;

        console.log("("+r+","+g+","+b+")");
        var red = r.toString(16);
        var green = g.toString(16);
        var blue = b.toString(16);
        if(red.length<1)
            red = '00';
        if(red.length<2)
            red = '0'+red;
        if(green.length<1)
            green = '00';
        if(green.length<2)
            green = '0'+red;
        if(blue.length<1)
            blue = '00';
        if(blue.length<2)
            blue = '0'+red;

        console.log(green);
        console.log("("+red+","+green+","+blue+")");
        return '#'+red+green+blue;
    }
}