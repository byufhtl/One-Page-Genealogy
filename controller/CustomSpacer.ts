///<reference path="IStyler.ts"/>
/**
 * Created by curtis on 3/9/15.
 */
class CustomSpacer implements  IStyler {

    private customMap: {[s:string]: {}};

    constructor() {
        this.customMap = {};
    }
    applyStyle(boxes: BoxMap): void {
        for (var key in this.customMap) {
            if (this.customMap.hasOwnProperty(key)) {
                var box: IBox = boxes.getId(key);

                if(box) {

                    var map = this.customMap[key];

                    //if(map.hasOwnProperty('height')) {
                    //    box.setHeight(map['height']);
                    //}
                    //if(map.hasOwnProperty('width')) {
                    //    box.setWidth(map['width']);
                    //}
                    if(map.hasOwnProperty('x')) {
                        box.setX(map['x']);
                    }
                    if(map.hasOwnProperty('y')) {
                        box.setY(map['y']);
                    }
                    if(map.hasOwnProperty('type')) {
                        box.setType(map['type']);
                    }
                    if(map.hasOwnProperty('color')) {
                        console.log("YOU FOUND ME!!");
                        box.setColor(map['color']);
                    }
                }
            }
        }
    }
    addCustomStyle(id: string, customStyle: {}) {
        this.customMap[id] = customStyle;
    }
}