///<reference path="../model/INode.ts"/>
///<reference path="../js/jsDeclarations.ts"/>
///<reference path="ImageLoader.ts"/>

/**
 * Created by curtis on 3/16/15.
 */
class BuildNode implements INode {

    constructor(private id: string, private data: any) {
        this.data = data;
        this.id = id;
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
        return [];
    }
    getSpouses(): any[] {
        return [];
    }
    getDisplaySpouse(): INode {
        return this.data['displaySpouse'];
    }
    isMainPerson(): boolean{
        return this.data['isMain'];
    }
    setMarriageDate(d:string){
        //this.marriagedate = d;
    }
    setBranchIds(is:string[]){
        //do nothing for now.
    }
    getPerson(){
        //??
    }
}