///<reference path="../model/INode.ts"/>
///<reference path="../js/jsDeclarations.ts"/>
///<reference path="ImageLoader.ts"/>

/**
 * Created by curtis on 3/16/15.
 * Last Updated by calvinmcm on 5/18/2016.
 */
class BuildNode implements INode {

    private branchIds: string[];

    constructor(private id: string, private data: any) {
        this.data = data;
        this.id = id;
        this.branchIds = [];
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
        this.data[name] = value;
        return this;
    }
    private getAndHasAttribute(get, attr) {

        var val = this.data[attr];

        if(val !== null && val !== undefined){
            if(get)
                return val;
            return true
        }

        if(get)
            return null;
        return false;
    }
    getBranchIds(): string[] {
        return this.branchIds;
    }
    getSpouses(): any[] {
        return [];
    }
    getDisplaySpouse(): INode {
        return this.data['displaySpouse'];
    }
    setDisplaySpouse(node :INode){
        this.data['displaySpouse'] = node;
    }
    isMainPerson(): boolean{
        return this.data['isMain'];
    }
    setMarriageDate(d:string){
        //this.marriagedate = d;
    }
    setBranchIds(ids:string[]){
        this.branchIds = ids;
    }
    getPerson(){
        //??
    }
}