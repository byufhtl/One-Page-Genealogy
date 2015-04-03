/**
 * Created by curtis on 3/31/15.
 */
interface ICommand {
    getType(): string;
    getValue(): any;
}