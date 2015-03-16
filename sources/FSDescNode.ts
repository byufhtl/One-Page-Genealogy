///<reference path="../model/INode.ts"/>
/**
 * Created by curtis on 3/16/15.
 */
class FSDescNode implements INode {
    constructor(private id: string, private person, private branchIds: string[]) {

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
                case "url":
                    val = "https://familysearch.org/tree/#view=ancestor&person="+this.person.id;
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
}