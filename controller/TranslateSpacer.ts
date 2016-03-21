///<reference path="AbstractStyler.ts"/>
///<reference path="../view/BoxStyleFactory.ts"/>
/**
 * Created by curtis on 3/27/15.
 */
class TranslateSpacer extends AbstractStyler{

    private dx: number;
    private dy: number;

    constructor() {
        super("TranslateSpacer");
        this.dx = 0;
        this.dy = 0;
    }
    applyStyle(boxes: BoxMap): void {
        var rootId: string = boxes.getRoot();
        var root = boxes.getId(rootId);

        root.setX(root.getX() + this.dx);
        root.setY(root.getY() + this.dy);

        var queue: string[] = [];
        queue.push(rootId);

        while(queue.length > 0) {
            var box:IBox = boxes.getId(queue.shift());
            var node:INode = box.getNode();
            var branchIds = node.getBranchIds();

            for(var i:number=0; i<branchIds.length; i++) {
                var branchBox:IBox = boxes.getId(branchIds[i]);
                if(!branchBox) {
                    continue;
                }

                branchBox.setX(branchBox.getX() + this.dx);
                branchBox.setY(branchBox.getY() + this.dy);

                queue.push(branchIds[i]);
            }
        }
    }
    public setTranslation(dx: number, dy: number): void {
        this.dx = dx;
        this.dy = dy;
    }
}