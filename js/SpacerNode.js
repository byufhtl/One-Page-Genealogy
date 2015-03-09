

function SquareNode(x, width, height, id) {
  this.x = x;
  this.y = 0;
  this.width = width;
  this.height = height;
  this.id = id;
}
SquareNode.prototype.getTopBorder = function() {
  return [{x1:this.x, x2:this.x+this.width, y:0}]
}
SquareNode.prototype.getBottomBorder= function() {
  return [{x1:this.x, x2:this.x+this.width, y:this.height},]
}
SquareNode.prototype.getParentBounds= function() {
  return {top:0, bottom:this.height};
}
SquareNode.prototype.getRectangles = function(dy) {
  return [{x: this.x, y:this.y+dy, width:this.width, height:this.height, id:this.id}];
}
SquareNode.prototype.isSquare = function() {
  return true;
}

function MultiNode(bounds, top, bottom, children) {
  this.top = top;
  this.bottom = bottom;
  this.children = children;
  this.bounds = bounds;
  this.rectangle = {};
  this.parent = null;
  this.y = 0;
}
MultiNode.prototype.getTopBorder = function() {
  return this.top;
}
MultiNode.prototype.getBottomBorder = function() {
  return this.bottom;
}
MultiNode.prototype.getParentBounds = function() {
  return this.bounds;
}
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
}
MultiNode.prototype.isSquare = function() {
  return false;
}
MultiNode.generate = function(parent, siblingList, siblingIndex) {


  var topChild
  if(siblingList.length == 1) {
    return MultiNode.mergeOneChild(parent, siblingList[0]);
  }
  else {
    var bottomChild = MultiNode.mergeChildrenTopToBottom(siblingList.slice(siblingIndex, siblingList.length));
    topChild = MultiNode.mergeChildrenBottomToTop(siblingList.slice(0, siblingIndex));
  }

  bottomChild.bounds = siblingList[siblingIndex].getParentBounds();

  return MultiNode.mergeParentWithChildren(parent, topChild, bottomChild);
}
MultiNode.mergeOneChild = function(parent, child) {
  var topAndParentCompare = MultiNode.compareBorders2(child.getBottomBorder(), parent.getTopBorder(), Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
  if(topAndParentCompare == Number.NEGATIVE_INFINITY) {
    var center = (child.getParentBounds().bottom + child.getParentBounds().top)/2;

    var bestparent = center - parent.height/2;

    mergedTop = MultiNode.mergeList(child.getTopBorder(), parent.getTopBorder(), 0, bestparent, 1);
    mergedBtm = MultiNode.mergeList(parent.getBottomBorder(), child.getBottomBorder(), bestparent, 0, -1);

    parent.y = bestparent;
    child.y = 0;
  }
  else {
    mergedTop = MultiNode.mergeList(child.getTopBorder(), parent.getTopBorder(), 0, topAndParentCompare, 1);
    mergedBtm = MultiNode.mergeList(parent.getBottomBorder(), child.getBottomBorder(), topAndParentCompare, 0, -1);

    parent.y = topAndParentCompare;
    child.y = 0;
  }

  var generated =  new MultiNode({top: parent.y, bottom: parent.y+parent.height}, mergedTop, mergedBtm, [child]);
  generated.parent = parent;
  return generated;
}
MultiNode.mergeParentWithChildren = function(parent, topChild, bottomChild, siblingList) {

  var topAndParentCompare = MultiNode.compareBorders2(topChild.getBottomBorder(), parent.getTopBorder(), Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
  var btmAndParentCompare = MultiNode.compareBorders2(parent.getBottomBorder(), bottomChild.getTopBorder(), Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
  var topAndBtmCompare = MultiNode.compareBorders2(topChild.getBottomBorder(), bottomChild.getTopBorder(), topChild.getParentBounds().bottom, bottomChild.getParentBounds().top);

  var mergedTop;
  var mergedBtm;
  if(topAndParentCompare == Number.NEGATIVE_INFINITY) {
    if(btmAndParentCompare == Number.NEGATIVE_INFINITY) {

      var dif = topAndBtmCompare - (topChild.getParentBounds().bottom - bottomChild.getParentBounds().top);

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
      spare = topAndParentCompare + btmAndParentCompare - topAndBtmCompare;
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

}
MultiNode.mergeChildrenBottomToTop = function(siblingList) {
  var node = MultiNode.mergeChildrenTopToBottom(siblingList);
  var bounds = siblingList[siblingList.length-1].getParentBounds();
  bounds.top += siblingList[siblingList.length-1].y;
  bounds.bottom += siblingList[siblingList.length-1].y;
  node.bounds = bounds;
  return node;
}
MultiNode.mergeChildrenTopToBottom = function(siblingList) {
  var prev = siblingList[0];
  prev['y'] = 0;
  var prevTop = prev.getTopBorder();
  var prevBtm = prev.getBottomBorder();
  compareSum = 0;
  compareSum2 = 0;
  for(var i=1; i<siblingList.length; i++) {
    var next = siblingList[i];

    var compare = MultiNode.compareBorders2(prevBtm, next.getTopBorder(), prev.getParentBounds().bottom + compareSum, next.getParentBounds().top);

    compareSum = compare;

    next['y'] = compareSum;

    mergedTop = MultiNode.mergeList(prevTop, next.getTopBorder(), 0, compareSum, 1);
    mergedBtm = MultiNode.mergeList(next.getBottomBorder(), prevBtm, compareSum, 0, -1);
    prev = next;
    prevTop = mergedTop;
    prevBtm = mergedBtm;
  }

  largestBtm = Number.NEGATIVE_INFINITY;
  for(var i=0; i<prevBtm.length; i++) {
    if(prevBtm[i].y > largestBtm) {
      largestBtm = prevBtm[i].y;
    }
  }

  smallestTop = Number.POSITIVE_INFINITY;
  for(var i=0; i<prevTop.length; i++) {
    if(prevTop[i].y < smallestTop) {
      smallestTop = prevTop[i].y;
    }
  }


  var bounds = siblingList[0].getParentBounds();
  bounds.top += siblingList[0].y;
  bounds.bottom += siblingList[0].y;
  return new MultiNode(bounds, prevTop, prevBtm, siblingList);
}
MultiNode.compareBorders2 = function(topList, bottomList, maxTop, minBtm) {
  var topIndex = 0;
  var bottomIndex = 0;
  var lowest;

  lowest = Number.NEGATIVE_INFINITY;


  while(topIndex < topList.length && bottomIndex < bottomList.length) {

    var t = topList[topIndex];
    var b = bottomList[bottomIndex];

    //The commented section will prevent the children from passing past the center node,
    //with the comments it will stop when parent line up

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
    if(t.x2 <= b.x2) {
      topIndex++;
    }
    if(b.x2 <= t.x2) {
      bottomIndex++;
    }
  }
  return Math.max(lowest, maxTop-minBtm);
}
MultiNode.mergeList = function(priority, secondary, pdy, sdy, sortOrder) {
  for(var i=0; i<priority.length; i++) {
    priority[i].y += pdy;
  }
  secondary.sort(function(a,b) {
    if(a.y == b.y) {
      return 0;
    }
    if(a.y > b.y) {
      return sortOrder;
    }
    return -sortOrder;
  });
  for(var i=0; i<secondary.length; i++) {
    var l = secondary[i];
    priority = MultiNode.addLine(priority, l.x1, l.x2, l.y+sdy)
  }
  return priority;
}
MultiNode.addLine = function(list, x1, x2, y) {
    if(x1 >= x2) {
      console.log("invalid line");
      return;
    }
    var finished = false;
    var newList = [];
    for(var i = 0; i<list.length; i++) {
      var l = list[i];
      if(x2 - x1 <= 0) {
        finished = true;
        break;
      }
      if(x1 <= l.x2 && x2 >= l.x1) {
        if(x1 < l.x1) {
          newList.push({x1:x1, x2:l.x1, y:y});
        }
        if(x2 > l.x2) {
          x1 = l.x2;
        }
        else {
          finished = true;
          break;
        }
      }
    }
    if(!finished && x2 - x1 > 0) {
      newList.push({x1:x1, x2:x2, y:y});
    }

    //This sorting could be on the fly while,
    //but this is just a lazy man's
    //first run through the algorithm
    newList = newList.concat(list);
    newList.sort(function(a,b) {
      if(a.x1 == b.x1) {
        return 0;
      }
      if(a.x1 > b.x1) {
        return 1;
      }
      return -1;
    });
    return newList;

}
