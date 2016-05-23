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

    addCustomNode(node: INode, box: IBox){
        if(node) {
            console.log("Creating node in tree for " + node.getAttr('name'));
            this.treeMap[node.getId()] = node;
            if (box == undefined || box == null) {
                box = new Box(node);
            }
            this.boxes.setId(node.getId(), box);
            this.updates.push(new Command('add-node', node));
            this.treeListener.handleUpdate(this, this.updates);
        }
    }

    removeCustomNode(node: INode, box: IBox){
        if(node) {
            delete this.treeMap[node.getId()];
            if (box == undefined || box == null) {
                this.boxes.removeId(node.getId());
            }
            this.updates.push(new Command('remove-node', node));
            console.log("Node " + node.getId() + " (" + node.getAttr('name') + ") deleted and removed...");
            this.treeListener.handleUpdate(this, this.updates);
        }
    }

    updateCustomNode(node: INode, box: IBox){
        if(node) {
            this.updates.push(new Command('update-node', node));
            this.treeListener.handleUpdate(this, this.updates);
        }
    }
}