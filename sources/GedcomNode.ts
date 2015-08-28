/**
 * Created by justinrasband on 8/24/15.
 */
/**
 * Created by justinrasband on 8/6/15.
 */
/**
 * Created by justinrasband on 7/21/15.
 */
///<reference path="../model/INode.ts"/>
///<reference path="../js/jsDeclarations.ts"/>
var GedcomNode = (function () {
    function GedcomNode(id, person, branchIds) {
        this.id = id;
        this.person = person;
        this.branchIds = branchIds;
        this.urlPromise = null;
        this.displaySpouse = null;
        this.isMain = true;
        //this.spouses = []
        //this.doneLoadingDefer = $.Deferred();
    }
    GedcomNode.prototype.getId = function () {
        return this.id;
    };
    GedcomNode.prototype.getAttr = function (key) {
        return this.getAndHasAttribute(true, key);
    };
    GedcomNode.prototype.hasAttr = function (key) {
        return this.getAndHasAttribute(false, key);
    };
    GedcomNode.prototype.getAndHasAttribute = function (get, attr) {
        var val = null;
        if (this.person) {
            switch (attr) {
                case "surname":
                    if (this.person.hasOwnProperty("surname")) {
                        val = this.person.surname;
                    }
                    else {
                        val = null;
                    }
                    break;
                case "givenname":
                    if (this.person.hasOwnProperty("given")) {
                        val = this.person.given;
                    }
                    else {
                        val = null;
                    }
                    break;
                case "name":
                    if (this.person.hasOwnProperty("name")) {
                        var aName = this.person.name;
                        var finalname = "";
                        for (var j = 0; j < aName.length; j++) {
                            if (aName[j] != "/") {
                                finalname = finalname + aName[j];
                            }
                        }
                        val = finalname;
                    }
                    else {
                        val = null;
                        console.log(this.person);
                    }
                    break;
                case "gender":
                    if (this.person.hasOwnProperty("gender")) {
                        var gender = this.person.gender;
                        if (gender == "M" || gender == "MALE") {
                            gender = "Male";
                        }
                        else if (gender == "F" || gender == "Female") {
                            gender = "Female";
                        }
                        val = gender;
                    }
                    else {
                        val = null;
                    }
                    break;
                case "lifespan":
                    val = "";
                    if (this.person.hasOwnProperty("birthdate")) {
                        val = String(this.person.birthdate) + " ";
                    }
                    val = val + "-";
                    if (this.person.hasOwnProperty("deathdate")) {
                        val = val + " " + String(this.person.deathdate);
                    }
                    if (val == "-" || val == "") {
                        val = null;
                    }
                    break;
                case "birthdate":
                    if (this.person.hasOwnProperty("birthdate")) {
                        val = this.person.birthdate;
                    }
                    else {
                        val = null;
                    }
                    break;
                case "birthplace":
                    if (this.person.hasOwnProperty("birthplace")) {
                        val = this.person.birthplace;
                    }
                    else {
                        val = null;
                    }
                    break;
                case "deathdate":
                    if (this.person.hasOwnProperty("deathdate")) {
                        val = this.person.deathdate;
                    }
                    else {
                        val = null;
                    }
                    break;
                case "deathplace":
                    if (this.person.hasOwnProperty("deathplace")) {
                        val = this.person.deathplace;
                    }
                    else {
                        val = null;
                    }
                    break;
                case "marriagedate":
                    if(this.displaySpouse == null){
                        val = null
                    }else if (!this.person.hasOwnProperty("marriageFacts")){
                        val = null
                    }else{

                        var displaySpousePid = this.displaySpouse.person.pid
                        if(this.person.marriageFacts[displaySpousePid].hasOwnProperty("marriageDate")){
                            var marriageFacts = this.person.marriageFacts[displaySpousePid]
                            val = marriageFacts["marriageDate"]
                        }else{
                            val = null
                        }

                    }
                    break;
            }
            if (val !== null && val !== undefined) {
                if (get)
                    return val;
                return true;
            }
        }
        if (get)
            return null;
        return false;
    };
    GedcomNode.prototype.setBranchIds = function (branches) {
        this.branchIds = branches
    };
    GedcomNode.prototype.getBranchIds = function () {
        return this.branchIds;
    };
    GedcomNode.prototype.getSpouses = function () {
        if(this.person.hasOwnProperty('spouses')){
            return this.person.spouses
        }else{
            return []
        }
        //return this.person.spouses;
    };
    GedcomNode.prototype.getDisplaySpouse = function(){
        return this.displaySpouse
    };
    GedcomNode.prototype.setDisplaySpouse = function(displaySpouse){
        this.displaySpouse = displaySpouse
    };
    GedcomNode.prototype.setAsMain = function (){
        this.isMain = true;
    }
    GedcomNode.prototype.isMainPerson = function(){
        if(this.displaySpouse != null){
            var spouse = this.displaySpouse;

            var personSpouses = this.person.spouses.length
            var spouseSpouses = spouse.person.spouses.length
            if(spouseSpouses > 1){
                this.isMain = false
                this.displaySpouse.isMain = true
            }else{
                this.displaySpouse.isMain = false
            }


        }

        return this.isMain
    }
    GedcomNode.prototype.setMarriageDate = function(){}
    return GedcomNode;
})();
//# sourceMappingURL=GedcomNode.js.map