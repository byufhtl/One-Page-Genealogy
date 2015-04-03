/**
 * Created by curtis on 3/16/15.
 */
class FSPerson {
    constructor(private id: string, private person, private ascBranchIds: string[], private dscBranchIds: string[] ) {

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

}