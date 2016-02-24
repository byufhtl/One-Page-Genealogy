///<reference path="IStyler.ts"/>
///<reference path="../view/BoxStyleFactory.ts"/>
/**
 * Created by phobos2390 on 3/18/15.
 */
class LeafNodeSpacer implements  IStyler {
    getName() : string {
        return "LeafNodeSpacer";
    }
    applyStyle(boxes: BoxMap): void {
        var rootId: string = boxes.getRoot();
        var root = boxes.getId(rootId);

        var queue: string[] = [];
        queue.push(rootId);

        while(queue.length > 0) {
            var box:IBox = boxes.getId(queue.shift());
            var node:INode = box.getNode();
            var branchIds = node.getBranchIds();

            if(branchIds.length == 0) {
                box.setType('horizontalNameLifeBox');

                box.setHeight(BoxStyleFactory.getHeight('horizontalNameLifeBox'));
                box.setWidth(BoxStyleFactory.getWidth('horizontalNameLifeBox'));
            }

            var bx = box.getX() + box.getWidth() + 10;

            for(var i:number=0; i<branchIds.length; i++) {
                var branchBox:IBox = boxes.getId(branchIds[i]);
                if(!branchBox) {
                    continue;
                }
                queue.push(branchIds[i]);
            }
        }
    }
}