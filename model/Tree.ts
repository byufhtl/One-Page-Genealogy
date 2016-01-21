///<reference path="ITree.ts"/>
///<reference path="../controller/BoxMap.ts"/>
///<reference path="Box.ts"/>
///<reference path="ICommand.ts"/>
///<reference path="Command.ts"/>
/**
 * Created by curtis on 3/7/15.
 */
class Tree implements ITree {
    private sourceListener: ISourceListener;
    private treeMap: {[s: string]: INode};
    private started: boolean;
    private root: INode;
    private treeListener: ITreeListener;

    private boxes: BoxMap;
    private updates: ICommand[];

    constructor() {

        this.boxes
        var self = this;
        this.started = false;
        this.root = null;
        this.treeMap = {};
        this.updates = [];
        this.sourceListener = {
            gotNode(node: INode): void {
                if(!self.started) {
                    self.started = true;
                    self.root = node;
                    self.boxes = new BoxMap(self.root.getId());
                }
                if(self.treeMap.hasOwnProperty(node.getId())){
                    throw new Error("Repeat Key, should always receive unique keys.")
                }


                self.treeMap[node.getId()] = node;
                self.boxes.setId(node.getId(), new Box(node));
                self.updates.push(new Command('add-node', node));

                //if(Object.keys(self.treeMap).length % 10 === 0) {
                //    self.treeListener.handleUpdate(self, self.updates);
                //    self.updates = [];
                //}

            },
            done(): void {
                self.treeListener.handleUpdate(self, self.updates);
                self.updates = [];
            }
        };
        this.treeListener = {
            handleUpdate(tree: ITree): void {
                console.log("Tree updated");
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
    asBoxMap(): BoxMap {

        for (var key in this.treeMap) {
            if (this.treeMap.hasOwnProperty(key)) {
                var node: INode = this.treeMap[key];
                this.boxes.getId(node.getId()).clear();
            }
        }
        return this.boxes;
    }
    getTreeMap(): {} {
        return this.treeMap;
    }
}