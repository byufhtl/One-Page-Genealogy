///<reference path="IStyler.ts"/>
///<reference path="../view/BoxStyleFactory.ts"/>
///<reference path="ColorSpacers/IColorStyler.ts"/>
/**
 * Created by calvinmcm on 2/23/16.
 */
class NullSpacer implements  IColorStyler, IStyler{
    applyStyle(boxes: BoxMap): void {}

    getName(): string{return "nullSpacer"}
}