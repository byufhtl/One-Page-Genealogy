///<reference path="IChartColorStyler.ts"/>
///<reference path="../../view/BoxStyleFactory.ts"/>
///<reference path="../../view/ColorManager.ts"/>
/**
 * Created by renae on 9/9/15.
 * Last updated on 1/29/2016
 */
class GenderColorSpacer implements  IChartColorStyler {
    getName() : string {
        return "GenderColorSpacer";
    }

    applyStyle(boxes: BoxMap): void {
        var rootId: string = boxes.getRoot();
        var root = boxes.getId(rootId);

        // Set root color.
        this.colorNode(root);

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

                this.colorNode(branchBox);

                queue.push([branchIds[i], generation+1]);
            }
        }
    }

    private colorNode(box:IBox):void{
        var gender  = box.getNode().getAttr('gender');
        if(gender == "Male"){
            box.setColor(ColorManager.blue());
        }
        else if(gender == "Female"){
            box.setColor(ColorManager.pink());
        }
        else{
            box.setColor(ColorManager.gray());
        }
    }
}