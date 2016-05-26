/**
 * Created by justinrasband on 8/24/15.
 * Last Update by calvinmcmc on 5/18/16.
 */
///<reference path="../model/INode.ts"/>
///<reference path="../js/jsDeclarations.ts"/>
class GedcomNode implements INode {

    private id;
    private person;
    private branchIds;
    private urlPromise;
    private displaySpouse;
    private isMain: boolean;

    constructor(id, person, branchIds) {
        this.id = id;
        this.person = person;
        this.branchIds = branchIds;
        this.urlPromise = null;
        this.displaySpouse = null;
        if(person) {
            person.display = {};
            if(person.hasOwnProperty("name")) { // Because there are weird gedcom nodes out there...
                person.display.name = this.fixName(person.name);
                person.display.gender = person.gender;
                person.display.birthdate = person.birthdate;
                person.display.birthplace = person.birthplace;
                person.display.deathdate = person.deathdate;
                person.display.deathplace = person.deathplace;
                person.display.marriagedate = person.marriagedate;
            }
            this.isMain = person.isMain;
        }
        if(this.isMain === undefined){
            this.isMain = false;
        }
        //this.spouses = []
        //this.doneLoadingDefer = $.Deferred();
    }

    getId() {
        return this.id;
    };

    getAttr(key) {
        return this.getAndHasAttribute(true, key);
    };

    hasAttr(key) {
        return this.getAndHasAttribute(false, key);
    };

    setAttr(name: string, value) {
        switch(name){
            case "name":
                this.person.display.name = value;
                break;
            case "gender":
                this.person.display.gender = value;
                break;
            case "birthdate":
                this.person.display.birthdate = value;
                break;
            case "birthplace":
                this.person.display.birthplace = value;
                break;
            case "deathdate":
                this.person.display.deathdate = value;
                break;
            case "deathplace":
                this.person.display.deathplace = value;
                break;
            case "marriagedate":
                this.person.display.marriagedate = value;
                break;
        }
        return this;
    };

    getAndHasAttribute(get, attr) {
        var val = null;
        if (this.person) {
            switch (attr) {
                case "surname":
                    if (this.person.hasOwnProperty("surname")) {
                        val = this.fixName(this.person.surname);
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
                        var aName = this.person.display.name;
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
                        var gender = this.person.display.gender;
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
                        val = String(this.person.display.birthdate) + " ";
                    }
                    val = val + "-";
                    if (this.person.hasOwnProperty("deathdate")) {
                        val = val + " " + String(this.person.display.deathdate);
                    }
                    if (val == "-" || val == "") {
                        val = null;
                    }
                    break;
                case "birthdate":
                    if (this.person.hasOwnProperty("birthdate")) {
                        val = this.person.display.birthdate;
                    }
                    else {
                        val = null;
                    }
                    break;
                case "birthplace":
                    if (this.person.hasOwnProperty("birthplace")) {
                        val = this.person.display.birthplace;
                    }
                    else {
                        val = null;
                    }
                    break;
                case "deathdate":
                    if (this.person.hasOwnProperty("deathdate")) {
                        val = this.person.display.deathdate;
                    }
                    else {
                        val = null;
                    }
                    break;
                case "deathplace":
                    if (this.person.hasOwnProperty("deathplace")) {
                        val = this.person.display.deathplace;
                    }
                    else {
                        val = null;
                    }
                    break;
                case "marriagedate":
                    if (this.displaySpouse == null) {
                        val = null
                    } else if (!this.person.hasOwnProperty("marriageFacts")) {
                        val = null
                    } else {

                        var displaySpousePid = this.displaySpouse.person.pid;
                        if (this.person.marriageFacts[displaySpousePid].hasOwnProperty("marriageDate")) {
                            var marriageFacts = this.person.marriageFacts[displaySpousePid];
                            val = marriageFacts["marriageDate"]
                        } else {
                            val = null
                        }

                    }
                    break;
                case "baptism":
                    if (this.person.hasOwnProperty("baptized")) {
                        val = this.person.baptized;
                    }

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

    setBranchIds(branches) {
        this.branchIds = branches
    };

    getBranchIds() {
        return this.branchIds;
    };

    getSpouses() {
        if (this.person.hasOwnProperty('spouses')) {
            return this.person.spouses
        } else {
            return []
        }
        //return this.person.spouses;
    };

    getDisplaySpouse() {
        return this.displaySpouse
    };

    setDisplaySpouse(displaySpouse) {
        this.displaySpouse = displaySpouse
    };

    setAsMain() {
        this.isMain = true;
    }

    getPerson(){
        return this.person;
    }

    isMainPerson() {
        if (this.displaySpouse != null) {
            var spouse = this.displaySpouse;

            var spouseSpouses = spouse.person.spouses.length;
            if (spouseSpouses > 1) {
                this.isMain = false;
                this.displaySpouse.isMain = true
            } else {
                this.displaySpouse.isMain = false
            }


        }

        return this.isMain
    }

    setMarriageDate() {
    }

    /**
     * This really deserves to be called from a utils class somewhere that reuses the stuff in the gedcomHandler...
     * @param name
     */
    private fixName(name: string): string {
        while (name.indexOf("/") != -1){
            name = name.replace("/", "");
        }
        return name;
    }
}