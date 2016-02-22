/**
 * Created by justinrasband on 8/21/15.
 */
///<reference path="../ISource.ts"/>
///<reference path="../util/StringUtils.ts"/>
///<reference path="GedcomNode.ts"/>
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
        //console.log(people);
        for (var i = 0; i < people.length; i++) {

            var person = people[i];
            var idData = this.nextUniqueId(person.getId(),person.getBranchIds());


            var newPerson = new GedcomNode(idData.id, person.person, idData.parentIds);
            newPerson.setDisplaySpouse(person.getDisplaySpouse());
            console.log(newPerson);
            this.listener.gotNode(newPerson);
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

                var spouseArray = []
                if(person.person.hasOwnProperty("spouses")){
                    if(person.person.spouses.length>1 && this.dscOrAsc == "descendancy"){
                        this.addLeafNodes(person,spouseArray)
                        //spouseArray.sort(this.sorter)
                        Array.prototype.push.apply(nextGen, spouseArray);
                        for(var i = 0; i < spouseArray.length;i++){
                            this.addLeafNodes(spouseArray[i],nextGen)
                        }
                    }else{
                        this.addLeafNodes(person, nextGen);

                    }
                }else{
                    this.addLeafNodes(person, nextGen);

                }



            }
            if(generation == gens-1){
                var tempNextGenArray = []
                var throwAwayArray = []
                for(var k = 0; k < nextGen.length;k++){
                    if(nextGen[k].person.hasOwnProperty("spouses")){
                        if(nextGen[k].person.spouses.length > 1){
                            this.addLeafNodes(nextGen[k],tempNextGenArray)
                        }else{
                            this.addLeafNodes(nextGen[k],throwAwayArray)
                        }
                    }
                }
                if(tempNextGenArray.length > 0){
                    Array.prototype.push.apply(nextGen, tempNextGenArray);
                }
            }

            Array.prototype.push.apply(toReturn, nextGen);
            currentGeneration = nextGen;

        }
        console.log(toReturn);
        return toReturn;
    };
    GedcomDownloader.prototype.sorter = function(a,b){
        var comparingSpouses = false;
        if(a.hasOwnProperty("displaySpouse")&&b.hasOwnProperty("displaySpouse")){
            if(a.getDisplaySpouse() == null){

            }else if (b.getDisplaySpouse() == null){

            }else if(a.getDisplaySpouse().person.pid == b.getDisplaySpouse().person.pid){
                comparingSpouses = true;
            }
        }
        if(comparingSpouses){
            //console.log("comparing spouses")

            var aMarriage = StringUtils.standardDate(a.getAttr('marriagedate'))
            var bMarriage = StringUtils.standardDate(b.getAttr('marriagedate'))
            var aDate = new Date(aMarriage)
            var bDate = new Date(bMarriage)
            if(aDate.getTime() == bDate.getTime())
                return 0;
            if(aDate.getTime() > bDate.getTime())
                return 1;
            return -1;

        }else if(a.hasAttr("birthdate")&&b.hasAttr("birthdate")){

            var aBirth = StringUtils.standardDate(a.getAttr('birthdate'))
            var bBirth = StringUtils.standardDate(b.getAttr('birthdate'))
            var aDate = new Date(aBirth)
            var bDate = new Date(bBirth)
            if(aDate.getTime() == bDate.getTime())
                return 0;
            if(aDate.getTime() > bDate.getTime())
                return 1;
            return -1;

        }else if(b.hasAttr("deathdate")&&a.hasAttr("deathdate")){

            var aDeath = StringUtils.standardDate(a.getAttr('deathdate'))
            var bDeath = StringUtils.standardDate(b.getAttr('deathdate'))
            var aDate = new Date(aDeath)
            var bDate = new Date(bDeath)
            if(aDate.getTime() == bDate.getTime())
                return 0;
            if(aDate.getTime() > bDate.getTime())
                return 1;
            return -1;

        }else{
            return 0;
        }


    }

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
        }else{
            this.gedcom[spouseId].branchIds = []
        }

    };

    GedcomDownloader.prototype.handleMultipleSpouses = function(person){

        person.person.branchIds = person.person.spouses;
        person.setBranchIds(person.person.spouses)

        this.gedcom[person.person.pid] = person;
        this.gedcom[person.person.pid].setBranchIds(person.person.spouses)


        if(person.branchIds.length != person.person.spouses.length){
            console.log("ERROR")
        }

        for(var j = 0; j < person.branchIds.length;j++){

            var spouseId = person.branchIds[j]

            var spouseHasMoreSpouses = false
            if(this.gedcom[spouseId].person.spouses.length > 1){
                this.giveSpouseCommonFamily(person,spouseId)
                spouseHasMoreSpouses = true;
            }

            this.gedcom[spouseId].setDisplaySpouse(person)

            var newSpouseArray = []
            newSpouseArray.push(person.person.pid)
            this.gedcom[spouseId].person.spouses = newSpouseArray


        }

    }

    GedcomDownloader.prototype.addLeafNodes = function (person, toReturn) {

        if(person.person.hasOwnProperty("spouses")) {

            if (person.person.spouses.length > 1 && this.dscOrAsc == "descendancy") {
                this.handleMultipleSpouses(person)

            }else if (person.person.spouses.length > 1 && this.dscOrAsc == "ascendancy") {

                //var spouseId = person.person.spouse[0]
                //person.setDisplaySpouse(this.gedcom[spouseId])

            }else if(person.person.spouses.length == 1){

                var spouseId = person.person.spouses[0]
                person.setDisplaySpouse(this.gedcom[spouseId])
            }
        }

        var tempGenArray = []
        var ascIds = person.getBranchIds();
        if(ascIds == null){return}

        for (var i = 0; i < ascIds.length; i++) {
            var id = ascIds[i];
            var ascendant = this.gedcom[id];

            if (!(this.usedIds.hasOwnProperty(id))&&this.gedcom[id]!= null) {
                tempGenArray.push(this.gedcom[id]);
                this.usedIds[id] = "0";
            }
            else {
                //console.log("duplicate id: " + id);
            }
        }
        tempGenArray.sort(this.sorter)

        Array.prototype.push.apply(toReturn, tempGenArray);

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