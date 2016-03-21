///<reference path="../AbstractStyler.ts"/>
///<reference path="../../view/BoxStyleFactory.ts"/>
///<reference path="../../view/ColorManager.ts"/>

/**
 * Created by calvin on 1/27/2016
 * Last updated 1/29/2016
 */

class GenColorVibrantSpacer extends AbstractStyler{


    constructor(){
        super("GenColorVibrantSpacer");
    }

    applyStyle(boxes: BoxMap): void {
        var rootId: string = boxes.getRoot();
        var root = boxes.getId(rootId);

        this.setBasedOnGenerationVibrant(root, 0);

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
                    this.setBasedOnGenerationVibrant(branchBox, generation);

                    queue.push([branchIds[i], generation]);
                }
                else {
                    this.setBasedOnGenerationVibrant(branchBox, generation + 1);

                    queue.push([branchIds[i], generation + 1]);
                }
            }
        }
    }
    private setBasedOnGenerationVibrant(childBox: IBox, generation: number) {
        childBox.setColor(ColorManager.getColorByIndex((generation%6)));
    }
}