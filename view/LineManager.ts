///<reference path="../controller/BoxMap.ts"/>
/**
 * Created by curtis on 4/28/15.
 */
class LineManager {
    private d: string;
    private bounds: {x:number; y:number; w:number; h:number};
    private ignoreBounds: boolean;

    constructor() {
        this.d = "";
        this.bounds = {x:0, y:0, w:0, h:0};
        this.ignoreBounds = false;
    }
    requestLineString(boxes: BoxMap): string {
        this.d = "";
        var rootId: string = boxes.getRoot();
        var queue: string[] = [];
        queue.push(rootId);
        while(queue.length > 0) {
            var box:IBox = boxes.getId(queue.shift());
            var node:INode = box.getNode();
            var branchIds = node.getBranchIds();

            var cx = box.getX() + box.getWidth()/2;
            var cy = box.getY() + box.getHeight()/2;

            if(box.isCollapsed()) {
                continue;
            }

            var branchIdsTmp = [];
            for(var i=0; i<branchIds.length; i++) {
                var branchBox:IBox = boxes.getId(branchIds[i]);
                if (!branchBox) {
                    continue;
                }
                branchIdsTmp.push(branchIds[i]);
            }
            branchIds = branchIdsTmp;

            if(branchIds.length < 1) {
                continue;
            }
            else {
                var firstBox = boxes.getId(branchIds[0]);
                var lastBox = boxes.getId(branchIds[branchIds.length - 1]);

                if(this.shouldDrawLine(box, firstBox, lastBox)) {
                    var first = this.toCenterPoint(boxes.getId(branchIds[0]));
                    var last = this.toCenterPoint(boxes.getId(branchIds[branchIds.length - 1]));
                    if(firstBox.getNode().getId() == lastBox.getNode().getId())
                        last = this.toCenterPoint(box);
                    //var middleX = (first.getX() + cx)/2;
                    var firstBox: IBox= boxes.getId(branchIds[0]);
                    var middleX = first.getX()-firstBox.getWidth()/2 - 5;

                    this.d += "M " + cx + " " + cy + " ";
                    this.d += "L " + middleX + " " + cy + " ";

                    for(var j=1; j<branchIds.length-1; j++) {
                        var child = this.toCenterPoint(boxes.getId(branchIds[j]));
                        this.d += "M " + child.getX() + " " + child.getY() + " ";
                        this.d += "L " + middleX + " "+child.getY()+" ";
                    }

                    this.d += "M " + first.getX() + " "+ first.getY() +" ";
                    this.d += "L " + (middleX) + " " + (first.getY()) + " ";

                    this.d += "L " + middleX + " " + first.getY() + " ";
                    this.d += "L " + middleX + " " + last.getY() + " ";

                    this.d += "L " + (middleX) + " " + (last.getY()) + " ";
                    this.d += "L " + last.getX() + " "+ last.getY() +" ";
                }
            }

            for (var i:number = 0; i < branchIds.length; i++) {
                var branchBox:IBox = boxes.getId(branchIds[i]);
                if (!branchBox) {
                    continue;
                }
                queue.push(branchIds[i]);
            }
        }
        return this.d;
    }

    private toCenterPoint(box:IBox):any {
        return {
            getX: function() {
                return box.getX() + box.getWidth()/2;
            },
            getY: function() {
                return box.getY() + box.getHeight()/2;
            }
        }
    }

    setBounds(x: number, y: number, w: number, h: number): void {
        this.bounds = {x: x, y:y, w:w, h:h};
    }

    private shouldDrawLine(parent: IBox, firstChild: IBox, lastChild: IBox): boolean {
        var parentResult = this.testBounds(parent);
        var firstResult = this.testBounds(firstChild);
        var lastResult = this.testBounds(lastChild);

        //var result:boolean = this.allFailSameTest([parentResult, firstResult, lastResult]);
        var result: boolean = this.failedSameTest(parentResult, firstResult, lastResult);

        return !result;
    }

    //private allFailSameTest(dictionaries):boolean {
    //    var masterDictionary = {};
    //    for(var i=0; i<dictionaries.length; i++) {
    //        var dictionary = dictionaries[i];
    //        for (var key in dictionary) {
    //            if (dictionary.hasOwnProperty(key)) {
    //                if(dictionary[key]) {
    //                    if(!masterDictionary[key]) {
    //                        masterDictionary[key] = 0;
    //                    }
    //                    masterDictionary[key] += 1;
    //                    if(masterDictionary[key] === dictionaries.length) {
    //                        return true;
    //                    }
    //                }
    //            }
    //        }
    //    }
    //    return false;
    //}

    private failedSameTest(parentResult, firstResult, lastResult) {
        if(parentResult['top'] && firstResult['top'] && lastResult['top']) {
            return true;
        }
        if(parentResult['bottom'] && firstResult['bottom'] && lastResult['bottom']) {
            return true;
        }
        if(parentResult['left'] && firstResult['left'] && lastResult['left']) {
            return true;
        }
        if(parentResult['right'] && firstResult['right'] && lastResult['right']) {
            return true;
        }
        return false;
    }

    setIgnoreBound(ignore: boolean): void {
        this.ignoreBounds = ignore;
    }

    private testBounds(box: IBox): any {
        if(this.ignoreBounds) {
            return {};
        }

        var id = box.getNode().getId();

        var failedTest = {};
        var b = this.bounds;

        var minx: number = Math.min(b.x, b.w);
        var maxx: number = Math.max(b.x, b.w);

        var miny: number = Math.min(b.y, b.h);
        var maxy: number = Math.max(b.y, b.h);

        if(box.getX() > maxx) {
            failedTest['bottom'] = true;
        }
        if(box.getX() + box.getWidth() < minx){
            failedTest['top'] = true;
        }
        if(box.getY() > maxy) {
            failedTest['right'] = true;
        }
        if(box.getY() + box.getHeight() < miny) {
            failedTest['left'] = true;
        }

        return failedTest;
    }
}