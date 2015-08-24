/**
 * Created by justinrasband on 8/21/15.
 */
///<reference path="../ISource.ts"/>
/**
 * Created by justinrasband on 8/6/15.
 */
var GedcomDownloader = (function () {
    function GedcomDownloader(rootId, generations, gedcom,dscOrAsc) {
        this.rootId = rootId;
        this.generations = generations;
        this.gedcom = gedcom;
        this.counter = {};
        this.unallocatedParents = {};
        this.repeatCount = 0;
        this.totalCount = 0;
        this.usedIds = {};
        this.dscOrAsc = dscOrAsc
        this.setListener({
            gotNode: function (node) {
            },
            done: function () {
            }
        });
    }
    GedcomDownloader.prototype.start = function () {
        var seconds = new Date().getTime();
        var people = this.getGenerations(this.rootId, this.generations);
        console.log(people);
        for (var i = 0; i < people.length; i++) {
            this.listener.gotNode(people[i]);
        }
        this.listener.done();
    };
    GedcomDownloader.prototype.getGenerations = function (rootID, gens) {
        var toReturn = [];
        var rootPerson = this.gedcom[rootID]; //rootPerson is a GedcomNode
        toReturn.push(rootPerson);
        var currentGeneration = [];
        currentGeneration.push(rootPerson);
        for (var generation = 1; generation < gens; generation++) {
            var nextGen = [];
            for (var k = 0; k < currentGeneration.length; k++) { //for every person in the last generations
                var person = currentGeneration[k];
                if (person == null) {
                    console.log("k is: " + k + " generation is: " + generation);
                    console.log(currentGeneration);
                    console.log(toReturn);
                    console.log(rootPerson);
                    console.log(rootID);
                    console.log(this.gedcom);
                }

                this.addLeafNodes(person, nextGen);
            }
            Array.prototype.push.apply(toReturn, nextGen);
            currentGeneration = nextGen;
        }
        return toReturn;
    };

    GedcomDownloader.prototype.giveSpouseCommonFamily = function(person,spouseId){

        var families = person.person.familySpouse
        var commonFamily = "";

        var spousePerson = this.gedcom[spouseId];
        var spouseFamilies = spousePerson.person.familySpouse

        for(var k = 0; k < families.length;k++){
            for(var m = 0; m < spouseFamilies.length; m++){

                if(families[k] == spouseFamilies[m]){
                    commonFamily = families[k]
                }

            }
        }

        if(commonFamily != "" && spousePerson.person.hasOwnProperty("dscBranchIds")){
            this.gedcom[spouseId].branchIds = spousePerson.person.dscBranchIds[commonFamily]
        }

    };

    GedcomDownloader.prototype.handleMultipleSpouses = function(person){

        console.log("Multiple spouses found for " + person.person.name)

        person.person.branchIds = person.person.spouses;
        person.setBranchIds(person.person.spouses)

        this.gedcom[person.person.pid] = person;
        this.gedcom[person.person.pid].setBranchIds(person.person.spouses)


        if(person.branchIds.length != person.person.spouses.length){
            console.log("ERROR")
        }

        for(var j = 0; j < person.branchIds.length;j++){

            var spouseId = person.branchIds[j]

            if(this.gedcom[spouseId].person.spouses.length > 1){
                this.giveSpouseCommonFamily(person,spouseId)
            }

            this.gedcom[spouseId].person.spouses = []

        }

    }

    GedcomDownloader.prototype.addLeafNodes = function (person, toReturn) {

        if(person.person.hasOwnProperty("spouses")&&this.dscOrAsc == "descendancy") {

            if (person.person.spouses.length > 1) {
                this.handleMultipleSpouses
            }
        }

        var ascIds = person.getBranchIds();

        for (var i = 0; i < ascIds.length; i++) {
            var id = ascIds[i];
            var ascendant = this.gedcom[id];

            if (!(this.usedIds.hasOwnProperty(id))&&this.gedcom[id]!= null) {
                toReturn.push(this.gedcom[id]);
                this.usedIds[id] = "0";
            }
            else {
                console.log("duplicate id: " + id);
            }
        }


    };
    GedcomDownloader.prototype.nextUniqueId = function (id, parentIds) {
        var openParents = this.unallocatedParents[id];
        var uniqueId = null;
        if (openParents) {
            uniqueId = openParents.shift();
            if (openParents.length === 0) {
                delete this.unallocatedParents[id];
            }
        }
        else {
            uniqueId = this.singleUniqueId(id);
        }
        var uniqueParentIds = [];
        for (var i = 0; i < parentIds.length; i++) {
            var parentUniqueId = this.singleUniqueId(parentIds[i]);
            uniqueParentIds.push(parentUniqueId);
            if (!this.unallocatedParents[parentIds[i]]) {
                this.unallocatedParents[parentIds[i]] = [];
            }
            this.unallocatedParents[parentIds[i]].push(parentUniqueId);
        }
        return {
            id: uniqueId,
            parentIds: uniqueParentIds
        };
    };
    GedcomDownloader.prototype.singleUniqueId = function (id) {
        if (!this.counter.hasOwnProperty(id)) {
            this.counter[id] = 0;
            this.totalCount += 1;
        }
        else {
            this.repeatCount += 1;
            this.totalCount += 1;
        }
        var count = this.counter[id]++;
        //console.log(this.repeatCount);
        //console.log(this.totalCount);
        return id + ":" + String(count);
    };
    GedcomDownloader.prototype.setListener = function (listener) {
        this.listener = listener;
    };
    GedcomDownloader.prototype.pause = function () {
    };
    GedcomDownloader.prototype.play = function () {
    };
    return GedcomDownloader;
})();
//# sourceMappingURL=GedcomSource.js.map