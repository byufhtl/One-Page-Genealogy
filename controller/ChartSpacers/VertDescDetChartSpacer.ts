///<reference path="IChartStyler.ts"/>
///<reference path="../../view/BoxStyleFactory.ts"/>
///<reference path="../../sources/FSDescNode.ts"/>
/**
 * Created by renae on 8/12/15.
 */

class VertDescDetChartSpacer implements  IChartStyler {

    getName() : string {
        return "VertDescDetChartSpacer";
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

            //generation+= 1;

            for(var i:number=0; i<branchIds.length; i++) {
                var branchBox:IBox = boxes.getId(branchIds[i]);
                if(!branchBox) {
                    continue;
                }
                if(box.getNode().getSpouses().length>1){
                    this.setBasedOnGeneration(box, branchBox, generation);

                    queue.push([branchIds[i], generation]);
                }
                else {
                    this.setBasedOnGeneration(box, branchBox, generation + 1);

                    queue.push([branchIds[i], generation + 1]);
                }
                //box.setCollapsed(false);
            }
        }
    }
    private setBasedOnGeneration(parentBox: IBox, childBox: IBox, generation: number) {
        if(generation == 0) {
            var bx = 0;
            var numSpouses = childBox.getNode().getSpouses().length;
            var spouse = childBox.getNode().getSpouses()[0];
            if(numSpouses==0){
                childBox.setType('largePicDetRotBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('largePicDetRotBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('largePicDetRotBox'));
                childBox.setSpouseNode(null);
            }else if(numSpouses==1){
                childBox.setType('lrgPicDetRotSpBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('lrgPicDetRotSpBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('lrgPicDetRotSpBox'));
                childBox.setSpouseNode(childBox.getNode().getDisplaySpouse());
            }else{
                childBox.setType('nullBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('nullBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('nullBox'));
            }

        }
        else if(generation == 1) {
            if(parentBox.getNode().getSpouses().length>1){
                bx = parentBox.getX()+10;// - 150;
            }
            else{
                bx = parentBox.getX() + parentBox.getWidth()+10;// - 150;
            }
            var numSpouses = childBox.getNode().getSpouses().length;
            var spouse = childBox.getNode().getSpouses()[0];
            if(numSpouses==0){
                childBox.setType('largePicDetRotBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('largePicDetRotBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('largePicDetRotBox'));
                childBox.setSpouseNode(null);
            }else if(numSpouses==1){
                childBox.setType('lrgPicDetRotSpBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('lrgPicDetRotSpBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('lrgPicDetRotSpBox'));
                childBox.setSpouseNode(childBox.getNode().getDisplaySpouse());
            }else{
                childBox.setType('nullBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('nullBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('nullBox'));
            }

        }
        else if(generation == 2) {
            if(parentBox.getNode().getSpouses().length>1){
                bx = parentBox.getX()+10;// - 150;
            }
            else {
                bx = parentBox.getX() + parentBox.getWidth() + 10;
            }

            /////ADDED FOR FUN
            var numSpouses = childBox.getNode().getSpouses().length;
            var spouse = childBox.getNode().getSpouses()[0];

            if(numSpouses==0){
                childBox.setType('medSmPictureDetailBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('medSmPictureDetailBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('medSmPictureDetailBox'));
                childBox.setSpouseNode(null);
            }else if(numSpouses==1){
                childBox.setType('medDetRotSpBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('medDetRotSpBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('medDetRotSpBox'));
                childBox.setSpouseNode(childBox.getNode().getDisplaySpouse());
            }else{
                childBox.setType('nullBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('nullBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('nullBox'));
            }
            /////ADDED FOR FUN
        }
        else if(generation == 3) {
            if(parentBox.getNode().getSpouses().length>1){
                bx = parentBox.getX()+10;// - 150;
            }
            else {
                bx = parentBox.getX() + parentBox.getWidth() + 10;
            }
            /////ADDED FOR FUN
            var numSpouses = childBox.getNode().getSpouses().length;
            var spouse = childBox.getNode().getSpouses()[0];

            if(numSpouses==0){
                childBox.setType('smallPictureDetailBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('smallPictureDetailBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('smallPictureDetailBox'));
                childBox.setSpouseNode(null);
            }else if(numSpouses==1){
                childBox.setType('smallDetSpBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('smallDetSpBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('smallDetSpBox'));
                childBox.setSpouseNode(childBox.getNode().getDisplaySpouse());
            }else{
                childBox.setType('nullBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('nullBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('nullBox'));
            }
            /////ADDED FOR FUN
        }
        else if(generation == 4) {
            if(parentBox.getNode().getSpouses().length>1){
                bx = parentBox.getX()+10;// - 150;
            }
            else {
                bx = parentBox.getX() + parentBox.getWidth() + 10;
            }
            /////ADDED FOR FUN
            var numSpouses = childBox.getNode().getSpouses().length;
            var spouse = childBox.getNode().getSpouses()[0];

            if(numSpouses==0){
                childBox.setType('smallDetailBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('smallDetailBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('smallDetailBox'));
                childBox.setSpouseNode(null);
            }else if(numSpouses==1){
                childBox.setType('smallerDetSpBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('smallerDetSpBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('smallerDetSpBox'));
                childBox.setSpouseNode(childBox.getNode().getDisplaySpouse());
            }else{
                childBox.setType('nullBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('nullBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('nullBox'));
            }
            /////ADDED FOR FUN
        }
        else if(generation == 5) {
            if(parentBox.getNode().getSpouses().length>1){
                bx = parentBox.getX()+10;// - 150;
            }
            else {
                bx = parentBox.getX() + parentBox.getWidth() + 10;
            }
            /////ADDED FOR FUN
            var numSpouses = childBox.getNode().getSpouses().length;
            var spouse = childBox.getNode().getSpouses()[0];

            if(numSpouses==0){
                childBox.setType('smallDetailBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('smallDetailBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('smallDetailBox'));
                childBox.setSpouseNode(null);
            }else if(numSpouses==1){
                childBox.setType('smallerDetSpBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('smallerDetSpBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('smallerDetSpBox'));
                childBox.setSpouseNode(childBox.getNode().getDisplaySpouse());
            }else{
                childBox.setType('nullBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('nullBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('nullBox'));
            }
            /////ADDED FOR FUN
        }
        else if(generation == 6) {
            if(parentBox.getNode().getSpouses().length>1){
                bx = parentBox.getX()+10;// - 150;
            }
            else {
                bx = parentBox.getX() + parentBox.getWidth() + 10;
            }
            /////ADDED FOR FUN
            var numSpouses = childBox.getNode().getSpouses().length;
            var spouse = childBox.getNode().getSpouses()[0];

            if(numSpouses==0){
                childBox.setType('xsDetailBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('xsDetailBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('xsDetailBox'));
                childBox.setSpouseNode(null);
            }else if(numSpouses==1){
                childBox.setType('xsDetSpBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('xsDetSpBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('xsDetSpBox'));
                childBox.setSpouseNode(childBox.getNode().getDisplaySpouse());
            }else{
                childBox.setType('nullBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('nullBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('nullBox'));
            }
            /////ADDED FOR FUN
        }
        else if(generation == 7) {
            if(parentBox.getNode().getSpouses().length>1){
                bx = parentBox.getX()+10;// - 150;
            }
            else {
                bx = parentBox.getX() + parentBox.getWidth() + 10;
            }
            /////ADDED FOR FUN
            var numSpouses = childBox.getNode().getSpouses().length;
            var spouse = childBox.getNode().getSpouses()[0];

            if(numSpouses==0){
                childBox.setType('xsNameYearBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('xsNameYearBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('xsNameYearBox'));
                childBox.setSpouseNode(null);
            }else if(numSpouses==1&&spouse != null){
                childBox.setType('xsSpBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('xsSpBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('xsSpBox'));
                childBox.setSpouseNode(childBox.getNode().getDisplaySpouse());
            }else{
                childBox.setType('nullBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('nullBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('nullBox'));
            }
            /////ADDED FOR FUN
        }
        else {
            if(parentBox.getNode().getSpouses().length>1){
                bx = parentBox.getX()+10;// - 150;
            }
            else {
                bx = parentBox.getX() + parentBox.getWidth() + 10;
            }
            /*if(generation <= 8) {
             bx = parentBox.getX() + parentBox.getWidth()/2 + 10;
             }*/
            /////ADDED FOR FUN
            var numSpouses = childBox.getNode().getSpouses().length;
            var spouse = childBox.getNode().getSpouses()[0];

            if(numSpouses==0){
                childBox.setType('smallestNameBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('smallestNameBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('smallestNameBox'));
                childBox.setSpouseNode(null);
            }else if(numSpouses==1){
                childBox.setType('smallestSpBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('smallestSpBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('smallestSpBox'));
                childBox.setSpouseNode(childBox.getNode().getDisplaySpouse());
            }else{
                childBox.setType('nullBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('nullBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('nullBox'));
            }
            /////ADDED FOR FUN
        }
    }
}
