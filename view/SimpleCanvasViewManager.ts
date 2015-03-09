///<reference path="../controller/BoxMap.ts"/>
///<reference path="IViewManager.ts"/>
/**
 * Created by curtis on 3/9/15.
 */
class SimpleCanvasViewManager implements IViewManager {

    private canvas;
    private ctx;

    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
    }
    refresh(boxes: BoxMap): void {
        this.ctx.clearRect ( 0 , 0 , this.canvas.width, this.canvas.height );

        var rootId: string = boxes.getRoot();
        var root = boxes.getId(rootId);

        var queue: string[] = [];
        queue.push(rootId);

        while(queue.length > 0) {
            var box:IBox = boxes.getId(queue.shift());
            var node:INode = box.getNode();
            var branchIds = node.getBranchIds();

            //console.log(branchIds);
            if(branchIds.length === 0) {
                this.ctx.fillStyle = "#993399";
            }
            else {

                if(box.getType() === "first") {
                    this.ctx.fillStyle = "#006600";
                }
                else if(box.getType() === "second") {
                    this.ctx.fillStyle = "#660000";
                }
                else {
                    this.ctx.fillStyle = "#666666";
                }

                for (var i:number = 0; i < branchIds.length; i++) {
                    var branchBox:IBox = boxes.getId(branchIds[i]);
                    if (!branchBox) {
                        continue;
                    }

                    this.ctx.beginPath();
                    this.ctx.moveTo(box.getX() + box.getWidth(), box.getY() + box.getHeight()/2);
                    this.ctx.lineTo(branchBox.getX(), branchBox.getY() + branchBox.getHeight()/2);
                    this.ctx.stroke();

                    queue.push(branchIds[i]);
                }
            }
            this.ctx.fillRect(box.getX()+1, box.getY()+1, box.getWidth()-2, box.getHeight()-2);

        }
    }
}