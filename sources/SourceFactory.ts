///<reference path="FSAncestryDownloader.ts"/>
///<reference path="FSFullTreeDownloader.ts"/>
///<reference path="GedcomDownloader.ts"/>
/**
 * Created by calvinmcm on 6/8/16.
 */

class SourceFactory{
    constructor(opts: string[] = []){}

    makeSource(data: any, rootId: string): ISource{
        let source = null;
        var generations:number = data.generations;
        if (data.hasOwnProperty("gedData")) {
            var attemptGed = data.gedData;
            source = new FSFullTreeDownloader(rootId, generations, null);
            var gedNodes = {};
            for (var key in attemptGed) {
                var branchIds = [];
                //ascendants
                if (attemptGed[key].hasOwnProperty("ascBranchIds") && data.dscOrAsc == "ascendancy") {
                    //var firstFam = attemptGed[key].familyChild[0];
                    var firstFam = this.getBestAscendants(attemptGed, key);
                    branchIds = attemptGed[key].ascBranchIds[firstFam];
                }
                //descendantsbr
                if (attemptGed[key].hasOwnProperty("dscBranchIds") && data.dscOrAsc == "descendancy") {
                    //var firstFam = attemptGed[key].familySpouse[0];
                    if (attemptGed[key].familySpouse.length > 1) {
                        //console.log(attemptGed[key].familySpouse);
                        //console.log(attemptGed[key].dscBranchIds);
                        var firstFam = this.getBestDescendants(attemptGed, key);
                        branchIds = attemptGed[key].dscBranchIds[firstFam];
                    }
                    else {
                        var firstFam = this.getBestDescendants(attemptGed, key);
                        branchIds = attemptGed[key].dscBranchIds[firstFam];
                    }
                }
                if (branchIds == null) {
                    branchIds = [];
                }
                gedNodes[key] = new GedcomNode(key, attemptGed[key], branchIds);
            }
            //console.log(gedNodes)
            //this.source = new GedcomDownloader(attemptGed["latestIndi"], 20, gedNodes);//"oldestIndi" for dsc, "latestIndi" for asc
            //this.source = new GedcomDownloader("@I12154@", 20, gedNodes);//PROFESSOR BARRETT is @I12154@ do @175@ for an ascendant
            source = new GedcomDownloader(data.rootId, data.generations, gedNodes, data.dscOrAsc);
        }
        else if (data.hasOwnProperty("file")) {
            //this.boxes = data.boxes;
            source = null;
        }
        else {
            //console.log("Making non-gedcom C");
            let rootId = data.rootId;
            generations = data.generations;
            source = new FSFullTreeDownloader(rootId, generations, data.dscOrAsc);
            //var self = this;
            //this.source.addPercentListener(function(percent){
            //    document.getElementById()
            //});
        }
        return source;
    }

    private getBestDescendants(attemptGed, key) {
        if (attemptGed[key].familySpouse.length == 1) {
            return attemptGed[key].familySpouse[0];
        }
        else {
            var bestFam = "";
            var biggest = 0;
            for (var i = 0; i < attemptGed[key].familySpouse.length; i++) {
                var famAttempt = attemptGed[key].familySpouse[i];
                if (attemptGed[key].dscBranchIds.hasOwnProperty(famAttempt)) {
                    if (attemptGed[key].dscBranchIds[famAttempt].length > biggest) {
                        bestFam = famAttempt;
                        biggest = attemptGed[key].dscBranchIds[famAttempt].length;
                    }
                }
            }
            return bestFam;
        }
    }

    private getBestAscendants(attemptGed, key) {
        if (attemptGed[key].familyChild.length == 1) {
            return attemptGed[key].familyChild[0];
        }
        else {
            var bestFam = "";
            var biggest = 0;
            for (var i = 0; i < attemptGed[key].familyChild.length; i++) {
                var famAttempt = attemptGed[key].familyChild[i];
                if (attemptGed[key].ascBranchIds.hasOwnProperty(famAttempt)) {
                    if (attemptGed[key].ascBranchIds[famAttempt].length > biggest) {
                        bestFam = famAttempt;
                        biggest = attemptGed[key].ascBranchIds[famAttempt].length;
                    }
                }
            }
            return bestFam;
        }
    }
}