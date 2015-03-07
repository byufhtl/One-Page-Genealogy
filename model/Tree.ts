///<reference path="ITree.ts"/>
/**
 * Created by curtis on 3/7/15.
 */
class Tree implements ITree {
    private sourceListener: ISourceListener;
    private treeMap: {[s: string]: INode};
    private started: boolean;
    private root: INode;
    private treeListener: ITreeListener;

    constructor() {
        var self = this;
        this.started = false;
        this.root = null;
        this.sourceListener = {
            gotNode(node: INode): void {
                if(!self.started) {
                    self.started = true;
                    self.root = node;
                }
                if(self.treeMap.hasOwnProperty(node.getId())){
                    throw new Error("Repeat Key, should always receive unique keys.")
                }
                self.treeMap[node.getId()] = node;
            },
            done(): void {

            }
        }
    }
    getSourceListener(): ISourceListener {
        return this.sourceListener;
    }
    getId(id: string): INode {
        var node = this.treeMap[id];
        if(node){
            return node;
        }
        return null;
    }
    getRoot(): INode {
        return this.root;
    }
    setListener(listener: ITreeListener): void {
        this.treeListener = listener;
    }
}