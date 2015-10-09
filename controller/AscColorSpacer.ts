///<reference path="IStyler.ts"/>
///<reference path="../view/BoxStyleFactory.ts"/>
/**
 * Created by renae on 10/5/15.
 */
class AscColorSpacer implements  IStyler {
    applyStyle(boxes: BoxMap): void {
        var rootId: string = boxes.getRoot();
        var root = boxes.getId(rootId);

        //this.setBasedOnGeneration(null, root, 0);
        this.setBasedOnBranch(null, root, 0,0,1);

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

                //this.setBasedOnGeneration(box, branchBox, generation+1);
                this.setBasedOnBranch(box,branchBox,generation+1,i,branchIds.length);

                queue.push([branchIds[i], generation+1]);
            }
        }
    }
    private setBasedOnGeneration(parentBox: IBox, childBox: IBox, generation: number) {
        if(generation == 0) {
            childBox.setColor('#a8f7ff');

        }
        else {//if(generation == 1) {
            var newColor:number = (parseInt(parentBox.getColor().split("#")[1],16));//.toString();
            newColor = newColor-20;
            var newHex = "#"+newColor.toString(16);
            childBox.setColor(newHex);
        }
    }
    private setBasedOnBranch(parentBox: IBox, childBox: IBox, generation: number, child: number, numSiblings: number){
        //#a9ffaf green  12582849(green)
        //#ffffaf yellow 13092607(blue)
        //#fddcaf orange
        //#ffb8af red
        //#ffd1dc pink
        //#e6c8ff purple

        if(generation == 0){
            /*if(childBox.getNode().getBranchIds().length>2)
                childBox.setColor('#d5bde9');//blue
            else*/
                childBox.setColor('#D9ABFF');//'#c4b4f9');//'#a8f7ff');
        }
        else if(generation==1) {
            if(child == 0)//father
                childBox.setColor('#ABE4FF');//'#a8f7ff');//'#b4caff');
            else //mother
                childBox.setColor('#FFABAB');//'#ffb8af');//#f8c1ea');
        }
        else if(generation == 2){
            var gender = 'none';
            if(parentBox.getNode().hasAttr('gender')) {
                gender = parentBox.getNode().getAttr('gender');
            }

            if(child == 0 && gender === 'Male')//
                childBox.setColor('#ABE4FF');//'#a8f7ff');//'#a8f7ff');
            else if(child == 1 && gender === 'Male')//
                childBox.setColor('#DDFFAB');//'#a9ffaf');
            else if(child == 0 && gender === 'Female')
                childBox.setColor('#FFDAAB');//'#ffffaf');
            else if(child == 1 && gender === 'Female')
                childBox.setColor('#FFABAB');//'#ffb8af');//'#d5bde9');//'#fddcaf');
            //else
             //   childBox.setColor(parentBox.getColor());

            /*else if(numSiblings >2){
                child = child % 6;
                if(child == 0)
                    childBox.setColor('#d5bde9');//purple
                else if(child == 1)
                    childBox.setColor('#a8f7ff');//blue
                else if(child == 2)
                    childBox.setColor('#a9ffaf');//green
                else if(child == 3)
                    childBox.setColor('#ffffaf');//yellow
                else if(child == 4)
                    childBox.setColor('#fddcaf');//orange
                else if(child == 5)
                    childBox.setColor('#ffb8af');//red
            }
            else {
                childBox.setColor('#ffd1dc')
            }*/
        }
        else {
            childBox.setColor(parentBox.getColor());
        }

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