///<reference path="../AbstractChartStyle.ts"/>
///<reference path="IChartStyler.ts"/>
/**
 * Created by curtis on 3/9/15.
 * Last updated 5/17/2016.
 */

class CustomSpacer extends AbstractChartStyle {

    private customMap: {[s:string]: {}};

    constructor() {
        super("CustomSpacer");
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
                        if(box.getType() != StyleManager.NULL) {
                            //console.log(box.getNode().getSpouses().length + " " + map['type']);
                            if (box.getNode().getSpouses().length == 0 && map['type'] == StyleManager.ENORMOUS) {
                                //console.log("Fixed!!");
                                box.setType(StyleManager.MEDIUM);
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
    clear(): void{
        this.customMap = {};
    }

    protected setBasedOnGeneration(box:IBox, branchBox:IBox, generation: number) :void {}
}