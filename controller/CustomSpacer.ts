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
                        if(box.getType() != 'nullBox') {
                            //console.log(box.getNode().getSpouses().length + " " + map['type']);
                            if (box.getNode().getSpouses().length == 0 && map['type'] == "JSLrgDetRotSpPubBox") {
                                console.log("Fixed!!");
                                box.setType("JSMedDetPubBox");
                            }
                            else{
                                box.setType(map['type']);
                            }
                        }
                    }
                    if(map.hasOwnProperty('color')) {
                        box.setColor(map['color']);
                    }
                    if(map.hasOwnProperty('textcolor')){
                        box.setTextColor(map['textcolor']);
                        console.log("text color found: " + map['textcolor'] + " (Box: " + map['color'] + ")");
                    }
                    else{
                        box.setTextColor('#000000');
                        console.log("no text color");
                    }
                }
            }
        }
    }
    addCustomStyle(id: string, customStyle: {}) {
        this.customMap[id] = customStyle;
    }
}