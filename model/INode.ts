/**
 * Created by curtis on 3/7/15.
 */
interface INode {
    getId(): string;
    getAttr(key: string): any;
    hasAttr(key: string): boolean;
    setAttr(name: string, value: any): INode;
    getBranchIds(): string[];
    getSpouses():any[];
    getDisplaySpouse():INode;
    setDisplaySpouse(node: INode);
    isMainPerson():boolean;
    setMarriageDate(d:string);
    setBranchIds(ids:string[]): void;
    getPerson();
}

