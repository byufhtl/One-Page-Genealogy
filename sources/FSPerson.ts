/**
 * Created by curtis on 3/16/15.
 */
class FSPerson {
    public helpParents;
    constructor(private id: string, private person, private ascBranchIds: string[], private dscBranchIds: string[],
                private spouses: any[], private isMain: boolean ) {

    }
    getDscBranchIds(): string[] {
        return this.dscBranchIds;
    }
    getAscBranchIds(): string[] {
        return this.ascBranchIds;
    }
    getPerson(): any {
        return this.person;
    }
    getId(): string {
        return this.id;
    }
    getSpouses(): any[] {
        return this.spouses;
    }
    isMainPerson(): boolean{
        return this.isMain;
    }

}