///<reference path="../model/IBox.ts"/>
///<reference path="../model/AbstractBox.ts"/>
///<reference path="../sources/UploadNode.ts"/>


declare var accessToken;

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
    getMap(): {[s:string]: IBox} {
        return this.map;
    }

    deserializeMap(map: {[s:string]: any}) {
        var resultMap: {[s:string]: IBox} = {};

        for(var key in map){
            if(map.hasOwnProperty(key)){
                var box = map[key];

                let spouse = box.node.displaySpouse;

                var s_node :INode = null;

                if(spouse){
                    s_node = new UploadNode(spouse.id, spouse.person, spouse.display, [], null, false);
                }

                var node :INode = new UploadNode(box.node.id, box.node.person,
                    box.node.branchIds, box.node.spouses, s_node, box.node.isMain);

                var tempBox = new AbstractBox(node);
                tempBox.setType(box.type);
                tempBox.setColor(box.color);
                tempBox.setHeight(box.h);
                tempBox.setWidth(box.w);
                tempBox.setSpace(box.space);
                tempBox.setX(box.x);
                tempBox.setY(box.y);

                resultMap[key] = tempBox;
            }
        }
        this.map = resultMap;
    }

    //old_deserializeMap(map: {[s:string]: any}) {
    //
    //    //promise for-loop
    //    var promiseFor = Promise.method(function(condition, action, value) {
    //        if (!condition(value)) return value;
    //        return action(value).then(promiseFor.bind(null, condition, action));
    //    });
    //
    //    var resultMap: {[s:string]: IBox} = {};
    //
    //    var keys = [];
    //    for(var key in map){
    //        if(map.hasOwnProperty(key)){
    //            keys.push(key);
    //        }
    //    }
    //
    //    var self = this;
    //
    //    return promiseFor(function(count) {
    //        return count < keys.length;
    //    }, function(count) {
    //        return FamilySearch.getPerson(keys[count].substr(0,8))
    //            .then(function(response) {
    //                var box = map[keys[count]];
    //                var tempBox = new AbstractBox(new FSDescNode(box.node.id, response.getPerson(),
    //                    box.node.branchIds, box.node.spouses, box.node.displaySpouse, box.node.isMain));
    //                tempBox.setType(box.type);
    //                tempBox.setColor(box.color);
    //                tempBox.setHeight(box.h);
    //                tempBox.setWidth(box.w);
    //                tempBox.setSpace(box.space);
    //                tempBox.setX(box.x);
    //                tempBox.setY(box.y);
    //
    //                resultMap[keys[count]] = tempBox;
    //
    //                return ++count;
    //            });
    //    }, 0).then(function() {
    //            console.log('all done');
    //            //console.log(resultMap);
    //            self.map = resultMap;
    //        }
    //    );
    //}
    getId(id: string): IBox{
        return this.map[id];
    }
    setId(id: string, box: IBox) {
        this.map[id] = box;
    }
    removeId(id: string) {
        delete this.map[id];
        for(var key in this.map){
            var branchIds = this.map[key].getNode().getBranchIds();
            var index = branchIds.indexOf(id);
            if(index != -1){
                branchIds.splice(index,1);
            }
        }
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
                //console.log(this.map[key].getNode().getId()+" "+boxes.getId(key).getNode().getId());
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