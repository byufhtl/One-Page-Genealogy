///<reference path="IStyler.ts"/>
/**
 * Created by curtis on 3/9/15.
 */
class SimpleGenerationSpacer implements  IStyler {
    applyStyle(boxes: BoxMap): void {
        var rootId: string = boxes.getRoot();
        var root = boxes.getId(rootId);

        root.setX(0);
        root.setWidth(100);
        root.setHeight(30);
        root.setType('first');

        var queue: string[] = [];
        queue.push(rootId);

        while(queue.length > 0) {
            var box:IBox = boxes.getId(queue.shift());
            var node:INode = box.getNode();
            var branchIds = node.getBranchIds();



            var bx = box.getX() + box.getWidth() + 10;
            var bw = box.getWidth();
            var bh = box.getHeight();

            for(var i:number=0; i<branchIds.length; i++) {
                var branchBox:IBox = boxes.getId(branchIds[i]);
                if(!branchBox) {
                    continue;
                }
                if(box.getType() === 'first') {
                    branchBox.setType('second');
                }

                branchBox.setX(bx);
                branchBox.setWidth(bw);
                branchBox.setHeight(bh);
                queue.push(branchIds[i]);
            }
        }
    }
}