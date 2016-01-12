///<reference path="../ISource.ts"/>
///<reference path="../js/jsDeclarations.ts"/>
///<reference path="FSDownloader.ts"/>
///<reference path="FSDescNode.ts"/>
/**
 * Created by renae on 8/6/15.
 */

declare function familySearchDownload(): void;

class FSDescendancyGenDownloader {
    constructor() {

    }
    getGen(id: string, generations: number): any {
        var defer = $.Deferred();
        var self = this;

        var height = 1;
        var firstDownloadAmount = Math.min(generations, height);

        var firstPromise = this.getGenerations(id, firstDownloadAmount);
        var promises = [];
        firstPromise.then(function(response) {
            var leafNodeIds = response.leafNodeIds;

            if(generations > height) {
                for(var i=0; i< leafNodeIds.length; i++) {

                    promises.push(self.getGen(leafNodeIds[i], generations-height));
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

    getGenerations(id: string, generations: number): any {
        var self = this;
        var defer = $.Deferred();

        FamilySearch.getPersonWithRelationships(id, {persons: true}).then(function(response){
            var leafNodeIds = [];
            var completed = [];

            var person = response.getPrimaryPerson();
            var spouses = response.getSpouses();

            var spousePackages = [];

            for(var i=0; i<spouses.length; i++) {
                var spouse = spouses[i];
                if(!spouse) {
                    continue;
                }
                var sr = response.getSpouseRelationship(spouse.id);
                var mar = sr.$getMarriageFact();
                var dateTimestamp = Number.NEGATIVE_INFINITY;
                if(mar && mar.$getNormalizedDate()) {
                    dateTimestamp = new Date(mar.$getNormalizedDate()).getTime();
                };
                spousePackages.push({
                    id: spouse.id,
                    person: spouse,
                    children: response.getChildrenOf(spouse.id),
                    childIds: response.getChildIdsOf(spouse.id),
                    dateTimestamp: dateTimestamp
                });
            }

            if(response.getChildIdsOf(null).length > 0) {
                spousePackages.push({
                    id: "f~"+id,
                    person: null,
                    children: response.getChildrenOf(null),
                    childIds: response.getChildIdsOf(null),
                    dateTimestamp: Number.NEGATIVE_INFINITY
                });
            }

            var children = response.getChildren();
            var tempPersonMap = {};
            for (i = 0; i < children.length; i++) {
                var child = children[i];
                tempPersonMap[child.id] = child;
            }
            //sorting spouses and children

            spousePackages.sort(function(a, b) {
                if(a.dateTimestamp === b.dateTimestamp) {
                    return 0;
                }
                if(a.dateTimestamp > b.dateTimestamp) {
                    return 1;
                }
                return -1;
            });

            for(var i=0; i<spousePackages.length; i++) {
                spousePackages[i].childIds.sort(function(a, b) {
                    var personA = tempPersonMap[a];
                    var personB = tempPersonMap[b];
                    var dateA = new Date();
                    var dateB = new Date();
                    if(personA && personA.$getBirth() && personB.$getDisplayBirthDate()) {
                        dateA = new Date(personA.$getDisplayBirthDate());
                    }
                    if(personB && personB.$getBirth() && personB.$getDisplayBirthDate()) {
                        dateB = new Date(personB.$getDisplayBirthDate());
                    }
                    if(dateA.getTime() == dateB.getTime())
                        return 0;
                    if(dateA.getTime() > dateB.getTime())
                        return 1;
                    return -1;
                });
            }

            //Sticking children in leafnode[] and creating fspeople
            var dscBranchIds = [];
            for(var i=0; i<spousePackages.length; i++) {//newSpouses.length; i++) {//
                var childIds = spousePackages[i].childIds; //newSpouses[i].childIds;//
                var spDscBranchIds = [];
                for(var j=0; j<childIds.length; j++) {
                    if(spousePackages.length >1) {//newSpouses.length >1) {//
                        spDscBranchIds.push(childIds[j]);
                    }
                    else{
                        dscBranchIds.push(childIds[j]);
                    }
                    leafNodeIds.push(childIds[j]);
                }
                if(spousePackages.length >1){//newSpouses.length >1){//
                    dscBranchIds.push(spousePackages[i].id);//newSpouses[i].id);//
                    var mainPersonPackage = [];
                    mainPersonPackage.push({
                        id: id,
                        person: person,
                        children: [],
                        childIds: [],
                        dateTimestamp: spousePackages[i].dateTimestamp
                    });
                    var fsPersonSp = new FSPerson(spousePackages[i].id, spousePackages[i].person, [],
                        spDscBranchIds, mainPersonPackage,false);
                    completed.push(fsPersonSp);
                }
            }
            var fsPerson = new FSPerson(id, person, [], dscBranchIds, spousePackages, true);//newSpouses);//
            //If there is only one spouse, create a new FSDescNode or something for the spouse and stick it in?
            completed.unshift(fsPerson);

            defer.resolve({
                leafNodeIds: leafNodeIds,
                people: completed
            });
        }, function(){
            alert("Error: You don't have access to this person's tree")
            //$('#fsModal').show();
            familySearchDownload();
            defer.reject();
        });



        // Works, but just with 1 spouse XP *****************
        /*FamilySearch.getDescendancy(id, {
            //spouse: 'KWJ4-GD3',
            generations: generations,
            personDetails: true,
            marriageDetails: true //let's see what this does
        }).then(function(response) {
            var leafNodeIds = [];
            var completed = [];
            var i, j, len, person;
            //console.log("in getGenerations");
            var persons = response.getPersons();//persons[0] = person, persons[1] = spouse, the rest = children

            //console.log(persons.length);
            for(i = 0; i<persons.length; i++)
            {
                console.log(persons[i].id);
            }
            if(persons.length >0)
            {
                //var children: string[] = [];// = self.getChildren(response, i);
                for (i = 0; i < persons.length; i++) {
                    //if (response.exists(i)) {
                    person = persons[i];//response.getPerson(i);
                    //var spouses = person.$getSpouses();
                    var kids = person.$getChildren();
                    console.log("Hmm "+kids.length);
                    var descNum:string = person.$getDescendancyNumber().toString();
                    console.log("person: "+ descNum +" "+person.id);
                    if(response.exists(descNum))
                    {
                        if(descNum.search("S") >= 0){
                            continue;
                        }
                        if((descNum.match(/\./g) || []).length>1){
                            leafNodeIds.push(persons[i].id);
                            //console.log("leaf: "+descNum+" "+person.id);//<-finish check
                        }
                        else{
                            var children: string[] = self.getChildren(response, descNum);
                            var fsPerson: FSPerson = new FSPerson(person.id, person, [], children,[]);
                            completed.push(fsPerson);
                            //console.log("complete: "+descNum+" "+person.id);
                        }//missing people who are single and don't have kids.
                        //first gen fine? 2nd not?
                    }
                }
            }
            defer.resolve({
                leafNodeIds: leafNodeIds,
                people: completed
            });
        }, function(){
            defer.reject();
        });*/
        return defer.promise();
    }
    private getChildren(response, descNum: string): string[] {
        var children: string[] = [];
        var i: number;
        var persons = response.getPersons();
        for (i = 0; i < persons.length; i++) {
            var person = persons[i];//response.getPerson(i);
            var tempDescNum:string = person.$getDescendancyNumber().toString();
            if(response.exists(tempDescNum)) {
                if(tempDescNum.search("S") >= 0){
                    continue;
                }
                if(tempDescNum.search(descNum) == 0){
                    if((tempDescNum.match(/\./g) || []).length == (descNum.match(/\./g) || []).length+1){
                        children.push(response.getPerson(tempDescNum).id);
                    }

                }
            }
        }
        return children;
    }
}