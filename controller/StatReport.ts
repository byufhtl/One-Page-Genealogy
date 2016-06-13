///<reference path="BoxMap.ts"/>
///<reference path="../sources/TNode.ts"/>
/**
 * Created by calvinmcm on 6/8/16.
 * Manages all of the statistics for the tree for users to see.
 */

class StatReport{

//[][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][]
//                                                  PUBLIC
//[][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][]

    constructor(boxMap: BoxMap, generations: number, direction: string){
        console.log("Report generating.");
        this.maleCount = 0;
        this.femaleCount = 0;
        this.nodeCount = 0;

        var root = boxMap.getRoot();
        if(root) {
            var queue = [];
            queue.push([root,0]);

            while (queue.length > 0) {
                var entity = queue.shift();
                var id = entity[0];
                var box = boxMap.getId(id);
                if(box){
                    ++this.nodeCount;
                    var node = box.getNode();
                    var generation = entity[1];

                    this.evaluateGender(node);

                    var branchIds = node.getBranchIds();

                    // Certain statistics only matter in ascendancy
                    if (direction == "ascendancy") {
                        //TODO number missing one parent
                        //TODO number missing both parents
                        this.processAsAscendant(box, node, boxMap, (generation + 1 < generations));

                        // Moved inside since Descendancy calculates who gets put in in a different manner.
                        for(var branch of branchIds){
                            if(generation < generations) {
                                queue.push([branch, generation + 1]);
                            }
                        }
                    }

                    // For the descendancy-only statistics
                    if (direction == "descendancy") {
                        this.processAsDescendant(box, node, boxMap, !(generation + 1 < generations), queue, generation);
                    }
                }
            }

            // Certain statistics only matter in ascendancy
            if(direction == "ascendancy"){
                let total = Math.pow(2,generations) - 1;
                this.percentFull = this.roundStat((this.nodeCount*100/total));
                this.averageSpouseCount = this.roundStat(this.spouseCount/this.spouseUnitCount);
                this.averageNumParents = this.roundStat(this.childCount/this.childUnitCount);
                this.averageFamilySize = null;
            }

            // For the descendancy-only statistics
            if(direction == "descendancy"){
                let total = Math.pow(4,generations) - 1;
                this.percentFull = this.roundStat((this.nodeCount*100/total));
                this.averageSpouseCount = this.roundStat(this.spouseCount/this.spouseUnitCount);
                this.averageFamilySize = this.roundStat(this.childCount/this.childUnitCount, 2);
                this.averageNumParents = null;
            }

            this.percentFull = (this.percentFull > 100) ? 100 : this.percentFull;

            // TODO PUT THESE THINGS INTO THE STATS REPORT.
        }
    }

    getNodeCount(): number{
        return this.nodeCount;
    }

    getPercentMale(): number{
        return(this.roundStat(this.maleCount*100/this.nodeCount));
    }

    getPercentFemale(): number{
        return(this.roundStat(this.femaleCount*100/this.nodeCount));
    }

    getPercentUnknown(): number{
        return(this.roundStat((this.nodeCount - this.femaleCount - this.maleCount)*100/this.nodeCount));
    }

    getEstimatedPercentFull(): number{
        return this.percentFull;
    }

    getAvgFamilySize(): number{
        return this.averageFamilySize;
    }

    getAvgSpouses(): number{
        return this.averageSpouseCount;
    }

    getAvgNumParents(): number{
        return this.averageNumParents;
    }

    getMostCommonName(): string{
        return this.mostCommonName;
    }

    createCommentTagByPercentage(percent, top_down: boolean){
        var rank: number = top_down ? percent : (100-percent);
        var tag: Element = $('<span class="label label-default" style="margin-left: 4px;"></span>');
        if(rank < 10){
            tag = $('<span class="label label-danger" style="margin-left: 4px;">Poor</span>');
            //tag.text('Poor');
        }
        else if(rank < 50){
            tag = $('<span class="label label-warning" style="margin-left: 4px;">Fair</span>');
        }
        else if(rank < 75){
            tag = $('<span class="label label-primary" style="margin-left: 4px;">Good</span>');

        }
        else if(rank < 90){
            tag = $('<span class="label label-info" style="margin-left: 4px;">Great</span>');

        }
        else if(rank <= 100){
            tag = $('<span class="label label-success" style="margin-left: 4px;">Excellent</span>');
        }
        return tag;
    }

    createStatRow(title: string, content: any, unit: string, appendage: Element = null){
        var row = $('<div class="row stat-row"></div>');
        var rowTitle = $('<div class="col-sm-5" style="text-align: right;"></div>');
        var rowContent = $('<div class="col-sm-4"  style="text-align: left;"></div>');
        var rowTag = $('<div class="col-sm-3"  style="text-align: left;"></div>');

        content = (<string>content);
        if(unit && unit != ""){content += " " + unit;}

        rowTitle.append(title);
        rowContent.append(content);
        if(appendage){
            rowTag.append(appendage);
        }
        row.append(rowTitle, rowContent, rowTag);
        return row;
    }


//[][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][]
//                                                  PRIVATE
//[][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][]

    private nodeCount: number;
    private maleCount: number;
    private femaleCount: number; // These two are sufficient to calculate the percentUnknown
    private percentFull: number;
    private averageFamilySize: number;
    private averageSpouseCount: number;
    private averageNumParents: number;
    private mostCommonName: string;

    private evaluateGender(node: INode){
        if(node.hasAttr("gender")){
            var gender = node.getAttr("gender");
            if(gender == "Male"){
                ++this.maleCount;
            }
            else if(gender == "Female"){
                ++this.femaleCount;
            }
        }
    }

    private roundStat(x: number, places: number = 2): number{
        var factor = 10*places;
        return Math.floor(x*factor)/factor;
    }

    private spouseCount: number = 0;
    private spouseUnitCount: number = 0;
    private childCount: number = 0;
    private childUnitCount: number = 0;

    private processAsAscendant(box: IBox, node: INode, boxMap: BoxMap, lastGen: boolean): void{
        let spouses= node.getSpouses().length;
        var children = node.getBranchIds().length; // Inaccurate because last generation doesn't carry parents...

        this.spouseCount += spouses;
        ++this.spouseUnitCount;

        // Last generation has no children, so preserve the stat from warping.
        if(!lastGen) {
            this.childCount += children;
            ++this.childUnitCount;
        }
    }

    private processAsDescendant(box: IBox, node: INode, boxMap: BoxMap, lastGen: boolean, queue, currGen): void{

        let spouses = node.getSpouses().length;
        var children = 0;
        if (spouses > 1) {
            var mimics = node.getBranchIds();
            for (var i = 0; i < mimics.length; ++i) {
                var individual = boxMap.getId(mimics[i]);
                if (individual) {
                    var trueChildren = individual.getNode().getBranchIds();
                    children += trueChildren.length;
                    for(var j = 0; j < trueChildren.length; ++j){
                        queue.push([trueChildren[j],currGen + 1]);
                    }
                }
            }
        }
        else {
            var trueChildren = node.getBranchIds();
            children += trueChildren.length;
            for(var j = 0; j < trueChildren.length; ++j){
                queue.push([trueChildren[j],currGen + 1]);
            }
        }

        this.spouseCount += spouses;
        ++this.spouseUnitCount;

        // Last generation has no children, so preserve the stat from warping.
        if(!lastGen) {
            this.childCount += children;
            ++this.childUnitCount;
        }
    }
}