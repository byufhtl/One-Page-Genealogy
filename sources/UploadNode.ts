/**
 * Created by jared on 2/22/16.
 */

///<reference path="../model/INode.ts"/>
///<reference path="../js/jsDeclarations.ts"/>
///<reference path="ImageLoader.ts"/>
///<reference path="FSDescNode.ts"/>

declare var accessToken;


class UploadNode implements INode {
    private urlPromise;
    private doneLoadingDefer;
    private marriagedate:string;
    constructor(private id: string, private person, private branchIds: string[],private spouses: any[],
                private displaySpouse: FSDescNode, private isMain:boolean) {
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
    private getAndHasAttribute(get, attr) {
        var val = null;

        if(this.person) {
            switch (attr) {
                case "surname":
                    var names = this.person.display.name.split(' ')
                    val = names[names.length -1];
                    break;
                case "givenname":
                    var names = this.person.display.name.split(' ')
                    val = names[0];
                    break;
                case "name":
                    val = this.person.display.name;
                    break;
                case "gender":
                    val = this.person.display.gender;
                    break;
                case "living":
                    val = this.person.living;
                    break;
                case "lifespan":
                    val = this.person.display.lifespan;
                    break;
                case "birthdate":
                    val = this.person.display.birthDate;
                    break;
                case "birthplace":
                    val = this.person.display.birthPlace;
                    break;
                case "deathdate":
                    val = this.person.display.deathDate;
                    break;
                case "deathplace":
                    val = this.person.display.deathPlace;
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
                        var url = "https://familysearch.org/platform/tree/persons/" +
                            this.person.id + "/portrait?access_token=" + accessToken;
                        ImageLoader.loadImageString(url).then(function(data){
                            if(data) {
                                defer.resolve(data);
                            }
                            else {
                                defer.reject();
                            }
                            self.doneLoadingDefer.resolve();
                        });


                        this.urlPromise = defer.promise();
                        val = this.urlPromise;
                    }
                    break;
            }
            if(val !== null && val !== undefined){
                if(get)
                    return val;
                return true
            }
        }
        if(get)
            return null;
        return false;
    }
    getBranchIds(): string[] {
        return this.branchIds;
    }
    getSpouses(): any[] {
        return this.spouses;
    }
    getDisplaySpouse(): FSDescNode {
        return this.displaySpouse;
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