///<reference path="IChartStyler.ts"/>
///<reference path="../../view/BoxStyleFactory.ts"/>
/**
 * Created by renae on 7/28/15.
 */

class VertDetChartSpacer implements  IChartStyler {

    getName() : string {
        return "VertDetChartSpacer";
    }

    private initialized:boolean = true;

    applyStyle(boxes: BoxMap): void {
        var rootId: string = boxes.getRoot();
        var root = boxes.getId(rootId);
        this.setBasedOnGeneration(null, root, 0);

        var queue = [];
        queue.push([rootId,0]);

        while(queue.length > 0) {
            var data = queue.shift();
            var box:IBox = boxes.getId(data[0]);
            //console.log(box.getHeight());
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

                if(this.initialized && generation === 4 || generation === 5) {
                    box.setCollapsed(false);
                }
            }
        }
        this.initialized = false;
    }

    private setBasedOnGeneration(parentBox: IBox, childBox: IBox, generation: number) {
        if(generation == 0) {
            var bx = 0;
            childBox.setType('largePicDetRotBox');
            childBox.setType('largePicDetRotBox');
            childBox.setX(bx);
            childBox.setHeight(BoxStyleFactory.getHeight('largePicDetRotBox'));
            childBox.setWidth(BoxStyleFactory.getWidth('largePicDetRotBox'));
        }
        else if(generation == 1) {
            bx = parentBox.getX() + parentBox.getWidth()/2-25;// - 150;
            childBox.setType('largePicDetRotBox');
            childBox.setX(bx);
            childBox.setHeight(BoxStyleFactory.getHeight('largePicDetRotBox'));
            childBox.setWidth(BoxStyleFactory.getWidth('largePicDetRotBox'));
        }
        else if(generation == 2) {
            bx = parentBox.getX() + parentBox.getWidth()/*/2*/ + 10;
            childBox.setType('medSmPicDetRotBox');
            childBox.setX(bx);
            childBox.setHeight(BoxStyleFactory.getHeight('medSmPicDetRotBox'));
            childBox.setWidth(BoxStyleFactory.getWidth('medSmPicDetRotBox'));
        }
        else if(generation == 3) {
            bx = parentBox.getX() + parentBox.getWidth()/2 + 10;
            childBox.setType('smallPicDetRotBox');
            childBox.setX(bx);
            childBox.setHeight(BoxStyleFactory.getHeight('smallPicDetRotBox'));
            childBox.setWidth(BoxStyleFactory.getWidth('smallPicDetRotBox'));
        }
        else if(generation == 4) {
            bx = parentBox.getX() + parentBox.getWidth()/2 + 10;
            childBox.setType('smallDetailBox');
            childBox.setX(bx);
            childBox.setHeight(BoxStyleFactory.getHeight('smallDetailBox'));
            childBox.setWidth(BoxStyleFactory.getWidth('smallDetailBox'));
        }
        else if(generation == 5) {
            bx = parentBox.getX() + parentBox.getWidth()/4 + 10;
            childBox.setType('smallDetailBox');
            childBox.setX(bx);
            childBox.setHeight(BoxStyleFactory.getHeight('smallDetailBox'));
            childBox.setWidth(BoxStyleFactory.getWidth('smallDetailBox'));
        }
        else if(generation == 6) {
            bx = parentBox.getX() + parentBox.getWidth()/3 + 10;
            childBox.setType('xsDetailBox');
            childBox.setX(bx);
            childBox.setHeight(BoxStyleFactory.getHeight('xsDetailBox'));
            childBox.setWidth(BoxStyleFactory.getWidth('xsDetailBox'));
        }
        else if(generation == 7) {
            bx = parentBox.getX() + parentBox.getWidth()/2 + 10;
            childBox.setType('xsNameYearBox');
            childBox.setX(bx);
            childBox.setHeight(BoxStyleFactory.getHeight('xsNameYearBox'));
            childBox.setWidth(BoxStyleFactory.getWidth('xsNameYearBox'));
        }
        else {
            var bx = parentBox.getX() + parentBox.getWidth() + 10;
            /*if(generation <= 8) {
                bx = parentBox.getX() + parentBox.getWidth()/2 + 10;
            }*/
            childBox.setType('smallestNameBox');
            childBox.setX(bx);
            childBox.setHeight(BoxStyleFactory.getHeight('smallestNameBox'));
            childBox.setWidth(BoxStyleFactory.getWidth('smallestNameBox'));
        }
    }
}