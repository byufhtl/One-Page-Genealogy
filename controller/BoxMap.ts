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
    //Copies the contents from this map to the boxes
    copyContents(boxes: BoxMap): void {
        for(var key in this.map) {
            if(this.map.hasOwnProperty(key)) {
                console.log(this.map[key].getNode().getId()+" "+boxes.getId(key).getNode().getId());
                this.map[key].copyContents(boxes.getId(key));
            }
        }
        //for(var key in boxes.map) {
        //    if(boxes.map.hasOwnProperty(key) && !this.map.hasOwnProperty(key)) {
        //        boxes.removeId(key);
        //    }
        //}
    }
}