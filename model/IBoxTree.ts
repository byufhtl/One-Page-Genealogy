///<reference path="IBox.ts"/>
///<reference path="IBoxTreeListener.ts"/>
///<reference path="ITreeListener.ts"/>
/**
 * Created by krr428 on 3/7/15.
 */

interface IBoxTree {
    getTreeListener(): ITreeListener
    getBoxes(): IBox[]
    setBoxTreeListener(handler: IBoxTreeListener)
}
