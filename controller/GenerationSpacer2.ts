///<reference path="IStyler.ts"/>
///<reference path="../view/BoxStyleFactory.ts"/>
/**
 * Created by curtis on 3/9/15.
 */
class GenerationSpacer2 implements  IStyler {
    getName() : string {
        return "GenerationSpacer2";
    }
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
    private setBasedOnGeneration(parentBox: IBox, childBox: IBox, generation: number) {

        if(generation == 0) {
            var bx = 0;
            childBox.setType('largePictureBox');
            childBox.setX(bx);
            childBox.setHeight(BoxStyleFactory.getHeight('largePictureBox'));
            childBox.setWidth(BoxStyleFactory.getWidth('largePictureBox'));
        }
        else if(generation == 1) {
            bx = parentBox.getX() + parentBox.getWidth()/2 + 10;
            childBox.setType('largePictureBox2');
            childBox.setX(bx);
            childBox.setHeight(BoxStyleFactory.getHeight('largePictureBox2'));
            childBox.setWidth(BoxStyleFactory.getWidth('largePictureBox2'));
        }
        else if(generation == 2) {
            bx = parentBox.getX() + parentBox.getWidth()/2 + 10;
            childBox.setType('mediumPictureBox');
            childBox.setX(bx);
            childBox.setHeight(BoxStyleFactory.getHeight('mediumPictureBox'));
            childBox.setWidth(BoxStyleFactory.getWidth('mediumPictureBox'));
        }
        else if(generation == 3) {
            bx = parentBox.getX() + parentBox.getWidth()/2 + 10;
            childBox.setType('smallPictureBox');
            childBox.setX(bx);
            childBox.setHeight(BoxStyleFactory.getHeight('smallPictureBox'));
            childBox.setWidth(BoxStyleFactory.getWidth('smallPictureBox'));
        }
        else if(generation == 4) {
            bx = parentBox.getX() + parentBox.getWidth()/2 + 10;
            childBox.setType('smallNameBox');
            childBox.setX(bx);
            childBox.setHeight(BoxStyleFactory.getHeight('smallNameBox'));
            childBox.setWidth(BoxStyleFactory.getWidth('smallNameBox'));
        }
        else if(generation == 5) {
            bx = parentBox.getX() + parentBox.getWidth()/2 + 10;
            childBox.setType('xsNameBox');
            childBox.setX(bx);
            childBox.setHeight(BoxStyleFactory.getHeight('xsNameBox'));
            childBox.setWidth(BoxStyleFactory.getWidth('xsNameBox'));
        }
        else {
            var bx = parentBox.getX() + parentBox.getWidth() + 10;
            if(generation <= 7) {
                bx = parentBox.getX() + parentBox.getWidth()/2 + 10;
            }
            childBox.setType('xsNameBox');
            childBox.setX(bx);
            childBox.setHeight(BoxStyleFactory.getHeight('xsNameBox'));
            childBox.setWidth(BoxStyleFactory.getWidth('xsNameBox'));
        }
    }
}