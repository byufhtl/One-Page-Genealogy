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
        var totalSpouses = 0;

        var root = boxMap.getRoot();
        if(root) {
            var queue = [root];

            while (queue.length > 0) {
                ++this.nodeCount;
                var id = queue.shift();
                var box = boxMap.getId(id);
                var node = box.getNode();

                this.evaluateGender(node);

                var branchIds = node.getBranchIds();

                for(var branch of branchIds){
                    queue.push(branch);
                }

                // Certain statistics only matter in ascendancy
                if(direction == "ascendancy"){
                    //TODO number missing one parent
                    //TODO number missing both parents
                }

                // For the descendancy-only statistics
                if(direction == "descendancy"){
                    //TODO average number of children
                    //TODO average family size
                }
            }

            // Certain statistics only matter in ascendancy
            if(direction == "ascendancy"){
                //TODO percent full (totalNodes compared to a full tree with that many generations
            }

            // For the descendancy-only statistics
            if(direction == "descendancy"){

            }
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

    getEstimatedPercentFull(direction: string): number{
        return this.percentFull;
    }

    getAvgFamilySize(): number{
        return this.averageFamilySize;
    }

    getAvgSpouses(): number{
        return this.averageSpouseCount;
    }

    getMostCommonName(): string{
        return this.mostCommonName;
    }

    createStatRow(title: string, content: any, unit: string = null){
        var row = $('<div class="row stat-row"></div>');
        var rowTitle = $('<div class="col-sm-3"></div>');
        var rowContent = $('<div class="col-sm-9"></div>');

        content = (<string>content);
        if(unit){content += " " + unit;}

        rowTitle.append(title);
        rowContent.append(content);
        row.append(rowTitle, rowContent);
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

}