///<reference path="../AbstractStyler.ts"/>



/**
 * Created by jared on 3/21/16.
 */

class CountryColorSpacer extends AbstractStyler {

    constructor(colorMap:{}) {
        super("CountryColorSpacer");
        this.colorMap = colorMap;
    }

    private colorMap = {};

    applyStyle(boxes:BoxMap):void {
        for(var box in boxes.getMap()){
            if(boxes.getMap().hasOwnProperty(box)) {
                this.colorNode(boxes.getMap()[box]);
            }
        }
    }

    private getCountry(country:string) :string {
        if(CountryHash.hasOwnProperty(country)){
            return this.toTitleCase(CountryHash[country]);
        }
        var wordsInCountry = country.split(" ");
        for(var i in wordsInCountry){
            if(CountryList.indexOf(wordsInCountry[i]) > -1){
                return this.toTitleCase(CountryList[CountryList.indexOf(wordsInCountry[i])]);
            }
        }
        return "Unknown";
    }

    private colorNode(box:IBox):void{
        var country  = box.getNode().getAttr('birthplace') || box.getNode().getAttr('deathplace') || "Unknown";
        country = country.substr(country.lastIndexOf(",")+1).trim().toLowerCase().replace(/[^ a-z]/g, '').replace(/\s\s+/g, ' ');
        //country = CountryHash.hasOwnProperty(country) ? this.toTitleCase(CountryHash[country]) : this.toTitleCase(country);
        country = this.getCountry(country);
        if(this.colorMap.hasOwnProperty(country)){
            box.setColor(this.colorMap[country]);
        }else{
            console.log("ERROR: Country not in colorMap");
            box.setColor(this.colorMap["Unknown"]);
        }
    }

    private toTitleCase(str:string){
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

    public setColorMap(map:{}): void{
        this.colorMap = map;
    }

    public getColorMap():{}{
        return this.colorMap
    }
}