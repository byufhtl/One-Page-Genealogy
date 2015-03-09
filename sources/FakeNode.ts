///<reference path="../model/INode.ts"/>
/**
 * Created by krr428 on 3/7/15.
 */

class FakeNode implements INode {

    branchIds: string[];

    constructor(public id: string) {
        this.branchIds = [];
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
        return this.branchIds;
    }

    addBranchId(id: string): void {
        this.branchIds.push(id);
    }
}