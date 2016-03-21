///<reference path="AbstractStyler.ts"/>
///<reference path="../view/BoxStyleFactory.ts"/>
///<reference path="ColorSpacers/IColorStyler.ts"/>
/**
 * Created by calvinmcm on 2/23/16.
 */
class NullSpacer extends AbstractStyler{

    constructor(){
        super("nullSpacer");
    }

    applyStyle(boxes: BoxMap): void {}

}