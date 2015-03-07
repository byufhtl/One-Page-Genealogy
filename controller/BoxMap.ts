///<reference path="../model/IBox.ts"/>
interface BoxMap {
    getRoot(): string;
    getId(id: string): IBox;
}