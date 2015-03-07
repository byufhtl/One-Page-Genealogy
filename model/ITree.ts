///<reference path="../ISourceListener.ts"/>
///<reference path="ITreeListener.ts"/>
///<reference path="../controller/BoxMap.ts"/>
/**
 * Created by curtis on 3/7/15.
 */


interface ITree {
    getSourceListener(): ISourceListener;  // The tree listens for changes in the source.
    getId(id: string): INode;
    getRoot(): INode;
    setListener(listener: ITreeListener): void;  // The tree fires this when it is changed.
    asBoxMap(): BoxMap;  // Converts itself to a box map.
}