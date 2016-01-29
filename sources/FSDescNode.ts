///<reference path="../model/INode.ts"/>
///<reference path="../js/jsDeclarations.ts"/>
///<reference path="ImageLoader.ts"/>

/**
 * Created by curtis on 3/16/15.
 */
class FSDescNode implements INode {
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
                    val = this.person.$getSurname();
                    break;
                case "givenname":
                    val = this.person.$getGivenName();
                    break;
                case "name":
                    val = this.person.$getDisplayName();
                    break;
                case "gender":
                    val = this.person.$getDisplayGender();
                    break;
                case "lifespan":
                    val = this.person.$getDisplayLifeSpan();
                    break;
                case "birthdate":
                    val = this.person.$getDisplayBirthDate();
                    break;
                case "birthplace":
                    val = this.person.$getDisplayBirthPlace();
                    break;
                case "deathdate":
                    val = this.person.$getDisplayDeathDate();
                    break;
                case "deathplace":
                    val = this.person.$getDisplayDeathPlace();
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
}