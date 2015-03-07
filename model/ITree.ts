///<reference path="../ISourceListener.ts"/>
///<reference path="ITreeListener.ts"/>
/**
 * Created by curtis on 3/7/15.
 */


interface ITree {
    getSourceListener(): ISourceListener;
    getId(id: string): INode;
    getRoot(): INode;
    setListener(listener: ITreeListener): void;
}