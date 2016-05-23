///<reference path="../model/INode.ts"/>
///<reference path="../js/jsDeclarations.ts"/>
///<reference path="ImageLoader.ts"/>

/**
 * Created by curtis on 3/16/15.
 * Last Updated by calvinmcm on 5/18/2016.
 */
class BuildNode implements INode {

    private branchIds:string[];
    private person;

    constructor(private id:string, data:any) {
        this.person = {living: true, display: data};
        this.id = id;
        this.branchIds = [];
        this.person.display.spouses = [];
    }

    getId():string {
        return this.id;
    }

    getAttr(key:string):any {
        return this.getAndHasAttribute(true, key);
    }

    hasAttr(key:string):boolean {
        return this.getAndHasAttribute(false, key);
    }

    setAttr(name:string, value:any):INode {
        this.person.display[name] = value;
        return this;
    }

    private getAndHasAttribute(get, attr) {

        var val = this.person.display[attr];

        if (val !== null && val !== undefined) {
            if (get)
                return val;
            return true
        }

        if (get)
            return null;
        return false;
    }

    getBranchIds():string[] {
        return this.branchIds;
    }

    getSpouses():any[] {
        return this.person.display.spouses;
    }

    getDisplaySpouse():INode {
        return this.person.display.displaySpouse;
    }

    setDisplaySpouse(node:INode) {
        this.person.display.displaySpouse = node;
    }

    isMainPerson():boolean {
        return this.person.display.isMain;
    }

    setMarriageDate(d:string) {
        this.person.display["marriagedate"] = d;
    }

    setBranchIds(ids:string[]) {
        this.branchIds = ids;
    }

    getPerson() {
        return this.person;
    }
}