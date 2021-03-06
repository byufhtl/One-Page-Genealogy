///<reference path="../model/AbstractBox.ts"/>
///<reference path="AbstractStyler.ts"/>
///<reference path="BoxMap.ts"/>
///<reference path="../view/boxRenderers/StyleManager.ts"/>
/**
 * Created by calvinmcm on 4/13/16.
 */
abstract class AbstractChartStyle extends AbstractStyler{

     applyStyle(boxes: BoxMap): void {
        var rootId: string = boxes.getRoot();
        var root = boxes.getId(rootId);

        this.setBasedOnGeneration(null, root, 0);

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

                this.setBasedOnGeneration(box, branchBox, generation+1);

                queue.push([branchIds[i], generation+1]);

            }
        }
    }

    clearStyle(boxes: BoxMap): void{}

    protected abstract setBasedOnGeneration(box:IBox, branchBox:IBox, generation: number) :void;

    constructor(name:string){
        super(name);
    }
}