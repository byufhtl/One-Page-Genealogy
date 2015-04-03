///<reference path="ITree.ts"/>
/**
 * Created by curtis on 3/7/15.
 */
interface ITreeListener {
    handleUpdate(tree: ITree, updates: ICommand[]): void;
}