///<reference path="ICommand.ts"/>
/**
 * Created by curtis on 3/31/15.
 */
class Command implements ICommand {
    constructor(private type: string, private value: any){
        //
    }
    getType(): string {
        return this.type;
    }
    getValue(): any {
        return this.value;
    }

}
