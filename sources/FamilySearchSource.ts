///<reference path="../ISource.ts"/>
///<reference path="../js/jsDeclarations.ts"/>

class FamilySearchSource implements ISource {

    private listener: ISourceListener;
    constructor(private rootId: string, private generations: number) {
        this.setListener({
            gotNode(node: INode): void {
            },
            done(): void {
            }
        });
    }
    start(): void {
        FamilySearch.init();
    }
    setListener(listener: ISourceListener): void {
        this.listener = listener;
    }
    pause(): void {

    }
    play(): void {

    }
}