///<reference path="AbstractStyler.ts"/>
/**
 * Created by curtis on 3/25/15.
 */
class CollapseSpacer extends AbstractStyler {

    private customMap: {[s:string]: boolean};

    constructor() {
        super("CollapseSpacer");
        this.customMap = {};
    }

    setCustomMap(map:{[s:string]: boolean}){
        this.customMap = map;
    }

    applyStyle(boxes: BoxMap): void {
        for (var key in this.customMap) {
            if (this.customMap.hasOwnProperty(key)) {
                var box:IBox = boxes.getId(key);
                if(!box) {
                    continue;
                }
                box.setCollapsed(this.customMap[key]);

                //var queue: string[] = [];
                //queue.push(key);
                //while(queue.length > 0) {
                //    var box:IBox = boxes.getId(queue.shift());
                //    if(!box){
                //        continue;
                //    }
                //
                //    var node:INode = box.getNode();
                //    var branchIds = node.getBranchIds();
                //
                //    if(node.getId() !== key) {
                //        boxes.removeId(node.getId());
                //    }
                //
                //    for (var i:number = 0; i < branchIds.length; i++) {
                //        var branchBox:IBox = boxes.getId(branchIds[i]);
                //        if (!branchBox) {
                //            continue;
                //        }
                //
                //        queue.push(branchIds[i]);
                //    }
                //}
            }
        }
    }
    collapseId(id: string, collapsed: boolean) {
        //if(this.customMap[id]) {
        //    delete this.customMap[id];
        //}
        //else {
        //    this.customMap[id] = true;
        //}
        this.customMap[id] = collapsed;
    }
}