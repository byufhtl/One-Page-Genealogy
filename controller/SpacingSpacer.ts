///<reference path="AbstractStyler.ts"/>
///<reference path="../view/BoxStyleFactory.ts"/>
/**
 * Created by renae on 7/7/15.
 */
class SpacingSpacer extends AbstractStyler{

    constructor(){
        super("SpacingSpacer");
    }

    applyStyle(boxes: BoxMap): void {
        //if(boxes) {
            var rootId:string = boxes.getRoot();
            var root = boxes.getId(rootId);

            this.setBasedOnGeneration(null, root, 0);

            var queue = [];
            queue.push([rootId, 0]);

            while (queue.length > 0) {
                var data = queue.shift();
                var box:IBox = boxes.getId(data[0]);
                var generation:number = data[1];
                var node:INode = box.getNode();
                var branchIds = node.getBranchIds();

                for (var i:number = 0; i < branchIds.length; i++) {
                    var branchBox:IBox = boxes.getId(branchIds[i]);
                    if (!branchBox) {
                        continue;
                    }

                    this.setBasedOnGeneration(box, branchBox, generation + 1);

                    queue.push([branchIds[i], generation + 1]);
                }
            }
        //}
    }
    private setBasedOnGeneration(parentBox: IBox, childBox: IBox, generation: number) {
        childBox.setSpace(1);
    }
}