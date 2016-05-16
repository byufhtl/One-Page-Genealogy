/**
 * SquareNode constructor.
 * @param x it's x coordinate depth
 * @param width the square node's width
 * @param height the square node's height
 * @param id the square node's id
 * @constructor sets y to default value of 0
 */
function SquareNode(x, width, height, id) {
  this.x = x;
  this.y = 0;
  this.width = width;
  this.height = height;
  this.id = id;
}

/**
 * Passes back the information about the top line of the box, including the starting x, the ending x, and the y values of both.
 * @returns {*[]}
 */
SquareNode.prototype.getTopBorder = function() {
  return [{x1:this.x, x2:this.x+this.width, y:0}]
};

/**
 * Passes back the information about the bottom line of the box, including the starting x, the ending x, and the y values of both.
 * @returns {*[]}
 */
SquareNode.prototype.getBottomBorder= function() {
  return [{x1:this.x, x2:this.x+this.width, y:this.height}]
};

/**
 * Passes back the height of the box, or rather, 0 and the box's height.
 * @returns {{top: number, bottom: *}}
 */
SquareNode.prototype.getParentBounds= function() {
  return {top:0, bottom:this.height};
};

/**
 * Passes back the x, adjusted y (y + dy), width, height, and id.
 * @param dy added to the y value to get back an adjusted y.
 * @returns {*[]}
 */
SquareNode.prototype.getRectangles = function(dy) {
  return [{x: this.x, y:this.y+dy, width:this.width, height:this.height, id:this.id}];
};

/**
 * MultiNode constructor.
 * @param bounds an object containing the overall height of the box {top :number, bottom :number}
 * @param top the top of the box.
 * @param bottom the bottom of the box.
 * @param children an array of MultiNodes and SingleNodes
 * @constructor y value defaults to 0, parent value defaults to null
 */
function MultiNode(bounds, top, bottom, children) {
    this.top = top;
    this.bottom = bottom;
    this.children = children;
    this.bounds = bounds;
    this.parent = null;
    this.y = 0;
}

MultiNode.prototype.getTopBorder = function() {
    return this.top;
};

MultiNode.prototype.getBottomBorder = function() {
    return this.bottom;
};

/**
 * @returns {{top :number, bottom :number}}
 */
MultiNode.prototype.getParentBounds = function() {
    return this.bounds;
};

/**
 * Generates an array with all of the rectangles from its children nodes, appropriately shifted
 * @param dy The shift to put on all of the rectangles in the generated array.
 * @returns {Array}
 */
MultiNode.prototype.getRectangles = function(dy) {
    if(dy === undefined) {
        dy = this.y;
    }

    var list = [];
    var allChildren = [];

    for(var i=0; i<this.children.length; i++) {
        allChildren = this.children[i].getRectangles(dy + this.y);
        list = list.concat(allChildren);
    }

    if(this.parent) {
        var pRect = this.parent.getRectangles(dy + this.y);
        list = list.concat(pRect);
    }

    return list;
};

/**
 * Generates a MultiNode based on a parent Node, a list of sibling Nodes, and a sibling Node.
 * @param parent a SquareNode
 * @param siblingList a list of children nodes that are a mix of SquareNodes and MultiNodes.
 * @param siblingIndex a starting point that in the only call to this functions currently values Math.floor(siblingList.length/2)
 * @returns {MultiNode}
 */
MultiNode.generate = function(parent, siblingList, siblingIndex) {

    // if only one sibling, merge with one child AND RETURN!
    if(siblingList.length == 1) {
        return MultiNode.mergeOneChild(parent, siblingList[0]);
    }

    // otherwise merge children nodes top to bottom.
    var bottomChild = MultiNode.mergeChildrenTopToBottom(siblingList.slice(siblingIndex, siblingList.length));
    var topChild = MultiNode.mergeChildrenBottomToTop(siblingList.slice(0, siblingIndex));

    bottomChild.bounds = siblingList[siblingIndex].getParentBounds();

    return MultiNode.mergeParentWithChildren(parent, topChild, bottomChild);
};

/**
 * Generates a MultiNode with a single parent and child in it.
 * @param parent
 * @param child
 * @returns {MultiNode}
 */
MultiNode.mergeOneChild = function(parent, child) {
    // Evaluates some digit based on the borders
    var topAndParentCompare = MultiNode.compareBorders2(child.getBottomBorder(), parent.getTopBorder(), Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);

    var mergedTop;
    var mergedBtm;

    // If the evaluation yields negavite infinity
    if(topAndParentCompare == Number.NEGATIVE_INFINITY) {
        // Gets the center y value out of the box.
        var center = (child.getParentBounds().bottom + child.getParentBounds().top)/2;

        // The center height of the child shifted up by half of the parent's height.
        var bestparent = center - parent.height/2;

        mergedTop = MultiNode.mergeList(child.getTopBorder(),       parent.getTopBorder(),      0,              bestparent,     1 );
        mergedBtm = MultiNode.mergeList(parent.getBottomBorder(),   child.getBottomBorder(),    bestparent,     0,              -1);

        parent.y = bestparent;
    }
    else {
          mergedTop = MultiNode.mergeList(child.getTopBorder(), parent.getTopBorder(), 0, topAndParentCompare, 1);
          mergedBtm = MultiNode.mergeList(parent.getBottomBorder(), child.getBottomBorder(), topAndParentCompare, 0, -1);

          parent.y = topAndParentCompare;
    }

    child.y = 0;

    var generated =  new MultiNode({top: parent.y, bottom: parent.y+parent.height}, mergedTop, mergedBtm, [child]);
    generated.parent = parent;
    return generated;
};

MultiNode.mergeParentWithChildren = function(parent, topChild, bottomChild) {

  var topAndParentCompare = MultiNode.compareBorders2(topChild.getBottomBorder(), parent.getTopBorder(), Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
  var btmAndParentCompare = MultiNode.compareBorders2(parent.getBottomBorder(), bottomChild.getTopBorder(), Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
  var topAndBtmCompare = MultiNode.compareBorders2(topChild.getBottomBorder(), bottomChild.getTopBorder(), topChild.getParentBounds().bottom, bottomChild.getParentBounds().top);

  var mergedTop;
  var mergedBtm;
  if(topAndParentCompare == Number.NEGATIVE_INFINITY) {
    if(btmAndParentCompare == Number.NEGATIVE_INFINITY) {

      //var dif = topAndBtmCompare - (topChild.getParentBounds().bottom - bottomChild.getParentBounds().top);

      var btmY = bottomChild.getParentBounds().top + topAndBtmCompare;
      var topY = topChild.getParentBounds().bottom;

      var bestparent = (btmY+topY)/2 - parent.height/2;

      mergedTop = MultiNode.mergeList(topChild.getTopBorder(), parent.getTopBorder(), 0, bestparent, 1);
      mergedBtm = MultiNode.mergeList(parent.getBottomBorder(), topChild.getBottomBorder(), bestparent, 0, -1);

      mergedTop = MultiNode.mergeList(mergedTop, bottomChild.getTopBorder(), 0, topAndBtmCompare, -1);
      mergedBtm = MultiNode.mergeList(bottomChild.getBottomBorder(), mergedBtm, topAndBtmCompare, 0, 1);

      parent.y = bestparent;
      topChild.y = 0;
      bottomChild.y = topAndBtmCompare;
    }
    else {
      mergedTop = MultiNode.mergeList(parent.getTopBorder(), bottomChild.getTopBorder(), 0, btmAndParentCompare, 1);
      mergedBtm = MultiNode.mergeList(bottomChild.getBottomBorder(), parent.getBottomBorder(), btmAndParentCompare, 0, -1);

      mergedTop = MultiNode.mergeList(topChild.getTopBorder(), mergedTop, 0, topAndBtmCompare-btmAndParentCompare, 1);
      mergedBtm = MultiNode.mergeList(mergedBtm, topChild.getBottomBorder(), topAndBtmCompare-btmAndParentCompare, 0, -1);

      parent.y = topAndBtmCompare-btmAndParentCompare;
      topChild.y = 0;
      bottomChild.y = topAndBtmCompare;
    }
  }
  else {
    var extra = 0;
    var space = 0;
    if(btmAndParentCompare != Number.NEGATIVE_INFINITY) {
      var spare = topAndParentCompare + btmAndParentCompare - topAndBtmCompare;
      if(spare > 0 ) {
        extra = spare;
      }
      else{
        space = -spare/2;
      }
    }


    if(btmAndParentCompare == Number.NEGATIVE_INFINITY) {
      space = Math.max(topAndParentCompare, topAndBtmCompare-parent.height/2) - topAndParentCompare;
    }

    mergedTop = MultiNode.mergeList(topChild.getTopBorder(), parent.getTopBorder(), 0, topAndParentCompare + space, 1);
    mergedBtm = MultiNode.mergeList(parent.getBottomBorder(), topChild.getBottomBorder(), topAndParentCompare + space, 0, -1);


    mergedTop = MultiNode.mergeList(mergedTop, bottomChild.getTopBorder(), 0, topAndBtmCompare + extra, -1);
    mergedBtm = MultiNode.mergeList(bottomChild.getBottomBorder(), mergedBtm, topAndBtmCompare + extra, 0, 1);

    parent.y = topAndParentCompare+space;
    topChild.y = 0;
    bottomChild.y = topAndBtmCompare + extra;
  }

  var generated =  new MultiNode({top: parent.y, bottom: parent.y+parent.height}, mergedTop, mergedBtm, [topChild, bottomChild]);
  generated.parent = parent;
  return generated;
};

MultiNode.mergeChildrenBottomToTop = function(siblingList) {
  var node = MultiNode.mergeChildrenTopToBottom(siblingList);
  var bounds = siblingList[siblingList.length-1].getParentBounds();
  bounds.top += siblingList[siblingList.length-1].y;
  bounds.bottom += siblingList[siblingList.length-1].y;
  node.bounds = bounds;
  return node;
};

MultiNode.mergeChildrenTopToBottom = function(siblingList) {
  var prev = siblingList[0];
  prev['y'] = 0;
  var prevTop = prev.getTopBorder();
  var prevBtm = prev.getBottomBorder();
  var compareSum = 0;
  for(var i=1; i<siblingList.length; i++) {
    var next = siblingList[i];

    compareSum = MultiNode.compareBorders2(prevBtm, next.getTopBorder(), prev.getParentBounds().bottom + compareSum, next.getParentBounds().top);

    next['y'] = compareSum;

    var mergedTop = MultiNode.mergeList(prevTop, next.getTopBorder(), 0, compareSum, 1);
    var mergedBtm = MultiNode.mergeList(next.getBottomBorder(), prevBtm, compareSum, 0, -1);
    prev = next;
    prevTop = mergedTop;
    prevBtm = mergedBtm;
  }

  var largestBtm = Number.NEGATIVE_INFINITY;
  for(var j=0; j<prevBtm.length; j++) {
    if(prevBtm[j].y > largestBtm) {
      largestBtm = prevBtm[j].y;
    }
  }

  var smallestTop = Number.POSITIVE_INFINITY;
  for(var k=0; k<prevTop.length; k++) {
    if(prevTop[k].y < smallestTop) {
      smallestTop = prevTop[k].y;
    }
  }


  var bounds = siblingList[0].getParentBounds();
  bounds.top += siblingList[0].y;
  bounds.bottom += siblingList[0].y;
  return new MultiNode(bounds, prevTop, prevBtm, siblingList);
};

/**
 *
 * @param topList The border that is higher up on the screen.
 * @param bottomList The border that is lower down on the screen.
 * @param maxTop -oo
 * @param minBtm +oo
 * @returns {number}
 */
MultiNode.compareBorders2 = function(topList, bottomList, maxTop, minBtm) {
    var topIndex = 0;
    var bottomIndex = 0;
    var lowest;

    lowest = Number.NEGATIVE_INFINITY;

    // Starting at 0, both lists of borders are moved through.
    while(topIndex < topList.length && bottomIndex < bottomList.length) {

        var t = topList[topIndex];
        var b = bottomList[bottomIndex];

        //The commented section will prevent the children from passing past the center node,
        //with the comments it will stop when parent line up

        // if the bottom border and the top border have overlapping x ranges, lowest rises to be the difference in their y's
        if(b.x1 < t.x2 && b.x2 > t.x1) {
            // var dy1 = Math.max(t.y, maxTop) - b.y;
            // var dy2 = t.y - Math.min(b.y, minBtm);
            // var dy = Math.max(dy1, dy2);
            var dy = t.y - b.y;
            if(dy > lowest) {
              lowest = dy;
            }
        }
        else {
            // var dy1 = maxTop - b.y;
            // var dy2 = t.y - minBtm;
            // var dy = Math.max(dy1, dy2);
            // if(dy > lowest) {
            //   lowest = dy;
            // }
        }

        var hit = false;

        // if the top ends left of the bottom, raise the top index.
        if((t.x2 <= b.x2)) {
            hit = true;
            topIndex++;
        }
        if((b.x2 != null) && ((b.x2 <= t.x2) || (t.x2 == null))) {
            hit = true;
            bottomIndex++;
        }

        // These comments are purely experimental. If you see them, you can probably nix them.
        if(!hit){
            console.log("\t\t",JSON.stringify(t), JSON.stringify(b),t.x2.toString(), b.x2.toString(), topIndex, bottomIndex);
            topIndex++;
            //bottomIndex++;
        }
    }
    return Math.max(lowest, maxTop-minBtm);
};

/**
 *
 * @param priority The border line to prefer and rewrite
 * @param secondary The border line whose values are sorted and then shifted.
 * @param pdy
 * @param sdy
 * @param sortOrder
 * @returns {*}
 */
MultiNode.mergeList = function(priority, secondary, pdy, sdy, sortOrder) {
    // offset all of the y values.
    for(var i=0; i<priority.length; i++) {
        priority[i].y += pdy;
    }

    // sorts the second array based on sortOrder
    /*
        If sortOrder is positive, then the low y's go to the front.
        If sortOrder is negative, then the high y's move to the front of the array.
     */
    secondary.sort(function(a,b) {
        if(a.y == b.y) {
            return 0;
        }
        if(a.y > b.y) {
            return sortOrder;
        }
        return -sortOrder;
    });

    // Puts the lines back into the priority in order from largest x1 to smallest
    for(var j=0; j<secondary.length; j++) {
        var l = secondary[j];
        priority = MultiNode.addLine(priority, l.x1, l.x2, l.y+sdy)
    }

    return priority;
};

/**
 *
 * @param list [{} :border]
 * @param x1 the x1 to use in creating and appending a new border line.
 * @param x2 the x2 to use in creating and appending a new border line.
 * @param y the y to use in creating and appending a new border line.
 * @returns {Array}
 */
MultiNode.addLine = function(list, x1, x2, y) {

    // Check that the end point and the beginning point do not coincide.
    if(x1 >= x2) {
      console.log("invalid line");
      return list;
    }

    var finished = false;
    var newList = [];

    // Goes through all of the existing border lines
    for(var i = 0; i<list.length; i++) {

        var l = list[i];

        // another check for a bad border line
        if(x2 - x1 <= 0) {
            finished = true;
            break;
        }

        // if the given x1 and x2 both extend out to create a line longer than the previous lines
        if(x1 <= l.x2 && x2 >= l.x1) {
            // if the new line has an x1 longer back than previously had, the new list gets an entry
            if(x1 < l.x1) {
                newList.push({x1:x1, x2:l.x1, y:y});
            }
            // if the new line has an x2 that extends past the old one, use x1 to hold the old x2 data
            if(x2 > l.x2) {
                x1 = l.x2;
            }
            else {
                finished = true;
                break;
            }
        }
    }
    // If the loop terminated without finding a longer line and the new line is valid, push the new line onto the list end.
    // If the x2 value was out farther than the old x2 values in the previous block, a short little line will be added
    // to bridge the distance.
    if(!finished && x2 - x1 > 0) {
        newList.push({x1:x1, x2:x2, y:y});
    }

    //This sorting could be on the fly while,
    //but this is just a lazy man's
    //first run through the algorithm

    // the old list goes onto the end of the new list.
    newList = newList.concat(list);

    // the lines with high x1 values are sorted to the front.
    newList.sort(function(a,b) {
      if(a.x1 == b.x1) {
        return 0;
      }
      if(a.x1 > b.x1) {
        return 1;
      }
      return -1;
    });

    // the new list is returned.
    return newList;
};
