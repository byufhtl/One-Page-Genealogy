///<reference path="../model/INode.ts"/>
/**
 * Created by krr428 on 3/7/15.
 */

class FakeNode implements INode {

    branchIds: {[id: string]: boolean; } = {};

    constructor(public id: string) {

    }

    getId(): string {
        return this.id;
    }

    getAttr(key: string): any {
        return null;
    }

    hasAttr(key: string): boolean {
        return false;
    }

    getBranchIds(): string[] {
        return [];
    }

    addBranchId(id: string): void {
        this.branchIds[id] = true;
    }
}