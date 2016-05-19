///<reference path="IPipeline.ts"/>
///<reference path="ColorSpacers/IColorStyler.ts"/>
///<reference path="NullSpacer.ts"/>
///<reference path="ColorSpacers/IChartColorStyler.ts"/>
///<reference path="CollapseSpacer.ts"/>
///<reference path="SpacingSpacer.ts"/>
///<reference path="ChartSpacers/IChartStyler.ts"/>
///<reference path="ChartSpacers/CustomSpacer.ts"/>

///<reference path="ColorSpacers/AscColorSpacer.ts"/>
///<reference path="ColorSpacers/AscBlackoutColorSpacer.ts"/>
///<reference path="ColorSpacers/AscBoldColorSpacer.ts"/>
///<reference path="ColorSpacers/AscGreyscaleColorSpacer.ts"/>
///<reference path="ColorSpacers/CustomColorSpacer.ts"/>
///<reference path="ColorSpacers/CustomTextColorSpacer.ts"/>
///<reference path="ColorSpacers/ColorSpacer.ts"/>
///<reference path="ColorSpacers/GenColorSpacer.ts"/>
///<reference path="ColorSpacers/GenColorVibrantSpacer.ts"/>
///<reference path="ColorSpacers/GenWoodColorSpacer.ts"/>
///<reference path="ColorSpacers/GenderColorSpacer.ts"/>
///<reference path="ColorSpacers/GreyScaleSpacer.ts"/>

///<reference path="ChartStyles/FamilyReunionChartStyler.ts"/>
///<reference path="ChartStyles/EightElevenChartStyler.ts"/>
///<reference path="ChartStyles/EightElevenDetailChartStyler.ts"/>
///<reference path="ChartStyles/FamilyReunionDescChartStyler.ts"/>
///<reference path="ChartStyles/DetailChartStyler.ts"/>
///<reference path="ChartStyles/VertDescDetChartStyler.ts"/>
///<reference path="ChartStyles/VertDetChartStyler.ts"/>
///<reference path="ChartStyles/VertDetAccentChartStyler.ts"/>
///<reference path="ChartStyles/BubbleChartStyler.ts"/>
///<reference path="ChartStyles/VariableDepthChartStyler.ts"/>
///<reference path="ChartStyles/ElevenSeventeenChartStyler.ts"/>
///<reference path="ChartStyles/ExtendedChartStyler.ts"/>

///<reference path="YSpacer"/>
/**
 * Created by calvinmcm on 2/23/16.
 */

class StylingPipeline implements IPipeline {

    private collapseSpacer:CollapseSpacer;
    private spacingSpacer:SpacingSpacer;
    private chartStyleSpacer:AbstractChartStyle;
    private customChartStyleSpacer:CustomSpacer;
    private chartColorStyleSpacer:AbstractStyler;
    private customColorSpacer:CustomColorSpacer;
    private customTextColorSpacer:CustomTextColorSpacer;
    private ySpacer:YSpacer;

    private addedSpacers:AbstractStyler[];
    private resetAll :boolean = false;

    constructor() {
        this.clearPipeline();
    }

    public deserialize(pipeline):void {
        this.collapseSpacer.setCustomMap(pipeline.collapseSpacer.customMap);
        //no data in spacingSpacer to deserialize
        this.chartStyleSpacer = this.getChartStylerByName(pipeline.chartStyleSpacer);
        this.customChartStyleSpacer.setCustomMap(pipeline.customChartStyleSpacer.customMap);
        this.chartColorStyleSpacer = this.getStylerByName(pipeline.chartColorStyleSpacer);
        this.customColorSpacer.setCustomMap(pipeline.customColorSpacer.customMap);
        this.customTextColorSpacer.setCustomMap(pipeline.customTextColorSpacer.customMap);
        this.ySpacer.setHigh(pipeline.ySpacer.high);
        this.ySpacer.setLow(pipeline.ySpacer.low);
        this.addedSpacers = [];
        for(var spacer in pipeline.addedSpacers){
            this.addedSpacers.push(this.getStylerByName(spacer));
        }
    }

    getStylerByName(spacer:any):AbstractStyler{
        switch(spacer.className){
            case("AscColorSpacer"):
                return new AscColorSpacer();
            case("AscBlackoutColorSpacer"):
                return new AscBlackoutColorSpacer();
            case("AscBoldColorSpacer"):
                return new AscBoldColorSpacer();
            case("AscGreyscaleColorSpacer"):
                return new AscGreyscaleColorSpacer();
            case("ColorSpacer"):
                return new ColorSpacer();
            case("GenColorSpacer"):
                return new GenColorSpacer();
            case("GenColorVibrantSpacer"):
                return new GenColorVibrantSpacer();
            case("GenWoodColorSpacer"):
                return new GenWoodColorSpacer();
            case("GenderColorSpacer"):
                return new GenderColorSpacer();
            case("GreyScaleSpacer"):
                return new GreyScaleSpacer();
            default:
                console.log("Cannot load style [" + spacer.className + "]");
        }
    }

    getChartStylerByName(spacer: any): AbstractChartStyle{
        switch(spacer){
            case("BubbleChartStyler"):
                return new BubbleChartStyler();
            case("ElevenSeventeenChartSStyler"):
                return new ElevenSeventeenChartStyler();
            case("ExtendedChartSStyler"):
                return new ExtendedChartStyler();
            case("VariableDepthChartSStyler"):
                return new VariableDepthChartStyler();
            case("DetailChartSStyler"):
                return new DetailChartStyler();
            case("EightElevenDetailSStyler"):
                return new EightElevenDetailChartStyler();
            case("EightElevenSStyler"):
                return new EightElevenChartStyler();
            case("FamilyReunionChartSStyler"):
                return new FamilyReunionChartStyler();
            case("FamilyReunionDescPublicSStyler"):
                return new FamilyReunionDescChartStyler();
            case("VertDescDetChartSStyler"):
                return new VertDescDetChartStyler();
            case("VertDetChartStyler"):
                return new VertDetChartStyler();
            case("VertDetAccentChartStyler"):
                return new VertDetAccentChartStyler();
            default:
                console.log("Cannot load style [" + spacer.className + "]");
        }
    }

    public add(element:AbstractStyler):void {
        this.addedSpacers.push(element);
    }

    public runPipeline(boxes:BoxMap):void {
        // Apply Chart Spacing Styles

        var map = boxes.getMap();
        for(var key in map){
            map[key].setCollapsed(false);
        }
        this.customChartStyleSpacer.applyStyle(boxes);
        this.collapseSpacer.applyStyle(boxes);
        this.chartStyleSpacer.applyStyle(boxes);
        this.spacingSpacer.applyStyle(boxes);

        // Apply Chart Color Styles
        this.chartColorStyleSpacer.applyStyle(boxes);
        this.customColorSpacer.applyStyle(boxes);
        this.customTextColorSpacer.applyStyle(boxes);
        this.ySpacer.applyStyle(boxes);

        // Apply Additional Styles
        for (var spacer of this.addedSpacers) {
            spacer.applyStyle(boxes);
        }
    }

    public clearPipeline() {
        this.collapseSpacer = new CollapseSpacer();
        this.spacingSpacer = new SpacingSpacer();
        this.chartStyleSpacer = new NullSpacer();
        this.customChartStyleSpacer = new CustomSpacer();
        this.chartColorStyleSpacer = new NullSpacer();
        this.customColorSpacer = new CustomColorSpacer();
        this.customTextColorSpacer = new CustomTextColorSpacer();
        this.ySpacer = new YSpacer();
        this.addedSpacers = [];
    }

    addCustomSpacerStyle(id:string, data:{}){
        this.customChartStyleSpacer.addCustomStyle(id,data);
    }

    addCustomColorStyle(id:string, data:{}){
        this.customColorSpacer.addCustomStyle(id,data);
    }

    addCustomTextColorStyle(id:string, data:{}){
        this.customTextColorSpacer.addCustomStyle(id,data);
    }

    collapseId(id:string, collapse:boolean){
        this.collapseSpacer.collapseId(id, collapse);
    }

    setChartStyleSpacer(spacer:AbstractChartStyle):void {
        this.resetAll = true;
        this.chartStyleSpacer = spacer;
    }

    setReset(value :boolean) :void{
        this.resetAll = value;
    }

    clearReset() :void{
        this.resetAll = false;
    }

    clearCustomChartStyle(){
        this.customChartStyleSpacer.clear();
    }

    clearColorStyle(){
        this.customColorSpacer.clear();
    }

    clearTextColorStyle(){
        this.customTextColorSpacer.clear();
    }

    resetYSpacer(){
        this.ySpacer = new YSpacer();
    }

    setChartColorStyleSpacer(spacer:AbstractStyler):void {
        this.chartColorStyleSpacer = spacer;
    }
}