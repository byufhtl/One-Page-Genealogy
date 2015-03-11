///<reference path="../ISource.ts"/>
///<reference path="FakeNode.ts"/>
///<reference path="../model/INode.ts"/>
/**
 * Created by krr428 on 3/7/15.
 */

class FakeSource implements ISource {

    listener: ISourceListener;

    constructor() {
        this.setListener({
            gotNode(node: INode): void {
                console.log("Source reports that it 'gotNode' with id = " + node.getId());
            },
            done(): void {
                console.log("Source reports that is is 'done'.  Ahem.")
            }
        })
    }

    fireNodeCreated(node: INode): void {
        if (this.listener) {
            this.listener.gotNode(node);
        }
        else {
            console.log("Warning, tried to notify listener, but listener is null!");
        }
    }

    start(): void {
        var self = this;
        var MAX_NUM_IDS = 300;
        var childQueue = [];
        var nextIndex = 0;

        function enqueueNextChild() {
            if (nextIndex <= MAX_NUM_IDS) {
                childQueue.push(nextIndex++);
                return true;
            }
            else {
                return false;
            }
        }

        enqueueNextChild(); // Add the root person on.

        while (childQueue.length > 0) {
            var root = childQueue.shift();
            var n = new FakeNode(root.toString());
            for (var i = 0; i < 3; ++i) {

                if (! enqueueNextChild()) {
                    break;
                }
                else {
                    n.addBranchId((nextIndex-1).toString());
                }// Only pushes child on queue if there is space.
            }

            self.fireNodeCreated(n);
        }
    }

    setListener(listener: ISourceListener): void {
        this.listener = listener;
    }

    pause(): void {
        console.log("pause() was called on the FakeSource.");
    }

    play(): void {
        console.log("play() was called on the FakeSource.");
    }

}
