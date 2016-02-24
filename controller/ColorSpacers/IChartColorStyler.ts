///<reference path="IColorStyler.ts"/>
/**
 * Created by calvinmcm on 2/18/16.
 */

interface IChartColorStyler extends IColorStyler{
    applyStyle(boxes: BoxMap): void;
}