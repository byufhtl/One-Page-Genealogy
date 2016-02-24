///<reference path="IChartStyler.ts"/>
// /<reference path="../IStyler.ts"/>
/**
 * Created by curtis on 3/9/15.
 * Last updated 2/24/2016.
 */

class CustomSpacer implements  IChartStyler {
    getName() : string {
        return "CustomSpacer";
    }

    private customMap: {[s:string]: {}};

    constructor() {
        this.customMap = {};
    }
    setCustomMap(map:{[s:string]: boolean}){
        this.customMap = map;
    }
    applyStyle(boxes: BoxMap): void {
        for (var key in this.customMap) {
            if (this.customMap.hasOwnProperty(key)) {
                var box: IBox = boxes.getId(key);

                if(box) {
                    var map = this.customMap[key];

                    if(map.hasOwnProperty('x')) {
                        box.setX(map['x']);
                    }
                    if(map.hasOwnProperty('y')) {
                        box.setY(map['y']);
                    }
                    if(map.hasOwnProperty('type')) {
                        if(box.getType() != 'nullBox') {
                            //console.log(box.getNode().getSpouses().length + " " + map['type']);
                            if (box.getNode().getSpouses().length == 0 && map['type'] == "JSLrgDetRotSpPubBox") {
                                //console.log("Fixed!!");
                                box.setType("JSMedDetPubBox");
                            }
                            else{
                                box.setType(map['type']);
                            }
                        }
                    }
                    else{
                        box.setType(box.getType());
                    }
                }
            }
        }
    }
    addCustomStyle(id: string, customStyle: {}) {
        this.customMap[id] = customStyle;
    }
    clear(): CustomSpacer{
        this.customMap = {};
        return this;
    }
}