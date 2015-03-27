///<reference path="../model/IBox.ts"/>

class BoxMap {
    private map: {[s:string]: IBox};
    private rootId: string;
    constructor(rootId: string) {
        this.rootId = rootId;
        this.map = {};
    }
    getRoot(): string {
        return this.rootId;
    }
    getId(id: string): IBox{
        return this.map[id];
    }
    setId(id: string, box: IBox) {
        this.map[id] = box;
    }
    removeId(id: string) {
        delete this.map[id];
    }
}