///<reference path="IStyler.ts"/>
///<reference path="../view/BoxStyleFactory.ts"/>
/**
 * Created by renae on 8/5/15.
 */
class ColorSpacer implements  IStyler {
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
                if(child == 0)
                    childBox.setColor('#d5bde9');//purple
                else if(child == 1)
                    childBox.setColor('#a8f7ff');//blue
                else if(child == 2)
                    childBox.setColor('#a9ffaf');//green
                else if(child == 3)
                    childBox.setColor('#ffffaf');//yellow
                else if(child == 4)
                    childBox.setColor('#fddcaf');//orange
                else if(child == 5)
                    childBox.setColor('#ffb8af');//red
            }

            else if(childBox.getNode().getBranchIds().length>2) {
                childBox.setColor('#d5bde9');//blue
            }
            else
                childBox.setColor('#a8f7ff');
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
                if(child == 0)
                    childBox.setColor('#d5bde9');//purple
                else if(child == 1)
                    childBox.setColor('#a8f7ff');//blue
                else if(child == 2)
                    childBox.setColor('#a9ffaf');//green
                else if(child == 3)
                    childBox.setColor('#ffffaf');//yellow
                else if(child == 4)
                    childBox.setColor('#fddcaf');//orange
                else if(child == 5)
                    childBox.setColor('#ffb8af');//red
            }
            else {
                //childBox.setColor('#ffd1dc')
                childBox.setColor(parentBox.getColor());
            }
        }
        else {
                childBox.setColor(parentBox.getColor());
        }

    }
}