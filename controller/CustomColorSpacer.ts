///<reference path="IStyler.ts"/>
/**
 * Created by curtis on 3/9/15.
 */
class CustomColorSpacer implements  IStyler {

    private customMap: {[s:string]: {}};

    constructor() {
        this.customMap = {};
    }
    applyStyle(boxes: BoxMap): void {
        for (var key in this.customMap) {
            if (this.customMap.hasOwnProperty(key)) {
                var box: IBox = boxes.getId(key);

                if(box) {
                    console.log("Current type:  " + box.getType());
                    console.log("Current color: " + box.getColor());
                    var map = this.customMap[key];

                    if(map.hasOwnProperty('x')) {
                        box.setX(map['x']);
                    }
                    if(map.hasOwnProperty('y')) {
                        box.setY(map['y']);
                    }
                    if(map.hasOwnProperty('color')) {
                        box.setColor(map['color']);
                        console.log("Setting box color to: " + map['color']);
                    }
                    if(map.hasOwnProperty('textcolor')){
                        box.setTextColor(map['textcolor']);
                        console.log("Setting text color to: " + map['textcolor']);
                    }
                }
            }
        }
    }
    addCustomStyle(id: string, customStyle: {}) {
        this.customMap[id] = customStyle;
    }
}