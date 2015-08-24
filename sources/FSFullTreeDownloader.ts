///<reference path="../ISourceListener.ts"/>
///<reference path="../ISource.ts"/>
///<reference path="FSAncestryGenDownloader.ts"/>
///<reference path="FSDescendancyGenDownloader.ts"/>
/**
 * Created by curtis on 4/3/15.
 */
class FSFullTreeDownloader implements  ISource {
    private listener: ISourceListener;
    private counter: {[s:string]: number};
    private unallocatedParents: {[s:string]: string[]};
    private repeatCount: number;
    private totalCount: number;

    //private downloader: FSAncestryGenDownloader;
    private downloader: FSDescendancyGenDownloader;
    constructor(private rootId: string, private generations: number) {
        this.counter = {};
        this.unallocatedParents = {};
        //this.downloader = new FSAncestryGenDownloader();
        this.downloader = new FSDescendancyGenDownloader();
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
                //console.log("person: "+person.getId());
                //var idData = self.nextUniqueId(person.getId(), person.getAscBranchIds());
                var idData = self.nextUniqueId(person.getId(), person.getDscBranchIds());
                var node: FSDescNode = null;
                if(person.getSpouses().length>0){
                    var spouseNode: FSDescNode = new FSDescNode(person.getSpouses()[0].id,person.getSpouses()[0].person,
                        [], [], null, !person.isMainPerson());
                    node = new FSDescNode(idData.id, person.getPerson(), idData.parentIds, person.getSpouses(),
                        spouseNode, person.isMainPerson());
                }
                else {
                    node = new FSDescNode(idData.id, person.getPerson(), idData.parentIds,person.getSpouses(),null,true);
                }


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
        /*var i: number;
        for(i = 0; i<uniqueParentIds.length; i++)
        {
            console.log(String(uniqueParentIds[i]));
        }
        console.log("next");*/
        return {
            id:uniqueId,
            parentIds: uniqueParentIds
        };
    }
    private singleUniqueId(id: string) {
        //console.log("single: "+id);
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