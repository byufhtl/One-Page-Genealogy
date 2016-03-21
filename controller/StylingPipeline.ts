///<reference path="IPipeline.ts"/>
///<reference path="ColorSpacers/IColorStyler.ts"/>
///<reference path="NullSpacer.ts"/>
///<reference path="ColorSpacers/IChartColorStyler.ts"/>
///<reference path="CollapseSpacer.ts"/>
///<reference path="SpacingSpacer.ts"/>
///<reference path="ChartSpacers/IChartStyler.ts"/>
///<reference path="ChartSpacers/CustomSpacer.ts"/>
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
    private customChartStyleSpacer:AbstractStyler;
    private chartColorStyleSpacer:AbstractStyler;
    private customColorSpacer:AbstractStyler;
    private customTextColorSpacer:AbstractStyler;
    private ySpacer:YSpacer;

    private addedSpacers:AbstractStyler[];

    constructor() {
        this.clearPipeline();
    }

    public deserialize(pipeline):void {
        this.collapseSpacer.setCustomMap(pipeline.collapseSpacer.customMap);
        //no data in spacingSpacer to deserialize
        this.chartStyleSpacer = this.getStylerByName(pipeline.chartStyleSpacer);
        this.customChartStyleSpacer = this.getStylerByName(pipeline.customChartStyleSpacer);
        this.chartColorStyleSpacer = this.getStylerByName(pipeline.chartColorStyleSpacer)
        this.customColorSpacer = this.getStylerByName(pipeline.customColorSpacer);
        this.customTextColorSpacer = this.getStylerByName(pipeline.customTextColorSpacer);
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
            case("CustomColorSpacer"):
                var customColorSpacer = new CustomColorSpacer();
                customColorSpacer.setCustomMap(spacer.customMap);
                return customColorSpacer;
            case("CustomSpacer"):
                var customSpacer = new CustomSpacer();
                customSpacer.setCustomMap(spacer.customMap);
                return customSpacer;
            case("CustomTextColorSpacer"):
                var customTextColorSpacer = new CustomTextColorSpacer();
                customTextColorSpacer.setCustomMap(spacer.customMap);
                return customTextColorSpacer;
            case("VertDetChartSpacer"):
                return new VertDetChartSpacer();
        }
    }

    setCollapseSpacer(spacer:CollapseSpacer):void {
        this.collapseSpacer = spacer;
    }

    setSpacingSpacer(spacer:SpacingSpacer):void {
        this.spacingSpacer = spacer;
    }

    setChartStyleSpacer(spacer:AbstractStyler):void {
        this.chartStyleSpacer = spacer;
    }

    setCustomChartStyleSpacer(spacer:AbstractStyler):void {
        this.customChartStyleSpacer = spacer;
    }

    setChartColorStyleSpacer(spacer:AbstractStyler):void {
        this.chartColorStyleSpacer = spacer;
    }

    setCustomColorSpacer(spacer:AbstractStyler):void {
        this.customColorSpacer = spacer;
    }

    setCustomTextColorSpacer(spacer:AbstractStyler):void {
        this.customTextColorSpacer = spacer;
    }

    setYSpacer(spacer:YSpacer):void {
        this.ySpacer = spacer;
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
        this.customChartStyleSpacer = new NullSpacer();
        this.chartColorStyleSpacer = new NullSpacer();
        this.customColorSpacer = new NullSpacer();
        this.customTextColorSpacer = new NullSpacer();
        this.ySpacer = new YSpacer();
        this.addedSpacers = [];
    }
}