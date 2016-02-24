///<reference path="IChartColorStyler.ts"/>
///<reference path="../../view/BoxStyleFactory.ts"/>
///<reference path="../../view/ColorManager.ts"/>
/**
 * Created by renae on 9/9/15.
 * Last updated on 1/29/2016
 */

class BaptismColorSpacer implements  IChartColorStyler {

    getName() : string {
        return "BaptismColorSpacer";
    }

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

                var node2 = branchBox.getNode();

                if(node2.hasAttr("baptism")){
                    branchBox.setColor(ColorManager.blue());
                }
                else{
                    var birthdate = new Date(node2.getAttr("birthdate"));
                    var deathdate = new Date(node2.getAttr("deathdate"));
                    var birthyear = birthdate.getFullYear();
                    var deathyear = deathdate.getFullYear();

                    if(deathyear - birthyear > 8 ){
                        branchBox.setColor(ColorManager.red());
                    }
                    else{
                        branchBox.setColor(ColorManager.yellow());
                    }
                }

                queue.push([branchIds[i], generation+1]);
            }
        }
    }
}