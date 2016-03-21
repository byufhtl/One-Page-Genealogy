///<reference path="BoxMap.ts"/>
///<reference path="AbstractStyler.ts"/>
///<reference path="../js/jsDeclarations.ts"/>

/**
 * Created by curtis on 3/9/15.
 */
class YSpacer extends AbstractStyler{

    private high: number;
    private low: number;

    constructor() {
        super("YSpacer");
    }

    //A little bit of a rough converter to get the data
    //formatted right for the spacing algorithm.
    //the spacer should probably be redone in typescript
    //but for now we can do this ugly step

    setHigh(h:number){
        this.high = h;
    }
    setLow(l:number){
        this.low = l;
    }

    applyStyle(boxes: BoxMap): void {
        var spacerTree = new SpacerTree();
        var nodeMap = spacerTree.build(this.createMap(boxes), boxes.getRoot());
        var node = spacerTree.node;

        this.high = spacerTree.lowest;
        this.low = spacerTree.highest;

        for (var key in nodeMap) {
            if (nodeMap.hasOwnProperty(key)) {
                var box: IBox = boxes.getId(key);
                if(isNaN(nodeMap[key].y)) {
                    nodeMap[key].y = 0;
                }
                box.setY(nodeMap[key].y - spacerTree.lowest);
            }
        }

    }
    private createMap(boxes: BoxMap): any {
        var rootId: string = boxes.getRoot();
        var map = [];
        map[rootId] = {};

        var queue: string[] = [];
        queue.push(rootId);

        while(queue.length > 0) {
            var box:IBox = boxes.getId(queue.shift());
            var node:INode = box.getNode();
            var branchIds = node.getBranchIds();

            var id = node.getId();
            map[id]['x'] = box.getX();
            map[id]['width'] = box.getWidth();
            map[id]['height'] = box.getHeight();
            map[id]['id'] = node.getId();
            map[id]['children'] = [];

            if(box.isCollapsed()) {
                continue;
            }

            for(var i:number=0; i<branchIds.length; i++) {
                var branchBox:IBox = boxes.getId(branchIds[i]);

                if(!branchBox) {
                    continue;
                }

                var child = {};
                map[branchIds[i]] = child;
                map[node.getId()].children.push(child);
                queue.push(branchIds[i]);
            }
        }
        return map;
    }
}