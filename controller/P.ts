///<reference path="IControllerListener.ts"/>
///<reference path="../model/ITreeListener.ts"/>
///<reference path="SimpleGenerationSpacer.ts"/>
///<reference path="YSpacer.ts"/>
///<reference path="../view/IViewManager.ts"/>
///<reference path="ChartSpacers/CustomSpacer.ts"/>
///<reference path="ColorSpacers/CustomColorSpacer.ts"/>
///<reference path="ColorSpacers/CustomTextColorSpacer.ts"/>
///<reference path="C.ts"/>
///<reference path="LeafNodeSpacer.ts"/>
///<reference path="CollapseSpacer.ts"/>
///<reference path="TranslateSpacer.ts"/>
///<reference path="RotateSpacer.ts"/>
///<reference path="GenerationSpacer2.ts"/>
///<reference path="PrivatePersonUtils.ts"/>
///<reference path="ChartSpacers/CustomSpacer.ts"/>

///<reference path="ChartStyles/FamilyReunionChartStyler.ts"/>
///<reference path="ChartStyles/EightElevenChartStyler.ts"/>
///<reference path="ChartStyles/EightElevenDetailChartStyler.ts"/>
///<reference path="ChartStyles/FamilyReunionDescChartStyler.ts"/>
///<reference path="ChartStyles/VariableDepthDescChartStyler.ts"/>
///<reference path="ChartStyles/DetailChartStyler.ts"/>
///<reference path="ChartStyles/VertDescDetChartStyler.ts"/>
///<reference path="ChartStyles/VertDetChartStyler.ts"/>
///<reference path="ChartStyles/VertDetAccentChartStyler.ts"/>
///<reference path="ChartStyles/VertDetChartStyler.ts"/>
///<reference path="ChartStyles/BubbleChartStyler.ts"/>
///<reference path="ChartStyles/VariableDepthChartStyler.ts"/>
///<reference path="ChartStyles/ElevenSeventeenChartStyler.ts"/>
///<reference path="ChartStyles/ExtendedChartStyler.ts"/>

///<reference path="ColorSpacers/GreyScaleSpacer.ts"/>
///<reference path="ColorSpacers/ColorSpacer.ts"/>
///<reference path="ColorSpacers/AscColorSpacer.ts"/>
///<reference path="ColorSpacers/AscBlackoutColorSpacer.ts"/>
///<reference path="ColorSpacers/AscBoldColorSpacer.ts"/>
///<reference path="ColorSpacers/AscGreyscaleColorSpacer.ts"/>
///<reference path="ColorSpacers/GenColorSpacer.ts"/>
///<reference path="ColorSpacers/GenColorVibrantSpacer.ts"/>
///<reference path="ColorSpacers/GenWoodColorSpacer.ts"/>
///<reference path="ColorSpacers/GenderColorSpacer.ts"/>
///<reference path="ColorSpacers/CountryColorSpacer.ts"/>
///<reference path="ColorSpacers/BaptismColorSpacer.ts"/>

///<reference path="SpacingSpacer.ts"/>
///<reference path="JSstyleSpacer.ts"/>
///<reference path="JSPublicSpacer.ts"/>
///<reference path="IdTest.ts"/>
///<reference path="StylingPipeline.ts"/>
///<reference path="StatReport.ts"/>
/**
 * Created by krr428 on 3/7/15.
 * Last updated 2/24/16.
 */

declare var accessToken;
declare var numGenerations;
declare var saveAs:any;

class P implements IControllerListener, ITreeListener {

    private stylingPipeline:StylingPipeline;
    private transformationPipline:AbstractStyler[];

    private translateSpacer:TranslateSpacer;
    private tree:ITree;

    private beforeTransformBoxes:BoxMap;
    private firstBoxMap:BoxMap;
    private secondBoxMap:BoxMap;

    constructor(private c:C) {
        this.translateSpacer = new TranslateSpacer();

        this.stylingPipeline = new StylingPipeline();

        if (c.dscOrAsc == "descendancy") {
            this.stylingPipeline.setChartStyleSpacer(new VertDescDetChartStyler());
            this.stylingPipeline.setChartColorStyleSpacer(new ColorSpacer());
        } else {
            this.stylingPipeline.setChartStyleSpacer(new VertDetChartStyler());
            this.stylingPipeline.setChartColorStyleSpacer(new AscColorSpacer());
        }

        this.transformationPipline = [];
        this.transformationPipline.push(this.translateSpacer);
    }

    setStylingPipeline(pipeline:StylingPipeline){
        this.stylingPipeline.deserialize(pipeline);
    }
    getStylingPipeline() : StylingPipeline {
        return this.stylingPipeline;
    }

    setMaps(boxMap: BoxMap){
        //This function should only be used when loading a chart from file
        this.firstBoxMap = boxMap;
        this.secondBoxMap = boxMap;
    }

    handle(param:any):any {
        var refresh = false;
        if (param.type) {
            if (param.type === 'changeIndividual') {
                //console.log("Individual Change...");
                if(param.hasOwnProperty('value')){
                    this.stylingPipeline.addCustomSpacerStyle(param.id,{
                        type: param.value
                    });
                }
                if(param.hasOwnProperty('color')){
                    this.stylingPipeline.addCustomColorStyle(param.id,{
                        color: param.color
                    });
                    this.stylingPipeline.addCustomTextColorStyle(param.id,{
                        textcolor: param.textcolor
                    });
                }
                refresh = true;
            }
            else if (param.type === 'changeGeneration') {
                console.log("Gen Change...");
                var root:INode = this.tree.getRoot();
                var gen = this.getGeneration(root, param.id);
                console.log("Gen: " + gen);
                this.applyToGeneration(gen, root, param);
                refresh = true;
            }
            else if (param.type === 'changeAll') {
                console.log("All Change...");
                var root:INode = this.tree.getRoot();
                //var gen = this.getGeneration(root, param.id);

                for (var gen = 0; gen < numGenerations; gen++) {
                    this.applyToGeneration(gen, root, param);
                }
                refresh = true;
            }
            else if (param.type === 'VP-view') {
                this.vpView(param.id);
            }
            else if (param.type === 'collapse-sub-tree') {
                this.stylingPipeline.collapseId(param.id, true);
                refresh = true;
            }
            else if (param.type === 'expand-sub-tree') {
                this.stylingPipeline.collapseId(param.id, false);
                refresh = true;
            }
            else if (param.type === 'update-translate') {
                this.translateSpacer.setTranslation(param.dx, param.dy);
                refresh = true;
            }
            else if (param.type === 'getBoxByPoint') {
                return this.getBoxByPoint(param.pt);
            }
            else if(this.changeChartStyle(param.type)){ // This function automatically handles chart spacing.
                refresh = true;
            }
            else if(this.changeColorStyle(param.type, param.colorMap)){ // This function automatically handles color spacing.
                refresh = true;
            }
            else if (param.type === 'show-empty') {
                this.showEmptyBoxes(param.recurse);
                document.getElementById('opg-show-empty').innerHTML = "Hide Empty Boxes";
                refresh = true;
            }else if (param.type === 'hide-empty') {
                this.hideEmptyBoxes();
                document.getElementById('opg-show-empty').innerHTML = "Show Empty Boxes";
                refresh = true;
            }
            else if (param.type === 'show-duplicates') {
                var count = this.showDuplicates();
                console.log("Done. " + count + " duplicates found.");
                refresh = true;
            }
            else if (param.type === 'save'){
                this.save(param.value);
            }
            else if (param.type === 'show-statistics'){
                this.showStatsReport(param);
            }
            else if (param.type === 'hide-statistics'){
                $('#statistics-modal').hide();
            }
        }
        if (refresh) {
            this.runPipeline();
        }
    }

    private strip(boxes:BoxMap) : BoxMap {
        for(var id in boxes.getMap()){
            if(boxes.getMap().hasOwnProperty(id)){
                var person = boxes.getMap()[id].getNode().getPerson();
                if(person) {
                    delete person.facts;
                    delete person.gender;
                    delete person.identifiers;
                    delete person.links;
                    delete person.names;
                }
            }
        }
        return boxes;
    }

    private save(boxes:BoxMap){
        var toSave = {};

        toSave['type'] = localStorage.getItem('chartType');
        toSave['direction'] = this.c.dscOrAsc;
        toSave['root'] = localStorage.getItem('rootPID');
        toSave['generations'] = numGenerations;
        toSave['stylingPipeline'] = this.stylingPipeline;
        toSave['boxes'] = this.strip(boxes);
        var output = JSON.stringify(toSave);

        var blob = new Blob([output], {type: "text/plain;charset=utf-8;",});
        saveAs(blob, "OPG_chart.opg");
    }

    private showDuplicates(){
        var map = this.firstBoxMap.getMap();
        var count = 0;
        for(var box in map){
            if(box.charAt(box.length-1) !== "0" && box.charAt(8) === ':'){
                count++;
                var numDup = parseInt(box.charAt(box.length-1));
                while(numDup >=0 ) {
                    var id = box.replace(box.charAt(box.length-1),numDup);
                    this.stylingPipeline.addCustomColorStyle(id,{
                        color: ColorManager.generateRandomPastel()
                    });
                    numDup--;
                }
            }
        }
        return count;
    }

    private hideEmptyBoxes() {
        var treeMap = this.tree.getTreeMap();

        for (var key in treeMap){
            if (treeMap.hasOwnProperty(key)) {
                if (treeMap[key].getBranchIds().length > 0){
                    var branchIds = treeMap[key].getBranchIds();
                    //Must traverse backwards because we're deleting as we go.
                    for (var i=branchIds.length-1; i >=0; i--) {
                        var index = branchIds[i];
                        if(PrivatePersonUtils.isCustomId(index) && PrivatePersonUtils.getCustomSubKey(index) === "EMPTY_BOX"){
                            branchIds.splice(i,1);
                        }
                    }
                    treeMap[key].setBranchIds(branchIds);
                }
            }
        }
    }

    private showEmptyBoxes(recurse:boolean) {
        var childMap:{[key: string]: string} = {};
        var treeMap = this.tree.getTreeMap();

        //Create Child Map:
        for (var key in treeMap) {
            if (treeMap.hasOwnProperty(key)) {
                if (treeMap[key].getBranchIds().length > 0) {
                    for (var i in treeMap[key].getBranchIds()) {
                        var index = treeMap[key].getBranchIds()[i];
                        if (index !== null && (index.indexOf(":") === 8 || index.indexOf("@") === 0)) {
                            childMap[index] = key;
                        }
                    }
                }
            }
        }
        //console.log(childMap);

        var countID = 0;
        //Use Child Map for each person to determine empty boxes
        for (var boxId in this.firstBoxMap.getMap()) {
            var list = [];
            var currentPID = boxId;
            list.push(currentPID);
            while (childMap[currentPID] != null) {
                list.push(childMap[currentPID]);
                currentPID = childMap[currentPID];
            }

            //If it needs empty Boxes and is allowed empty boxes, then add them
            if (list.length > 1 &&
                list.length < numGenerations &&
                this.firstBoxMap.getId(boxId).getNode().getBranchIds().length === 0) {

                countID = this.addBlanks(recurse, boxId, countID, numGenerations, list.length);
            }
        }
    }

    private addBlanks(recurse:boolean, boxId:string, countID:number, numGen:number, listLen:number):number {
        //Create two new empty nodes and add them to the maps:
        var node0:INode = new BuildNode(PrivatePersonUtils.generateCustomKey(countID, "EMPTY_BOX"),
            {name:" ", gender:"Unknown", birthdate:"", birthplace:"", deathdate:"", deathplace:"", marriagedate:"",
            marriageplace:"", displaySpouse: null, isMain: true});
        var node1:INode = new BuildNode(PrivatePersonUtils.generateCustomKey(countID + 1, "EMPTY_BOX"),
            {name:" ", gender:"Unknown", birthdate:"", birthplace:"", deathdate:"", deathplace:"", marriagedate:"",
            marriageplace:"", displaySpouse: null, isMain: true});
        this.firstBoxMap.setId(node0.getId(), new AbstractBox(node0));
        this.secondBoxMap.setId(node0.getId(), new AbstractBox(node0));
        this.firstBoxMap.setId(node1.getId(), new AbstractBox(node1));
        this.secondBoxMap.setId(node1.getId(), new AbstractBox(node1));

        //connect the empty nodes in the correct place:
        //console.log(boxId + ": (" + String(countID) + "," + String(countID + 1) + ")");
        this.firstBoxMap.getId(boxId).getNode().setBranchIds([node0.getId(), node1.getId()]);

        listLen++;
        var newCount = -1;

        //This if-statement makes it recursive - adding empty boxes to fill the chart.
        //Without this if-statement, it will just add the first empty boxes.
        if (recurse && listLen < numGen) {
            newCount = this.addBlanks(recurse, node0.getId(), countID + 2, numGen, listLen);
            newCount = this.addBlanks(recurse, node1.getId(), newCount, numGen, listLen);
        }

        if (newCount === -1) {
            newCount = countID + 2;
        }
        return newCount;
    }

    private showStatsReport(param: any){
        var statsContainer = $('#statistics-content');
        statsContainer.empty();
        var statReport = new StatReport(param.value, param.generations, param.direction);

        // Create and add row
        var totalPeopleRow = statReport.createStatRow("Total People:", statReport.getNodeCount(), "");
        statsContainer.append(totalPeopleRow);
        var perMaleRow = statReport.createStatRow("Percent Male:", statReport.getPercentMale(), "%");
        statsContainer.append(perMaleRow);
        var perFemaleRow = statReport.createStatRow("Percent Female:", statReport.getPercentFemale(), "%");
        statsContainer.append(perFemaleRow);
        var perUnk = statReport.getPercentUnknown();
        var perUnkTag = statReport.createCommentTagByPercentage(perUnk, false);
        var perFemaleRow = statReport.createStatRow("Percent Unknown Gender:", perUnk, "%", perUnkTag);
        statsContainer.append(perFemaleRow);
        var full = statReport.getEstimatedPercentFull();
        var fullTag = statReport.createCommentTagByPercentage(full, true);
        var perFullRow = statReport.createStatRow("Estimated* Percent Full:", full , "%", fullTag);
        statsContainer.append(perFullRow);
        var disclaimer: string;
        if(param.direction === 'descendancy'){
            var avgFamilyRow = statReport.createStatRow("Average Children per Family:", statReport.getAvgFamilySize(), "");
            statsContainer.append(avgFamilyRow);
            var avgSpousesRow = statReport.createStatRow("Average Number of Spouses:", statReport.getAvgSpouses(), "");
            statsContainer.append(avgSpousesRow);
            disclaimer = "Based on 4 children per family per generation."
        }
        else if (param.direction === 'ascendancy'){
            disclaimer = "Based on 2 parents per family per generation."
        }
        statsContainer.append('<hr style="margin-top: 12%;"><div class="col-lg-12"><p id="stats-disclaimer" style="text-align: left;"></p></div>');
        $('#stats-disclaimer').text("Estimation based on rough averages. " + disclaimer);

        // Show the modal window
        $('#statistics-modal').show();
    }

    private vpView(paramId:string):any {
        var childMap:{[key: string]: string} = {};
        var treeMap = this.tree.getTreeMap();
        for (var key in treeMap) {
            if (treeMap.hasOwnProperty(key)) {
                if (treeMap[key].getBranchIds().length > 0) {
                    for (var i in treeMap[key].getBranchIds()) {
                        childMap[treeMap[key].getBranchIds()[i].substring(0, 8)] = key.substring(0, 8);
                    }
                }
            }
        }
        var list = [];
        var currentPID = paramId;
        list.push(currentPID);
        while (childMap[currentPID] != null) {
            list.push(childMap[currentPID]);
            currentPID = childMap[currentPID];
        }
        window['vpdata'] = {
            rootId: list[0],
            highlightPaths: [list],
            accessToken: accessToken
        };
        window.open('/vprf/index.html');
    }

    private getBoxByPoint(pt:Point):IBox {

        var queue = [];

        if(this.secondBoxMap === undefined){
            this.secondBoxMap = this.firstBoxMap.copy();
        }

        queue.push(this.secondBoxMap.getRoot());
        while (queue.length > 0) {
            var nextId:string = queue.shift();
            var nextBox:IBox = this.secondBoxMap.getId(nextId);

            if (!nextBox) {
                continue;
            }

            if (nextBox.hitTest(pt)) {
                return nextBox;
            }

            var nextNode:INode = nextBox.getNode();
            var childrenIds:string[] = nextNode.getBranchIds();

            if (nextBox.isCollapsed()) {
                continue;
            }

            for (var i = 0; i < childrenIds.length; i++) {
                queue.push(childrenIds[i]);
            }
        }
        return null;
    }

    private getGeneration(node:INode, target:string):number {
        if (node.getId() == target) {
            return 0;
        }
        var branchIds:string[] = node.getBranchIds();
        for (var i = 0; i < branchIds.length; i++) {
            var child = this.tree.getId(branchIds[i]);
            if (child) {
                var childNum:number = this.getGeneration(child, target);
                if (childNum > -1) {
                    if (child.getDisplaySpouse() != null && this.c.dscOrAsc == "descendancy") {
                        if (child.getDisplaySpouse().getSpouses().length > 1) {
                            return childNum
                        }
                    }
                    if (child.getSpouses().length > 1)
                        return childNum;
                    return childNum + 1;
                }
            }
        }
        return -1;
    }

    private applyToGeneration(gen:number, node:INode, param:any) {
        if (gen === 0 && node.getSpouses().length < 2) {
            if(param.hasOwnProperty('value')){
                this.stylingPipeline.addCustomSpacerStyle(node.getId(),{
                    type: param.value
                });
            }
            if(param.hasOwnProperty('color')){
                this.stylingPipeline.addCustomColorStyle(node.getId(),{
                    color: param.color
                });
                this.stylingPipeline.addCustomTextColorStyle(node.getId(),{
                    textcolor: param.textcolor
                })
            }
        }
        var branchIds:string[] = node.getBranchIds();
        for (var i = 0; i < branchIds.length; i++) {
            var child = this.tree.getId(branchIds[i]);
            if (child) {
                if (child.getSpouses().length > 1) {
                    this.applyToGeneration(gen, child, param);
                } else {
                    this.applyToGeneration(gen - 1, child, param);
                }
            }
        }
    }

    handleUpdate(tree:ITree, updates:ICommand[]):void {
        this.tree = tree;
        //for (var i = 0; i < updates.length; i++) {
            //var command:ICommand = updates[i];
        while(updates.length !== 0){
            var command: ICommand = updates.shift();
            if (command.getType() === "add-node") {
                var node:INode = command.getValue();

                if (!this.firstBoxMap) {
                    this.firstBoxMap = new BoxMap(node.getId());
                    this.secondBoxMap = new BoxMap(node.getId());
                }

                this.firstBoxMap.setId(node.getId(), new AbstractBox(node));
                this.secondBoxMap.setId(node.getId(), new AbstractBox(node));
            }
            else if(command.getType() === "remove-node"){
                var node: INode = command.getValue();

                if(this.firstBoxMap && this.secondBoxMap) {
                    this.firstBoxMap.removeId(node.getId());
                    this.secondBoxMap.removeId(node.getId());
                }
            }
            else if(command.getType() === "update-node"){
                // Really I'm just doing this to kick the pipeline.
            }
            else{
                console.log("Error: Unknown Command");
            }
        }
        this.runPipeline();
    }

    private runPipeline():void {
        this.stylingPipeline.runPipeline(this.firstBoxMap);
        this.runTranslationPipeline(this.firstBoxMap);
        this.c.refresh(this.secondBoxMap);
    }

    private runTranslationPipeline(boxMap:BoxMap):BoxMap {
        boxMap.copyContents(this.secondBoxMap);
        for (var i = 0; i < this.transformationPipline.length; i++) {
            this.transformationPipline[i].applyStyle(this.secondBoxMap);
        }
        return this.secondBoxMap;
    }

    /**
     * Attempts to change the style spacer for the chart. Succeeds and returns true if the supplied type matches a style
     * spacer. Fails and returns false if the supplied type does not match a style spacer.
     *
     * @param type A key word that may map to a particular style spacer.
     *
     * @returns {boolean} whether or not the style spacing was edited as a result of the function.
     */
    private changeChartStyle(type:string):boolean {
        var style: AbstractChartStyle;
        switch(type){
            case 'detail-style':
                style = new DetailChartStyler();
                break;
            case 'reunion-style':
                style = new FamilyReunionChartStyler();
                break;
            case 'vertical-style':
                style = new VertDetChartStyler();
                break;
            case 'vertical-style-accent':
                style = new VertDetAccentChartStyler();
                break;
            case 'bubble-style':
                style = new BubbleChartStyler();
                break;
            case 'var-depth-style':
                style = new VariableDepthChartStyler();
                break;
            case 'eight-eleven-style':
                style = new EightElevenChartStyler();
                break;
            case 'eight-eleven-detail-style':
                style = new EightElevenDetailChartStyler();
                break;
            case 'eleven-seventeen-style':
                style = new ElevenSeventeenChartStyler();
                break;
            case 'extended-style':
                style = new ExtendedChartStyler();
                break;
            case 'js-public-style':
                style = new VertDescDetChartStyler();
                break;
            case 'js-reunion-public-style':
                style = new FamilyReunionDescChartStyler();
                break;
            case 'js-var-depth-style':
                style = new VariableDepthDescChartStyler();
                break;
            default:
                return false;
        }

        // Re-center before commencing style switch.
        this.c.handleOption("recenter-chart", null);

        this.stylingPipeline.setChartStyleSpacer(style);
        this.stylingPipeline.clearCustomChartStyle();
        this.stylingPipeline.resetYSpacer();
        return true;
    }

    /**
     * Attempts to change the style spacer for the chart. Succeeds and returns true if the supplied type matches a style
     * spacer. Fails and returns false if the supplied type does not match a style spacer.
     *
     * @param type A key word that may map to a particular style spacer.
     * @param value What the color style is being changed to (Color-by-Country only).
     * @returns {boolean} whether or not the style spacing was edited as a result of the function.
     */
    private changeColorStyle(type:string, value:{} ):boolean {
        var style: AbstractStyler;
        switch (type){
            case 'to-greyscale':
                style = new GreyScaleSpacer();
                break;
            case 'to-branch-color':
                if(this.c.dscOrAsc == "descendancy") {
                    style = new ColorSpacer();
                }
                else{
                    style = new AscColorSpacer();
                }
                break;
            case 'to-branch-color-blackout':
                if(this.c.dscOrAsc == "descendancy") {
                    style = new ColorSpacer();
                }
                else{
                    style = new AscBlackoutColorSpacer();
                }
                break;
            case 'to-branch-color-bold':
                if(this.c.dscOrAsc == "descendancy") {
                    style = new ColorSpacer();
                }
                else{
                    style = new AscBoldColorSpacer();
                }
                break;
            case 'to-branch-color-gray':
                style = new AscGreyscaleColorSpacer();
                break;
            case 'to-generation-color-warm':
                style = new GenColorSpacer(GenColorSpacer.WARM);
                break;
            case 'to-generation-color-cold':
                style = new GenColorSpacer(GenColorSpacer.COLD);
                break;
            case 'to-generation-color-vibrant':
                style = new GenColorVibrantSpacer();
                break;
            case 'to-generation-wood':
                style = new GenWoodColorSpacer();
                break;
            case 'to-gender-color':
                style = new GenderColorSpacer();
                break;
            case 'to-country-color':
                style = new CountryColorSpacer(value);
                var countryColorSet = true;
                break;
            default:
                return false;
        }
        this.stylingPipeline.setChartColorStyleSpacer(style);

        this.stylingPipeline.clearColorStyle();
        this.stylingPipeline.clearTextColorStyle();
        this.stylingPipeline.resetYSpacer();
        if(!countryColorSet) {
            $('#country-legend').css('display', 'none');
            $('#country-legend').css("width","0%");
            $('#opg-chart').css("width","100%");
        }
        return true;
    }
}