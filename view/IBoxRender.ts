///<reference path="../model/IBox.ts"/>
/**
 * Created by curtis on 3/10/15.
 */
interface IBoxRender {
    render(box:IBox, rootElement): any;
    move(box:IBox, graphic: any, rootElement): any;
    getType(): string;
    getHeight(): number;
    getWidth(): number;

    requiresLoad(): boolean;
}