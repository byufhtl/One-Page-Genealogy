function SpacerTree() {
    this.nodeMap = null;
    this.node = null;
    this.highest = 0;
    this.lowest = 0;
}

/**
 * Builds out a spacer tree.
 * @param map a 2D map id => anonymous => properties{x, width, height, box's id, children}
 * @param rootid an id for the root node.
 */
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
    for(var j=0; j<bottomBorder.length; j++) {
        if(bottomBorder[j].y > highest) {
            highest = bottomBorder[j].y;
        }
    }


    this.lowest = lowest;
    this.highest = highest;
    this.nodeMap = nodeMap;

    return nodeMap;
};

/**
 *
 * @param node an anonymous node(really just a property map) with properties:{x, width, height, box's id, children}
 * @returns {*} a SquareNode or MultiNode object.
 */
SpacerTree.prototype.dfsBuild = function(node) {
    var parent = new SquareNode(node.x, node.width, node.height, node.id);

    // Makes sure that there is a "children" property on the node.
    //if(!(node.hasOwnProperty("children"))){
    //    console.log(node);
    //}

    // if no children, return the new Square node
    if(node.children.length == 0) {
        return parent;
    }
    else {
        var childList = [];
        // go through the children
        for(var i=0; i<node.children.length; i++) {
            var child = node.children[i];
            // if the child is missing it's children property, return the parent
            if(!(child.hasOwnProperty("children"))){
                //console.log(child)
                //console.log(i)
                //console.log(node.children)
                return parent;
            }
            // recursively generate the dfs build for the child and push it into the list of children
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
