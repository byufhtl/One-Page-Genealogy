///<reference path="IStyler.ts"/>
///<reference path="../view/BoxStyleFactory.ts"/>
///<reference path="../view/ColorManager.ts"/>
/**
 * Created by renae on 9/9/15.
 * Last updated on 1/29/2016
 */
class GenderColorSpacer implements  IStyler {
    applyStyle(boxes: BoxMap): void {
        var rootId: string = boxes.getRoot();
        var root = boxes.getId(rootId);

        root.setColor(null);

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

                var gender  = branchBox.getNode().getAttr('gender');
                if(gender == "Male"){
                    branchBox.setColor(ColorManager.blue());
                }
                else if(gender == "Female"){
                    branchBox.setColor(ColorManager.pink());
                }
                else{
                    branchBox.setColor(ColorManager.gray());
                }


                queue.push([branchIds[i], generation+1]);
            }
        }
    }
}