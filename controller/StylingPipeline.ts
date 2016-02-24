///<reference path="IPipeline.ts"/>
///<reference path="ColorSpacers/IColorStyler.ts"/>
///<reference path="NullSpacer.ts"/>
///<reference path="ColorSpacers/IChartColorStyler.ts"/>
///<reference path="CollapseSpacer.ts"/>
///<reference path="SpacingSpacer.ts"/>
///<reference path="ChartSpacers/IChartStyler.ts"/>
///<reference path="ChartSpacers/CustomSpacer.ts"/>
///<reference path="YSpacer"/>
/**
 * Created by calvinmcm on 2/23/16.
 */

class StylingPipeline implements IPipeline{

    private collapseSpacer : CollapseSpacer;
    private spacingSpacer : SpacingSpacer;
    private chartStyleSpacer : IChartStyler;
    private customChartStyleSpacer : IChartStyler;
    private chartColorStyleSpacer : IChartColorStyler;
    private customColorSpacer : IColorStyler;
    private customTextColorSpacer : IColorStyler;
    private ySpacer : YSpacer;

    private addedSpacers : IStyler[];

    constructor(){
        this.clearPipeline();
    }

    setCollapseSpacer(spacer:CollapseSpacer) :void{
        this.collapseSpacer = spacer;
    }

    setSpacingSpacer(spacer:SpacingSpacer) :void{
        this.spacingSpacer = spacer;
    }

    setChartStyleSpacer(spacer:IChartStyler) :void{
        this.chartStyleSpacer = spacer;
    }

    setCustomChartStyleSpacer(spacer:IChartStyler) :void{
        this.customChartStyleSpacer = spacer;
    }

    setChartColorStyleSpacer(spacer:IChartColorStyler) :void{
        this.chartColorStyleSpacer = spacer;
    }

    setCustomColorSpacer(spacer:IColorStyler) :void{
        this.customColorSpacer = spacer;
    }

    setCustomTextColorSpacer(spacer:IColorStyler) :void{
        this.customTextColorSpacer = spacer;
    }

    setYSpacer(spacer:YSpacer) :void{
        this.ySpacer = spacer;
    }

    public add(element:IColorStyler) :void{
        this.addedSpacers.push(element);
    }

    public runPipeline(boxes:BoxMap) :void{
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
        for(var spacer in this.addedSpacers){
            spacer.applyStyle(boxes);
        }
    }

    public clearPipeline(){
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