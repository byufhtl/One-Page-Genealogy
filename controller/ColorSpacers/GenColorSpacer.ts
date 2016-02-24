///<reference path="IChartColorStyler.ts"/>
///<reference path="../../view/BoxStyleFactory.ts"/>
///<reference path="../../view/ColorManager.ts"/>
/**
 * Created by renae on 10/14/15.
 * Last updated 2/18/2016.
 */

class GenColorSpacer implements  IChartColorStyler {

    getName() : string {
        return "GenColorSpacer";
    }

    applyStyle(boxes: BoxMap): void {
        var rootId: string = boxes.getRoot();
        var root = boxes.getId(rootId);

        //this.setBasedOnGeneration(null, root, 0);
        this.setBasedOnGeneration(null, root, 0,false);

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
                if(box.getNode().getSpouses().length>1){
                    this.setBasedOnGeneration(box, branchBox, generation, true);

                    queue.push([branchIds[i], generation]);
                }
                else {
                    this.setBasedOnGeneration(box, branchBox, generation + 1,false);

                    queue.push([branchIds[i], generation + 1]);
                }


                //this.setBasedOnGeneration(box, branchBox, generation+1);
                //this.setBasedOnBranch(box,branchBox,generation+1,i,branchIds.length);

                //queue.push([branchIds[i], generation+1]);
            }
        }
    }
    private setBasedOnGeneration(parentBox: IBox, childBox: IBox, generation: number,repeat: boolean) {
        if(generation == 0) {
            childBox.setColor(ColorManager.blue());

        }
        else if(!repeat && generation <= 10) {
            var newColor:number = (parseInt(parentBox.getColor().split("#")[1],16));//.toString();
            newColor = newColor-64;
            var newHex = "#"+newColor.toString(16);
            childBox.setColor(newHex);
        }
        else
            childBox.setColor(parentBox.getColor());
    }

 private setBasedOnBranch2(parentBox: IBox, childBox: IBox, generation: number, child: number){
        //#a9ffaf green  #aefbc2(green)
        //#ffffaf yellow 13092607(blue)
        //#fddcaf orange #deffb7(a yellow green)
        //#ffb8af red   #eff4aa(yellow yellow)
        //#ffd1dc pink  #f4ebaa(orangeish yellow)
        //#e6c8ff purple #ecb9fb(purply pink)

        if(generation == 0){
            childBox.setColor(ColorManager.blue());
        }
        else if (generation==1){
            if(child == 0){
                //childBox.setColor(this.modifyColor(parentBox.getColor().split("#")[1],'addB'));//.toString();
                childBox.setColor(this.modifyColor(parentBox.getColor().split("#")[1],'subR',20));
                childBox.setColor(this.modifyColor(childBox.getColor().split("#")[1],'addG',40));
                childBox.setColor(this.modifyColor(childBox.getColor().split("#")[1],'subB',60));

                console.log(childBox.getColor());

            }
            else if(child == 1){
                childBox.setColor(this.modifyColor(parentBox.getColor().split("#")[1],'addR',100));
                //childBox.setColor(this.modifyColor(parentBox.getColor().split("#")[1],'subB'));
            }
        }
        else if (generation==2){
            if(child == 0){
                //childBox.setColor(this.modifyColor(parentBox.getColor().split("#")[1],'addB'));//.toString();
                childBox.setColor(this.modifyColor(parentBox.getColor().split("#")[1],'addR',50));
                childBox.setColor(this.modifyColor(childBox.getColor().split("#")[1],'addG',40));
                childBox.setColor(this.modifyColor(childBox.getColor().split("#")[1],'subB',10));

                console.log(childBox.getColor());

            }
            else if(child == 1){
                childBox.setColor(this.modifyColor(parentBox.getColor().split("#")[1],'subR',30));
                childBox.setColor(this.modifyColor(parentBox.getColor().split("#")[1],'subG',40));
            }
        }
        else if (generation<5){
            if(child == 0){
                //childBox.setColor(this.modifyColor(parentBox.getColor().split("#")[1],'addB'));//.toString();
                childBox.setColor(this.modifyColor(parentBox.getColor().split("#")[1],'subR',20));
                childBox.setColor(this.modifyColor(childBox.getColor().split("#")[1],'addG',40));
                childBox.setColor(this.modifyColor(childBox.getColor().split("#")[1],'subB',60));

                console.log(childBox.getColor());

            }
            else if(child == 1){
                childBox.setColor(this.modifyColor(parentBox.getColor().split("#")[1],'addR',100));
                //childBox.setColor(this.modifyColor(parentBox.getColor().split("#")[1],'subB'));
            }
        }
        else {
            childBox.setColor(parentBox.getColor());
        }
        console.log(childBox.getNode().getId()+" "+childBox.getColor());
    }
    private modifyColor(hex:string,type:string, amount: number): string{
        var r:number = parseInt( hex[0]+hex[1],16);
        var g:number = parseInt(hex[2]+hex[3],16);
        var b:number = parseInt(hex[4]+hex[5],16);
        if(type === 'subR'){
            r = r-amount;
        }
        else if(type === 'addR'){
            r = r+amount;
        }
        else if(type === 'subG'){
            g = g-amount;
        }
        else if(type === 'addG'){
            g = g+amount;
        }
        else if(type === 'subB'){
            b = b-amount;
        }
        else if(type === 'addB'){
            b = b+amount;
        }

        if(r > 255)
            r = 255;
        if(g > 255)
            g = 255;
        if(b > 255)
            b = 255;
        if(r < 0)
            r = 0;
        if(g < 1)
            g = 0;
        if(b < 0)
            b = 0;

        console.log("("+r+","+g+","+b+")");
        var red = r.toString(16);
        var green = g.toString(16);
        var blue = b.toString(16);
        if(red.length<1)
            red = '00';
        if(red.length<2)
            red = '0'+red;
        if(green.length<1)
            green = '00';
        if(green.length<2)
            green = '0'+red;
        if(blue.length<1)
            blue = '00';
        if(blue.length<2)
            blue = '0'+red;

        console.log(green);
        console.log("("+red+","+green+","+blue+")");
        return '#'+red+green+blue;
    }
}