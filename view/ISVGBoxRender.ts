///<reference path="../model/IBox.ts"/>
/**
 * Created by curtis on 3/10/15.
 */
interface ISVGBoxRender {
    render(box:IBox): any;
    getType(): string;
}