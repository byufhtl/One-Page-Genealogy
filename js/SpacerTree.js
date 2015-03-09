function SpacerTree() {
  this.nodeMap;
  this.node;
}
SpacerTree.prototype.build = function(map, rootid) {
    var node = this.dfsBuild(map[rootid]);
    var genList = node.getRectangles();
    var nodeMap = this.listToMap(genList);

    this.node = node;
    this.nodeMap = nodeMap;

    return nodeMap;
};
SpacerTree.prototype.dfsBuild = function(node) {
    var parent = new SquareNode(node.x, node.width, node.height, node.id);
    if(node.children.length == 0) {
        return parent;
    }
    else {
        var childList = []
        for(var i=0; i<node.children.length; i++) {
            var child = node.children[i];
            childList.push(this.dfsBuild(child));
        }
        return MultiNode.generate(parent, childList, Math.floor(childList.length/2));
    }
};
SpacerTree.prototype.listToMap = function(list) {
  var map ={};
  for(var i=0; i<list.length; i++) {
    map[list[i].id] = list[i];
  }
  return map;
};
