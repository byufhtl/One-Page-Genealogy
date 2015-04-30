function SpacerTree() {
    this.nodeMap = null;
    this.node = null;
    this.highest = 0;
    this.lowest = 0;
}
SpacerTree.prototype.build = function(map, rootid) {
    var node = this.dfsBuild(map[rootid]);
    var genList = node.getRectangles();
    var nodeMap = this.listToMap(genList);

    this.node = node;
    var topBorder = node.getTopBorder();
    var bottomBorder = node.getBottomBorder();
    var lowest = Number.POSITIVE_INFINITY;
    var highest = Number.NEGATIVE_INFINITY;

    for(var i=0; i<topBorder.length; i++) {
        if(topBorder[i].y < lowest) {
            lowest = topBorder[i].y;
        }
    }
    for(var i=0; i<bottomBorder.length; i++) {
        if(bottomBorder[i].y > highest) {
            highest = bottomBorder[i].y;
        }
    }


    this.lowest = lowest;
    this.highest = highest;
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
