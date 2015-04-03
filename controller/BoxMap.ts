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
    copy(): BoxMap {
        var newMap: BoxMap = new BoxMap(this.rootId);
        for(var key in this.map) {
            if(this.map.hasOwnProperty(key)) {
                newMap.setId(key, this.map[key].copy());
            }
        }
        return newMap;
    }
    copyContents(boxes: BoxMap): void {
        for(var key in this.map) {
            if(this.map.hasOwnProperty(key)) {
                this.map[key].copyContents(boxes.getId(key));
            }
        }
    }
}