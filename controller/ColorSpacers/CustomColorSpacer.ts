///<reference path="../AbstractStyler.ts"/>
/**
 * Created by curtis on 3/9/15.
 * Last updated 2/18/16.
 */
class CustomColorSpacer extends AbstractStyler {

    private customMap: {[s:string]: {}};

    constructor() {
        this.customMap = {};
        super("CustomColorSpacer");
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
                    if(map.hasOwnProperty('color')) {
                        box.setColor(map['color']);
                    }
                }
            }
        }
    }
    addCustomStyle(id: string, customStyle: {}) {
        this.customMap[id] = customStyle;
    }
    clear(): CustomColorSpacer{
        this.customMap = {};
        return this;
    }
}