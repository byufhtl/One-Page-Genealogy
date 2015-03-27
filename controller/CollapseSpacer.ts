///<reference path="IStyler.ts"/>
/**
 * Created by curtis on 3/25/15.
 */
class CollapseSpacer implements IStyler {
    private customMap: {[s:string]: boolean};

    constructor() {
        this.customMap = {};
    }
    applyStyle(boxes: BoxMap): void {
        for (var key in this.customMap) {
            if (this.customMap.hasOwnProperty(key)) {
                var box:IBox = boxes.getId(key);
                if(!box) {
                    continue;
                }

                box.setCollapsed(this.customMap[key]);

                var queue: string[] = [];
                queue.push(key);
                while(queue.length > 0) {
                    var box:IBox = boxes.getId(queue.shift());
                    if(!box){
                        continue;
                    }

                    var node:INode = box.getNode();
                    var branchIds = node.getBranchIds();

                    if(node.getId() !== key) {
                        boxes.removeId(node.getId());
                    }

                    for (var i:number = 0; i < branchIds.length; i++) {
                        var branchBox:IBox = boxes.getId(branchIds[i]);
                        if (!branchBox) {
                            continue;
                        }

                        queue.push(branchIds[i]);
                    }
                }
            }
        }
    }
    collapseId(id: string, collapsed: boolean) {
        //if(collapsed) {
        //    this.customMap[id] = collapsed;
        //}
        //else if(this.customMap[id]) {
        //    delete this.customMap[id];
        //}
        if(this.customMap[id]) {
            delete this.customMap[id];
        }
        else {
            this.customMap[id] = true;
        }
    }
}