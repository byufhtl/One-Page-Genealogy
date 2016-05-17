///<reference path="../AbstractChartStyle.ts"/>
/**
 * Created by calvinmcm on 4/14/16.
 */

class EightElevenChartStyler extends AbstractChartStyle{

    private initialized :boolean = true;
    private collapseArray :string[];

    constructor(){
        super("EightElevenChartStyler");
        this.collapseArray = [];
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

                if(this.initialized && generation === 5 && !box.isCollapsed()){//>4) {
                    box.setCollapsed(true);
                    this.collapseArray.push(node.getId());
                }
            }
        }
        this.initialized = false;
    }

    clearStyle(boxes: BoxMap): void{
        for(var key of this.collapseArray){
            boxes.getId(key).setCollapsed(false);
        }
    }

    setBasedOnGeneration(parentBox :IBox, branchBox :IBox, generation :number) :void{
        branchBox.getRenderInstructions().clear();

        switch(generation){
            case 0:
                branchBox.setX(0);
                branchBox.setType(StyleManager.SMALL);
                StyleManager.stylize(branchBox, SmallBoxStyle.SINGLE_LONG);
                break;
            case 1:
                branchBox.setX(parentBox.getX() + 20);
                branchBox.setType(StyleManager.SMALL);
                StyleManager.stylize(branchBox, SmallBoxStyle.SINGLE_LONG);
                break;
            case 2:
                branchBox.setX(parentBox.getX() + 2*parentBox.getWidth()/5 + 20);
                branchBox.setType(StyleManager.SMALL);
                StyleManager.stylize(branchBox, SmallBoxStyle.SINGLE_LONG);
                break;
            case 3:
                branchBox.setX(parentBox.getX() + 2*parentBox.getWidth()/5 + 20);
                branchBox.setType(StyleManager.MINI);
                StyleManager.stylize(branchBox, MiniBoxStyle.SINGLE);
                break;
            case 4:
                branchBox.setX(parentBox.getX() + 2*parentBox.getWidth()/3 + 20);
                branchBox.setType(StyleManager.TINY);
                StyleManager.stylize(branchBox, TinyBoxStyle.SINGLE);
                break;
            case 5:
                branchBox.setX(parentBox.getX() + parentBox.getWidth()/2 + 20);
                branchBox.setType(StyleManager.TINY);
                StyleManager.stylize(branchBox, TinyBoxStyle.SINGLE);
                break;
            default:
                branchBox.setX(parentBox.getX() + parentBox.getWidth()/2 + 20);
                branchBox.setType(StyleManager.TINY);
                StyleManager.stylize(branchBox, TinyBoxStyle.SINGLE);
                break;
        }
    }
}