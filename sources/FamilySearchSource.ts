///<reference path="../ISource.ts"/>
///<reference path="../js/jsDeclarations.ts"/>
///<reference path="FSDownloader.ts"/>
///<reference path="FSDescNode.ts"/>

class FamilySearchSource implements ISource {

    private listener: ISourceListener;
    private downloader: FSDownloader;
    private counter: {[s:string]: number};

    constructor(private rootId: string, private generations: number) {
        this.downloader = new FSDownloader();
        this.counter = {};
        this.setListener({
            gotNode(node: INode): void {
            },
            done(): void {
            }
        });
    }

    start(): void {
        this.initDownload(this.rootId, this.nextUniqueId(this.rootId), 0);
    }

    private nextUniqueId(id: string): string {
        if(!this.counter.hasOwnProperty(id)) {
            this.counter[id] = 0;
        }
        var count: number = this.counter[id]++;

        return id+":"+String(count);
    }

    private initDownload(downloadId: string, uniqueId: string, depth: number) {
        if(depth > this.generations) {
            return;
        }
        var self = this;
        this.downloader.getId(downloadId).then(function(person: FSPerson) {

            var dscBranchIds: string[] = person.getDscBranchIds();
            var newBranchIds: string[] = [];
            for(var i: number = 0; i<dscBranchIds.length; i++) {
                var oldId = dscBranchIds[i];
                var newId: string = self.nextUniqueId(oldId);
                newBranchIds.push(newId);
                self.initDownload(oldId, newId, depth+1);
            }
            var node: FSDescNode = new FSDescNode(uniqueId, person.getPerson(), newBranchIds,[],null,true);
            self.listener.gotNode(node);
        },
        function(){
            console.log("Download failed...");
        });
    }

    setListener(listener: ISourceListener): void {
        this.listener = listener;
    }

    pause(): void {

    }

    play(): void {

    }
}