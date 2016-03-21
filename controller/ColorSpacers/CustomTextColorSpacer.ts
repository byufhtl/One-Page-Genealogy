///<reference path="../AbstractStyler.ts"/>
/**
 * Created by curtis on 3/9/15.
 * Last updated 2/18/16.
 */
class CustomTextColorSpacer extends AbstractStyler {

    private customMap: {[s:string]: {}};

    constructor() {
        this.customMap = {};
        super("CustomTextColorSpacer");
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
                    if(map.hasOwnProperty('textcolor')){
                        box.setTextColor(map['textcolor']);
                    }
                }
            }
        }
    }
    addCustomStyle(id: string, customStyle: {}) {
        this.customMap[id] = customStyle;
    }
    clear(): void{
        for(var id in this.customMap){
            if(this.customMap[id].hasOwnProperty("textcolor")){
                this.customMap[id]["textcolor"] = "#000000";
            }
        }
    }
}