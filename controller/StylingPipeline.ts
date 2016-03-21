///<reference path="IPipeline.ts"/>
///<reference path="ColorSpacers/IColorStyler.ts"/>
///<reference path="NullSpacer.ts"/>
///<reference path="ColorSpacers/IChartColorStyler.ts"/>
///<reference path="CollapseSpacer.ts"/>
///<reference path="SpacingSpacer.ts"/>
///<reference path="ChartSpacers/IChartStyler.ts"/>
///<reference path="ChartSpacers/CustomSpacer.ts"/>
///<reference path="ColorSpacers/ColorSpacer.ts"/>
///<reference path="ColorSpacers/GenColorSpacer.ts"/>
///<reference path="ColorSpacers/GenColorVibrantSpacer.ts"/>
///<reference path="ColorSpacers/GenderColorSpacer.ts"/>
///<reference path="ColorSpacers/GreyScaleSpacer.ts"/>
///<reference path="ChartSpacers/DetailChartSpacer.ts"/>
///<reference path="ChartSpacers/EightElevenDetailSpacer.ts"/>
///<reference path="ChartSpacers/EightElevenSpacer.ts"/>
///<reference path="ChartSpacers/FamilyReunionChartSpacer.ts"/>
///<reference path="ChartSpacers/FamilyReunionDescPublicSpacer.ts"/>
///<reference path="ChartSpacers/VertDescDetChartSpacer.ts"/>
///<reference path="ChartSpacers/VertDetChartSpacer.ts"/>
///<reference path="ColorSpacers/AscColorSpacer.ts"/>
///<reference path="ColorSpacers/CustomColorSpacer.ts"/>
///<reference path="ColorSpacers/CustomTextColorSpacer.ts"/>
///<reference path="YSpacer"/>
/**
 * Created by calvinmcm on 2/23/16.
 */

class StylingPipeline implements IPipeline {

    private collapseSpacer:CollapseSpacer;
    private spacingSpacer:SpacingSpacer;
    private chartStyleSpacer:AbstractStyler;
    private customChartStyleSpacer:CustomSpacer;
    private chartColorStyleSpacer:AbstractStyler;
    private customColorSpacer:CustomColorSpacer;
    private customTextColorSpacer:CustomTextColorSpacer;
    private ySpacer:YSpacer;

    private addedSpacers:AbstractStyler[];

    constructor() {
        this.clearPipeline();
    }

    public deserialize(pipeline):void {
        this.collapseSpacer.setCustomMap(pipeline.collapseSpacer.customMap);
        //no data in spacingSpacer to deserialize
        this.chartStyleSpacer = this.getStylerByName(pipeline.chartStyleSpacer);
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
            case("ColorSpacer"):
                return new ColorSpacer();
            case("GenColorSpacer"):
                return new GenColorSpacer();
            case("GenColorVibrantSpacer"):
                return new GenColorVibrantSpacer();
            case("GenderColorSpacer"):
                return new GenderColorSpacer();
            case("GreyScaleSpacer"):
                return new GreyScaleSpacer();
            //~~~END COLOR ::: START STYLE~~~
            case("DetailChartSpacer"):
                return new DetailChartSpacer();
            case("EightElevenDetailSpacer"):
                return new EightElevenDetailSpacer();
            case("EightElevenSpacer"):
                return new EightElevenSpacer();
            case("FamilyReunionChartSpacer"):
                return new FamilyReunionChartSpacer();
            case("FamilyReunionDescPublicSpacer"):
                return new FamilyReunionDescPublicSpacer();
            case("VertDescDetChartSpacer"):
                return new VertDescDetChartSpacer();
            case("VertDetChartSpacer"):
                return new VertDetChartSpacer();
        }
    }

    public add(element:AbstractStyler):void {
        this.addedSpacers.push(element);
    }

    public runPipeline(boxes:BoxMap):void {
        // Apply Chart Spacing Styles
        this.collapseSpacer.applyStyle(boxes);
        this.spacingSpacer.applyStyle(boxes);
        this.chartStyleSpacer.applyStyle(boxes);
        this.customChartStyleSpacer.applyStyle(boxes);

        // Apply Chart Color Styles
        this.chartColorStyleSpacer.applyStyle(boxes);
        this.customColorSpacer.applyStyle(boxes);
        this.customTextColorSpacer.applyStyle(boxes);
        this.ySpacer.applyStyle(boxes);

        // Apply Additional Styles
        for (var spacer in this.addedSpacers) {
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

    setChartStyleSpacer(spacer:AbstractStyler):void {
        this.chartStyleSpacer = spacer;
    }

    clearChartStyle(){
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