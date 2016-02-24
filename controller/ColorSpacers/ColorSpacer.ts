///<reference path="IColorStyler.ts"/>
///<reference path="../../view/BoxStyleFactory.ts"/>
///<reference path="../../view/ColorManager.ts"/>
/**
 * Created by renae on 8/5/15.
 * Last updated 2/18/2016
 */
class ColorSpacer implements  IColorStyler {
    applyStyle(boxes: BoxMap): void {
        var rootId: string = boxes.getRoot();
        var root = boxes.getId(rootId);
        var genZeroMult: boolean;
        var genOneMult: boolean;
        if(root.getNode().getSpouses().length>1)
            genZeroMult = true;
        else
            genZeroMult = false;
        if(!genZeroMult && root.getNode().getBranchIds().length>1)
            genOneMult = true;
        else
            genOneMult = false;

        //this.setBasedOnGeneration(null, root, 0);
        this.setBasedOnBranch(null, root, 0,0,1,genZeroMult,genOneMult);

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
                if(box.getNode().getSpouses().length>1){
                    this.setBasedOnBranch(box, branchBox, generation,i,branchIds.length,genZeroMult,genOneMult);

                    queue.push([branchIds[i], generation]);
                }
                else {
                    this.setBasedOnBranch(box, branchBox, generation + 1,i,branchIds.length,genZeroMult,genOneMult);

                    queue.push([branchIds[i], generation + 1]);
                }


                //this.setBasedOnGeneration(box, branchBox, generation+1);
                //this.setBasedOnBranch(box,branchBox,generation+1,i,branchIds.length);

                //queue.push([branchIds[i], generation+1]);
            }
        }
    }
    private setBasedOnBranch(parentBox: IBox, childBox: IBox, generation: number,
                             child: number, numSiblings: number,genZeroMult :boolean,genOneMult: boolean){
        //#a9ffaf green  12582849(green)
        //#ffffaf yellow 13092607(blue)
        //#fddcaf orange
        //#ffb8af red
        //#ffd1dc pink
        //#e6c8ff purple

        if(generation == 0){

            if(numSiblings>0){// && !parentBox.getNode().getSpouses().length>1){
                child = child % 6;
                switch(child) {
                    case 0:
                        childBox.setColor(ColorManager.purple());
                        break;
                    case 1:
                        childBox.setColor(ColorManager.blue());
                        break;
                    case 2:
                        childBox.setColor(ColorManager.green());
                        break;
                    case 3:
                        childBox.setColor(ColorManager.yellow());
                        break;
                    case 4:
                        childBox.setColor(ColorManager.orange());
                        break;
                    case 5:
                        childBox.setColor(ColorManager.red());
                        break;
                }
            }

            else if(childBox.getNode().getBranchIds().length>2) {
                childBox.setColor(ColorManager.purple());
            }
            else
                childBox.setColor(ColorManager.blue());
        }
        //else if(generation == 1 && parentBox.getNode().getSpouses().length>1)
        //{
        //    childBox.setColor('#d5bde9');
        //}
        else if(generation==1){
            if(child == 0 || genZeroMult)//catches generation where the original person has multiple spouses
                childBox.setColor(parentBox.getColor());
            else if (parentBox.getNode().getSpouses().length>1 && (genZeroMult || genOneMult))//=1)
                childBox.setColor(parentBox.getColor());
            else if(!genZeroMult && (numSiblings >1 ||
                (!genOneMult && childBox.getNode().getSpouses().length>1))){// && parentBox.getNode().getSpouses().length>=1){
                child = child % 6;
                switch(child) {
                    case 0:
                        childBox.setColor(ColorManager.purple());
                        break;
                    case 1:
                        childBox.setColor(ColorManager.blue());
                        break;
                    case 2:
                        childBox.setColor(ColorManager.green());
                        break;
                    case 3:
                        childBox.setColor(ColorManager.yellow());
                        break;
                    case 4:
                        childBox.setColor(ColorManager.orange());
                        break;
                    case 5:
                        childBox.setColor(ColorManager.red());
                        break;
                }
            }
            else {
                //childBox.setColor(ColorManager.pink());
                childBox.setColor(parentBox.getColor());
            }
        }
        else {
                childBox.setColor(parentBox.getColor());
        }

    }
}