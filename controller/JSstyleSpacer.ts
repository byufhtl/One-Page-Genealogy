///<reference path="IStyler.ts"/>
///<reference path="../view/BoxStyleFactory.ts"/>
/**
 * Created by justinrasband on 9/14/15.
 */

class JSstyleSpacer implements  IStyler {
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
                childBox.setType('JSLargeDetRotBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('JSLargeDetRotBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('JSLargeDetRotBox'));
                childBox.setSpouseNode(null);
            }else if(numSpouses==1){
                childBox.setType('JSLrgDetRotSpBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('JSLrgDetRotSpBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('JSLrgDetRotSpBox'));
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
                childBox.setType('JSLargeDetRotBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('JSLargeDetRotBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('JSLargeDetRotBox'));
                childBox.setSpouseNode(null);
            }else if(numSpouses==1){
                childBox.setType('JSLrgDetRotSpBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('JSLrgDetRotSpBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('JSLrgDetRotSpBox'));
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
                childBox.setType('JSMedDetBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('JSMedDetBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('JSMedDetBox'));
                childBox.setSpouseNode(null);
            }else if(numSpouses==1){
                childBox.setType('JSLrgDetRotSpBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('JSLrgDetRotSpBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('JSLrgDetRotSpBox'));
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
                childBox.setType('JSMedDetBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('JSMedDetBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('JSMedDetBox'));
                childBox.setSpouseNode(null);
            }else if(numSpouses==1){
                childBox.setType('JSSmallDetSpBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('JSSmallDetSpBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('JSSmallDetSpBox'));
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
                childBox.setType('JSMedDetBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('JSMedDetBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('JSMedDetBox'));
                childBox.setSpouseNode(null);
            }else if(numSpouses==1){
                childBox.setType('JSSmallDetSpBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('JSSmallDetSpBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('JSSmallDetSpBox'));
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
                childBox.setType('JSMedDetBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('JSMedDetBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('JSMedDetBox'));
                childBox.setSpouseNode(null);
            }else if(numSpouses==1){
                childBox.setType('JSSmallDetSpBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('JSSmallDetSpBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('JSSmallDetSpBox'));
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
                childBox.setType('JSMedDetBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('JSMedDetBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('JSMedDetBox'));
                childBox.setSpouseNode(null);
            }else if(numSpouses==1){
                childBox.setType('JSSmallDetSpBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('JSSmallDetSpBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('JSSmallDetSpBox'));
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
                childBox.setType('JSMedDetBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('JSMedDetBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('JSMedDetBox'));
                childBox.setSpouseNode(null);
            }else if(numSpouses==1&&spouse != null){
                childBox.setType('JSSmallDetSpBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('JSSmallDetSpBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('JSSmallDetSpBox'));
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
                childBox.setType('JSMedDetBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('JSMedDetBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('JSMedDetBox'));
                childBox.setSpouseNode(null);
            }else if(numSpouses==1){
                childBox.setType('JSSmallDetSpBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('JSSmallDetSpBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('JSSmallDetSpBox'));
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
