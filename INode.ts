/**
 * Created by curtis on 3/7/15.
 */
interface INode {
    getId():string;
    getAttr(key:string):any;
    hasAttr(key:string):boolean;
    getBranchIds():string[];
}
