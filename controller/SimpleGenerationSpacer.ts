///<reference path="IStyler.ts"/>
///<reference path="../view/BoxStyleFactory.ts"/>
/**
 * Created by curtis on 3/9/15.
 */
class SimpleGenerationSpacer implements  IStyler {
    getName() : string {
        return "SimpleGenerationSpacer";
    }
    applyStyle(boxes: BoxMap): void {
        var rootId: string = boxes.getRoot();
        var root = boxes.getId(rootId);

        root.setX(0);
        root.setHeight(BoxStyleFactory.getHeight('simpleNameBox'));
        root.setWidth(BoxStyleFactory.getWidth('simpleNameBox'));
        root.setType('simpleNameBox');

        var queue: string[] = [];
        queue.push(rootId);

        while(queue.length > 0) {
            var box:IBox = boxes.getId(queue.shift());
            var node:INode = box.getNode();
            var branchIds = node.getBranchIds();



            var bx = box.getX() + box.getWidth() + 10;

            for(var i:number=0; i<branchIds.length; i++) {
                var branchBox:IBox = boxes.getId(branchIds[i]);
                if(!branchBox) {
                    continue;
                }

                branchBox.setType('simpleNameBox');

                branchBox.setX(bx);
                branchBox.setHeight(BoxStyleFactory.getHeight('simpleNameBox'));
                branchBox.setWidth(BoxStyleFactory.getWidth('simpleNameBox'));
                queue.push(branchIds[i]);
            }
        }
    }
}