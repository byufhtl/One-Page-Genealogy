///<reference path="AbstractChartStyle.ts"/>
///<reference path="../view/BoxStyleFactory.ts"/>
///<reference path="ColorSpacers/IColorStyler.ts"/>
/**
 * Created by calvinmcm on 2/23/16.
 */
class NullSpacer extends AbstractChartStyle{

    constructor(){
        super("nullSpacer");
    }

    applyStyle(boxes: BoxMap): void {}

    setBasedOnGeneration(box:IBox, branchBox:IBox, generation: number) :void {}
}