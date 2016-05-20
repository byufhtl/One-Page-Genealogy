///<reference path="../model/INode.ts"/>
///<reference path="../js/jsDeclarations.ts"/>
///<reference path="ImageLoader.ts"/>

/**
 * Created by curtis on 3/16/15.
 * Last Updated by calvinmcm 5/18/16.
 */
class FSDescNode implements INode {
    private urlPromise;
    private doneLoadingDefer;
    private marriagedate:string;
    private id:string;
    private person;
    private branchIds: string[];
    private spouses: any[];
    private displaySpouse: INode;
    private isMain: boolean;

    // Whereas the information in the person objects is primitive (and therby immutable), mutable versions are needed.
    private mutableName: string;
    private mutableGender: string;
    private mutableBirthdate: string;
    private mutableBirthplace: string;
    private mutableDeathdate: string;
    private mutableDeathplace: string;

    constructor(id: string, person, branchIds: string[], spouses: any[], displaySpouse: INode, isMain:boolean) {
        this.id = id;
        this.person = person;
        this.branchIds = branchIds;
        this.spouses = spouses;
        this.displaySpouse = displaySpouse;
        this.isMain = isMain;

        if(person) {
            this.mutableName = person.display.name;
            this.mutableGender = person.display.gender;
            this.mutableBirthdate = person.display.birthdate;
            this.mutableBirthplace = person.display.birthplace;
            this.mutableDeathdate = person.display.deathdate;
            this.mutableDeathplace = person.display.deathplace;
        }

        this.urlPromise = null;
        this.doneLoadingDefer = $.Deferred();
        this.marriagedate = "";
    }

    getId(): string {
        return this.id;
    }
    getAttr(key: string): any {
        return this.getAndHasAttribute(true, key);
    }
    hasAttr(key: string): boolean {
        return this.getAndHasAttribute(false, key);
    }
    setAttr(name: string, value: any): INode{
        switch(name){
            case 'name':
                this.mutableName = value;
                break;
            case 'gender':
                this.mutableGender = value;
                break;
            case 'birthdate':
                this.mutableBirthdate = value;
                break;
            case 'birthplace':
                this.mutableBirthplace = value;
                break;
            case 'deathdate':
                this.mutableDeathdate = value;
                break;
            case 'deathplace':
                this.mutableDeathplace = value;
                break;
            case 'marriagedate':
                this.marriagedate = value;
                break;
        }
        return this;
    }
    private getAndHasAttribute(get, attr) {
        var val = null;

        if(this.person) {
            switch (attr) {
                case "surname":
                    val = this.person.$getSurname();
                    break;
                case "givenname":
                    val = this.person.$getGivenName();
                    break;
                case "name":
                    val = this.mutableName;
                    break;
                case "gender":
                    val = this.mutableGender;
                    break;
                case "living":
                    val = this.person.$isliving();
                    break;
                case "lifespan":
                    val = this.person.$getDisplayLifeSpan();
                    break;
                case "birthdate":
                    val = this.mutableBirthdate;
                    break;
                case "birthplace":
                    val = this.mutableBirthplace;
                    break;
                case "deathdate":
                    val = this.mutableDeathdate;
                    break;
                case "deathplace":
                    val = this.mutableDeathplace;
                    break;
                case "marriagedate":
                    val = this.marriagedate;
                    break;
                case "url":
                    val = "https://familysearch.org/tree/#view=ancestor&person="+this.person.id;
                    break;
                case "doneLoading":
                    val = this.doneLoadingDefer.promise();
                    break;
                case "profilePicturePromise":

                    if(this.urlPromise !== null) {
                        val = this.urlPromise;
                    }
                    else {
                        var defer = $.Deferred();
                        var self = this;
                        this.person.$getPersonPortraitUrl().then(function (response) {
                            ImageLoader.loadImageString(response).then(function(data){
                                if(data) {
                                    defer.resolve(data);
                                }
                                else {
                                    defer.reject();
                                }
                                self.doneLoadingDefer.resolve();
                            });
                        }, function () {
                            defer.reject();
                            self.doneLoadingDefer.resolve();
                        });
                        this.urlPromise = defer.promise();
                        val = this.urlPromise;
                    }
                    break;
            }
            if(val !== null && val !== undefined){
                if(get) {
                    return val;
                }
                return true
            }
        }
        if(get) {
            return null;
        }
        return false;
    }
    getBranchIds(): string[] {
        return this.branchIds;
    }
    getSpouses(): any[] {
        return this.spouses;
    }
    getDisplaySpouse(): INode {
        return this.displaySpouse;
    }
    setDisplaySpouse(node: INode){
        this.displaySpouse = node;
    }
    isMainPerson(): boolean{
        return this.isMain;
    }
    setMarriageDate(d:string){
        this.marriagedate = d;
    }
    setBranchIds(ids:string[]){
        this.branchIds = ids;
    }
    getPerson(){
        return this.person;
    }
}