///<reference path="IStyler.ts"/>
///<reference path="../view/BoxStyleFactory.ts"/>
/**
 * Created by curtis on 3/9/15.
 */
class SimpleGenerationSpacer implements  IStyler {
    applyStyle(boxes: BoxMap): void {
        var rootId: string = boxes.getRoot();
        var root = boxes.getId(rootId);

        root.setX(0);
        root.setHeight(BoxStyleFactory.getHeight('basic'));
        root.setWidth(BoxStyleFactory.getWidth('basic'));
        root.setType('basic');

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

                branchBox.setType('basic');

                branchBox.setX(bx);
                branchBox.setHeight(BoxStyleFactory.getHeight('basic'));
                branchBox.setWidth(BoxStyleFactory.getWidth('basic'));
                queue.push(branchIds[i]);
            }
        }
    }
}