///<reference path="../ISourceListener.ts"/>
///<reference path="../ISource.ts"/>
/**
 * Created by curtis on 4/3/15.
 */
class FSFullTreeDownloader implements  ISource {
    private listener: ISourceListener;
    private counter: {[s:string]: number};
    constructor(private rootId: string, private generations: number) {
        this.counter = {};
        this.setListener({
            gotNode(node: INode): void {
            },
            done(): void {
            }
        });
    }
    start(): void {
    }
    setListener(listener: ISourceListener): void {
        this.listener = listener;
    }
    pause(): void {

    }
    play(): void {

    }
}