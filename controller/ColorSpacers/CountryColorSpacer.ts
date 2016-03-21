///<reference path="../AbstractStyler.ts"/>



/**
 * Created by jared on 3/21/16.
 */

declare var CountryHash;

class CountryColorSpacer extends AbstractStyler {

    constructor() {
        super("CountryColorSpacer");
    }

    //does not need to be serialized
    private colorMap = {
        "" : ColorManager.gray()
    };

    applyStyle(boxes:BoxMap):void {
        for(var box in boxes.getMap()){
            if(boxes.getMap().hasOwnProperty(box)) {
                this.colorNode(boxes.getMap()[box]);
            }
        }
        console.log(this.colorMap);
    }

    private colorNode(box:IBox):void{
        var country  = box.getNode().getAttr('birthplace') || box.getNode().getAttr('deathplace') || "";
        country = country.substr(country.lastIndexOf(",")+1).trim().toLowerCase().replace(/[^ a-z]/g, '').replace(/\s\s+/g, ' ');
        country = CountryHash.hasOwnProperty(country) ? CountryHash[country] : country;
        if(this.colorMap.hasOwnProperty(country)){
            box.setColor(this.colorMap[country]);
        }else{
            this.colorMap[country] = ColorManager.generateRandomPastel();
            box.setColor(this.colorMap[country]);
        }
    }
}