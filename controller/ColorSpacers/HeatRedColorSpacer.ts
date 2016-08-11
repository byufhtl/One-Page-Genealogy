///<reference path="../AbstractStyler.ts"/>
///<reference path="../../view/BoxStyleFactory.ts"/>
///<reference path="../../view/ColorManager.ts"/>
/**
 * Created by renae on 10/14/15.
 * Last updated 2/18/2016.
 */

class HeatRedColorSpacer extends AbstractStyler {

    private flavor :string;

    constructor(){
        super("HeatRedColorSpacer");
    }

    applyStyle(boxes: BoxMap): void {
        var rootId: string = boxes.getRoot();
        var root = boxes.getId(rootId);

        //this.setBasedOnGeneration(null, root, 0);
        this.setBasedOnGeneration(null, root);
        root.setTextColor(ColorManager.black());

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
                if(!box.getNode().getSpouses() || box.getNode().getSpouses().length>1){
                    this.setBasedOnGeneration(box, branchBox);

                    queue.push([branchIds[i], generation]);
                }
                else {
                    this.setBasedOnGeneration(box, branchBox);

                    queue.push([branchIds[i], generation + 1]);
                }
                branchBox.setTextColor(ColorManager.black());


                //this.setBasedOnGeneration(box, branchBox, generation+1);
                //this.setBasedOnBranch(box,branchBox,generation+1,i,branchIds.length);

                //queue.push([branchIds[i], generation+1]);
            }
        }
    }

    private setBasedOnGeneration(parentBox: IBox, childBox: IBox) {
        let count = childBox.getNode().getBranchIds().length;
        if(count){
            childBox.setColor(ColorManager.lighten(ColorManager.darkred(), 16 * count));
            return;
        }
        childBox.setColor(ColorManager.darkred());
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

    static COLD = "cold";
    static WARM = "warm";
}