///<reference path="../IStyler.ts"/>
/**
 * Created by calvinmcm on 2/18/16.
 */

interface IChartStyler extends IStyler{
    applyStyle(boxes: BoxMap): void;
}