///<reference path="../ISourceListener.ts"/>
///<reference path="../ISource.ts"/>
///<reference path="FSAncestryGenDownloader.ts"/>
/**
 * Created by curtis on 4/3/15.
 */
class FSFullTreeDownloader implements  ISource {
    private listener: ISourceListener;
    private counter: {[s:string]: number};
    private unallocatedParents: {[s:string]: string[]};
    private repeatCount: number;
    private totalCount: number;

    private downloader: FSAncestryGenDownloader;
    constructor(private rootId: string, private generations: number) {
        this.counter = {};
        this.unallocatedParents = {};
        this.downloader = new FSAncestryGenDownloader();
        this.repeatCount = 0;
        this.totalCount = 0;
        this.setListener({
            gotNode(node: INode): void {
            },
            done(): void {
            }
        });
    }
    start(): void {
        var seconds = new Date().getTime();
        var self = this;
        this.downloader.getGen(this.rootId, this.generations).then(function(people) {
            //console.log(((new Date().getTime()) - seconds)/1000);
            for(var i=0; i<people.length; i++) {
                var person = people[i];
                var idData = self.nextUniqueId(person.getId(), person.getAscBranchIds());
                var node: FSDescNode = new FSDescNode(idData.id, person.getPerson(), idData.parentIds);
                self.listener.gotNode(node);
            }
            self.listener.done();
        });
    }
    private nextUniqueId(id: string, parentIds: string[]): any {
        var openParents = this.unallocatedParents[id];
        var uniqueId = null;
        if(openParents) {
            uniqueId = openParents.shift();
            if(openParents.length === 0) {
                delete this.unallocatedParents[id];
            }
        }
        else {
            uniqueId = this.singleUniqueId(id);
        }

        var uniqueParentIds = [];
        for(var i=0; i<parentIds.length; i++) {
            var parentUniqueId = this.singleUniqueId(parentIds[i]);
            uniqueParentIds.push(parentUniqueId);
            if(!this.unallocatedParents[parentIds[i]]) {
                this.unallocatedParents[parentIds[i]] = [];
            }
            this.unallocatedParents[parentIds[i]].push(parentUniqueId);
        }

        return {
            id:uniqueId,
            parentIds: uniqueParentIds
        };
    }
    private singleUniqueId(id: string) {
        if(!this.counter.hasOwnProperty(id)) {
            this.counter[id] = 0;
            this.totalCount += 1;
        }
        else{
            this.repeatCount += 1;
            this.totalCount += 1;
        }
        var count: number = this.counter[id]++;

        //console.log(this.repeatCount);
        //console.log(this.totalCount);

        return id+":"+String(count);
    }
    setListener(listener: ISourceListener): void {
        this.listener = listener;
    }
    pause(): void {

    }
    play(): void {

    }
}