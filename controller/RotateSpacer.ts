///<reference path="IStyler.ts"/>
///<reference path="../view/BoxStyleFactory.ts"/>
/**
 * Created by curtis on 3/27/15.
 */
class RotateSpacer implements  IStyler {


    constructor() {

    }
    applyStyle(boxes: BoxMap): void {
        var rootId: string = boxes.getRoot();
        var root = boxes.getId(rootId);

        var tmp = root.getX();
        root.setX(root.getY());
        root.setY(tmp);

        var queue: string[] = [];
        queue.push(rootId);

        while(queue.length > 0) {
            var box:IBox = boxes.getId(queue.shift());
            var node:INode = box.getNode();
            var branchIds = node.getBranchIds();

            for(var i:number=0; i<branchIds.length; i++) {
                var branchBox:IBox = boxes.getId(branchIds[i]);
                if(!branchBox) {
                    continue;
                }

                var tmp = branchBox.getX();
                branchBox.setX(branchBox.getY());
                branchBox.setY(tmp);

                queue.push(branchIds[i]);
            }
        }
    }
}