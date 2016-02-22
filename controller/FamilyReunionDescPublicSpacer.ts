///<reference path="IStyler.ts"/>
///<reference path="../view/BoxStyleFactory.ts"/>
/**
 * Created by renae on 10/2/15.
 */
class FamilyReunionDescPublicSpacer implements  IStyler {
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
            var numSpouses = childBox.getNode().getSpouses().length;
            var spouse = childBox.getNode().getSpouses()[0];
            if(numSpouses==0){
                childBox.setType('JSMassiveSpouseRotBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('JSMassiveSpouseRotBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('JSMassiveSpouseRotBox'));
                childBox.setSpouseNode(null);
            }else if(numSpouses==1){
                childBox.setType('JSMassiveSpouseRotBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('JSMassiveSpouseRotBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('JSMassiveSpouseRotBox'));
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
                bx = parentBox.getX()+10;
            }
            else{
                bx = parentBox.getX() + parentBox.getWidth()+10;
            }
            var numSpouses = childBox.getNode().getSpouses().length;
            var spouse = childBox.getNode().getSpouses()[0];
            if(numSpouses==0){
                childBox.setType('JSMassiveSpouseRotBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('JSMassiveSpouseRotBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('JSMassiveSpouseRotBox'));
                childBox.setSpouseNode(null);
            }else if(numSpouses==1){
                childBox.setType('JSMassiveSpouseRotBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('JSMassiveSpouseRotBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('JSMassiveSpouseRotBox'));
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
                childBox.setType('JSMedDetPubBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('JSMedDetPubBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('JSMedDetPubBox'));
                childBox.setSpouseNode(null);
            }else if(numSpouses==1){
                childBox.setType('JSLrgDetRotSpPubBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('JSLrgDetRotSpPubBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('JSLrgDetRotSpPubBox'));
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
                childBox.setType('JSSmallerDetPubBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('JSSmallerDetPubBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('JSSmallerDetPubBox'));
                childBox.setSpouseNode(null);
            }else if(numSpouses==1){
                childBox.setType('JSSmallerDetSpPubBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('JSSmallerDetSpPubBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('JSSmallerDetSpPubBox'));
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
                childBox.setType('JSSmallDetPubBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('JSSmallDetPubBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('JSSmallDetPubBox'));
                childBox.setSpouseNode(null);
            }else if(numSpouses==1){
                childBox.setType('JSSmallDetSpPubBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('JSSmallDetSpPubBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('JSSmallDetSpPubBox'));
                childBox.setSpouseNode(childBox.getNode().getDisplaySpouse());
            }else{
                childBox.setType('nullBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('nullBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('nullBox'));
            }

            /////ADDED FOR FUN
        }
        else if(generation >= 5) {
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
                childBox.setType('JSSmallestDetPubBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('JSSmallestDetPubBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('JSSmallestDetPubBox'));
                childBox.setSpouseNode(null);
            }else if(numSpouses==1){
                childBox.setType('JSSmallestDetSpPubBox');
                childBox.setX(bx);
                childBox.setHeight(BoxStyleFactory.getHeight('JSSmallestDetSpPubBox'));
                childBox.setWidth(BoxStyleFactory.getWidth('JSSmallestDetSpPubBox'));
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