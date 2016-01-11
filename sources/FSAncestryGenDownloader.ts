///<reference path="../ISource.ts"/>
///<reference path="../js/jsDeclarations.ts"/>
///<reference path="FSDownloader.ts"/>
///<reference path="FSDescNode.ts"/>

declare function familySearchDownload(): void;

class FSAncestryGenDownloader {

    constructor() {

    }

    getGen(id: string, generations: number, child: FSPerson): any {
        var defer = $.Deferred();
        var self = this;

        var height = 8;
        //console.log(generations);
        var firstDownloadAmount = Math.min(generations, height);

        var firstPromise = this.getGenerations(id, firstDownloadAmount,child);
        var promises = [];
        firstPromise.then(function(response) {
            var leafNodeIds = response.leafNodeIds;
            var childPointers = response.childPointers;
            if(generations > height) {
                for(var i=0; i< leafNodeIds.length; i++) {

                    promises.push(self.getGen(leafNodeIds[i], generations-height,childPointers[i]));
                }
            }

            var allPeople = response.people;
            var completed = 0;
            if(promises.length ===0){
                defer.resolve(allPeople);
            }
            for(var i=0; i< promises.length; i++) {
                promises[i].then(function(people) {
                    allPeople = allPeople.concat(people);
                    completed += 1;
                    if(completed === promises.length) {
                        defer.resolve(allPeople);
                    }
                },function(){
                    completed += 1;
                    console.log("Promise Failed...");
                });
            }
        }, function() {
            defer.reject();
        });
        return defer.promise();
    }

    getGenerations(id: string, generations: number, childPerson: FSPerson): any {
        var self = this;
        var defer = $.Deferred();
        FamilySearch.getAncestry(id, {
            generations: generations,
            personDetails: true
        }).then(function(response) {
            var leafNodeIds = [];
            var completed = [];
            var i, len, person;
            var parentMap = {};
            var unprocessedLeafNodes = [];
            var leafNodeIndex = Math.pow(2, generations);
            for (i = 1, len = Math.pow(2, generations+1); i < len; i++) {
                if (response.exists(i)) {
                    person = response.getPerson(i);
                    if(i >= leafNodeIndex) {
                        leafNodeIds.push(person.id);
                        var child: FSPerson = parentMap[i];
                        if(!child.hasOwnProperty('helpParents')) {
                            child.helpParents = [];
                        }
                        child.helpParents.push(person.id);
                        unprocessedLeafNodes.push(child);
                    }
                    else {
                        var parents: string[] = self.getParents(response, i);
                        var fsPerson: FSPerson = new FSPerson(person.id, person, parents, [],[],false);
                        self.addParents(response, i, parentMap, fsPerson);

                        if(i == 1 && childPerson != null){//if at the beginning of generation download connect to previous
                            //if(!childPerson.hasOwnProperty('helpParents')) {
                            //    childPerson.helpParents = [];
                            //}
                            //childPerson.helpParents.push(fsPerson);
                            var index = childPerson.helpParents.indexOf(person.id);
                            childPerson.helpParents[index] = fsPerson;
                        }

                        if(parentMap.hasOwnProperty(i)) {
                            var child: FSPerson = parentMap[i];
                            if(!child.hasOwnProperty('helpParents')) {
                                child.helpParents = [];
                            }
                            child.helpParents.push(fsPerson);
                        }

                        completed.push(fsPerson);
                    }
                }
            }
            defer.resolve({
                leafNodeIds: leafNodeIds,
                people: completed,
                childPointers: unprocessedLeafNodes
            });
        }, function(){
            alert("Error: You don't have access to this person's tree.");
            //$('#fsModal').show();
            familySearchDownload();
            defer.reject();
        });
        return defer.promise();
    }

    private getParents(response, ahn: number): string[] {
        var parents: string[] = [];
        var father = ahn * 2;
        var mother = ahn *2 + 1;
        if (response.exists(father)) {
            parents.push(response.getPerson(father).id);
        }
        if (response.exists(mother)) {
            parents.push(response.getPerson(mother).id);
        }
        return parents;
    }
    private addParents(response, ahn: number, d, child: FSPerson): void {
        var father = ahn * 2;
        var mother = ahn *2 + 1;
        if (response.exists(father)) {
            d[father] = child
        }
        if (response.exists(mother)) {
            d[mother] = child
        }
    }

}