///<reference path="IBoxTreeListener.ts"/>
///<reference path="ISpacerTreeListener.ts"/>
/**
 * Created by curtis on 3/7/15.
 */
interface ISpacerTree {
    getBoxTreeListener(): IBoxTreeListener;
    getBoxes(): IBox[];
    setListener(listener: ISpacerTreeListener): void;
}
