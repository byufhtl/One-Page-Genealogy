///<reference path="IStyler.ts"/>
///<reference path="IControllerListener.ts"/>
///<reference path="../model/ITreeListener.ts"/>
///<reference path="SimpleGenerationSpacer.ts"/>
///<reference path="YSpacer.ts"/>
///<reference path="../view/IViewManager.ts"/>
///<reference path="CustomSpacer.ts"/>
///<reference path="CustomColorSpacer.ts"/>
///<reference path="CustomTextColorSpacer.ts"/>
///<reference path="C.ts"/>
///<reference path="LeafNodeSpacer.ts"/>
///<reference path="CollapseSpacer.ts"/>
///<reference path="TranslateSpacer.ts"/>
///<reference path="RotateSpacer.ts"/>
///<reference path="GenerationSpacer2.ts"/>
///<reference path="EightElevenSpacer.ts"/>
///<reference path="EightElevenDetailSpacer.ts"/>
///<reference path="DetailChartSpacer.ts"/>
///<reference path="FamilyReunionChartSpacer.ts"/>
///<reference path="FamilyReunionDescPublicSpacer.ts"/>
///<reference path="VertDetChartSpacer.ts"/>
///<reference path="VertDescDetChartSpacer.ts"/>
///<reference path="GreyScaleSpacer.ts"/>
///<reference path="ColorSpacer.ts"/>
///<reference path="AscColorSpacer.ts"/>
///<reference path="GenColorSpacer.ts"/>
///<reference path="GenColorVibrantSpacer.ts"/>
///<reference path="GenderColorSpacer.ts"/>
///<reference path="BaptismColorSpacer.ts"/>
///<reference path="SpacingSpacer.ts"/>
///<reference path="JSstyleSpacer.ts"/>
///<reference path="JSPublicSpacer.ts"/>
///<reference path="IdTest.ts"/>
/**
 * Created by krr428 on 3/7/15.
 * Last updated 2/19/16.
 */

declare var accessToken;
declare var numGenerations;


class P implements IControllerListener, ITreeListener {

    private stylingPipeline:IStyler[]; // This changes based on
    private transformationPipline:IStyler[];

    private collapseSpacer:CollapseSpacer;
    private customSpacer:CustomSpacer;
    private customColorSpacer:CustomColorSpacer;
    private customTextColorSpacer: CustomTextColorSpacer;
    private translateSpacer:TranslateSpacer;
    private tree:ITree;

    private beforeTransformBoxes:BoxMap;
    private firstBoxMap:BoxMap;
    private secondBoxMap:BoxMap;

    constructor(private c:C) {

        this.customSpacer = new CustomSpacer();
        this.customColorSpacer = new CustomColorSpacer();
        this.customTextColorSpacer = new CustomTextColorSpacer();
        this.collapseSpacer = new CollapseSpacer();
        this.translateSpacer = new TranslateSpacer();

        this.stylingPipeline = [];
        this.stylingPipeline.push(this.collapseSpacer);
        if (c.dscOrAsc == "descendancy") {
            this.stylingPipeline.push(new ColorSpacer());
        } else {
            this.stylingPipeline.push(new AscColorSpacer());
        }
        this.stylingPipeline.push(new SpacingSpacer());
        if (c.dscOrAsc == "descendancy") {
            this.stylingPipeline.push(new JSPublicSpacer());
        } else {
            this.stylingPipeline.push(new VertDetChartSpacer());
        }
        this.stylingPipeline.push(this.customSpacer);
        this.stylingPipeline.push(this.customColorSpacer);
        this.stylingPipeline.push(this.customTextColorSpacer);
        this.stylingPipeline.push(new YSpacer());
        this.transformationPipline = [];
        this.transformationPipline.push(this.translateSpacer);
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
                    this.customSpacer.addCustomStyle(param.id,{
                        type: param.value
                    });
                }
                if(param.hasOwnProperty('color')){
                    this.customColorSpacer.addCustomStyle(param.id,{
                        color: param.color
                    });
                    this.customTextColorSpacer.addCustomStyle(param.id,{
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
                this.collapseSpacer.collapseId(param.id, true);
                refresh = true;
            }
            else if (param.type === 'expand-sub-tree') {
                this.collapseSpacer.collapseId(param.id, false);
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
            else if(this.changeColorStyle(param.type)){ // This function automatically handles color spacing.
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
        }
        if (refresh) {
            this.runPipeline();
        }
    }

    private showDuplicates(){
        var map = this.firstBoxMap.getMap();
        var count = 0;
        for(var box in map){
            if(box.charAt(box.length-1) !== "0" && box.charAt(8) === ':'){
                count++;
                var numDup = parseInt(box.charAt(box.length-1));
                var color = this.getRandomColor()
                while(numDup >=0 ) {
                    var id = box.replace(box.charAt(box.length-1),numDup);
                    this.customColorSpacer.addCustomStyle(id,{
                        color: color
                    });
                    numDup--;
                }
            }
        }
        return count;
    }
    private getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    private lightenDarkenColor(col,amt) {
        var num = parseInt(col,16);
        var r = (num >> 16) + amt;
        var b = ((num >> 8) & 0x00FF) + amt;
        var g = (num & 0x0000FF) + amt;
        var newColor = g | (b << 8) | (r << 16);
        console.log(newColor.toString(16));
        return "#" + newColor.toString(16);
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
                        if(localStorage.getItem("chartType") === "FamilySearch" && index.indexOf(":") !== 8 ||
                            localStorage.getItem("chartType") === "Gedcom" && index.indexOf("@") !== 0) {
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
        for (var box in this.firstBoxMap.getMap()) {
            var list = [];
            var currentPID = box;
            list.push(currentPID);
            while (childMap[currentPID] != null) {
                list.push(childMap[currentPID]);
                currentPID = childMap[currentPID];
            }

            //If it needs empty Boxes and is allowed empty boxes, then add them
            if (list.length > 1 &&
                list.length < numGenerations &&
                this.firstBoxMap.getId(box).getNode().getBranchIds().length === 0) {

                countID = this.addBlanks(recurse, box, countID, numGenerations, list.length);
                //countID += 2;
            }
        }
        //console.log(this.tree.getTreeMap());
    }

    private addBlanks(recurse:boolean, box:string, countID:number, numGen:number, listLen:number):number {
        //Create two new empty nodes and add them to the maps:
        var node0:FSDescNode = new FSDescNode(String(countID), null, [], [], null, true);
        var node1:FSDescNode = new FSDescNode(String(countID + 1), null, [], [], null, true);
        this.firstBoxMap.setId(node0.getId(), new AbstractBox(node0));
        this.secondBoxMap.setId(node0.getId(), new AbstractBox(node0));
        this.firstBoxMap.setId(node1.getId(), new AbstractBox(node1));
        this.secondBoxMap.setId(node1.getId(), new AbstractBox(node1));

        //connect the empty nodes in the correct place:
        //console.log(box + ": (" + String(countID) + "," + String(countID + 1) + ")");
        this.firstBoxMap.getId(box).getNode().setBranchIds([String(countID), String(countID + 1)]);

        listLen++;
        var newCount = -1;

        //This if-statement makes it recursive - adding empty boxes to fill the chart.
        //Without this if-statement, it will just add the first empty boxes.
        if (recurse && listLen < numGen) {
            newCount = this.addBlanks(recurse, String(countID), countID + 2, numGen, listLen);
            newCount = this.addBlanks(recurse, String(countID + 1), newCount, numGen, listLen);
        }

        if (newCount === -1) {
            newCount = countID + 2;
        }
        return newCount;
    }

    private vpView(paramId:string):any {
        //console.log(this.tree.getTreeMap());
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
                this.customSpacer.addCustomStyle(node.getId(),{
                    type: param.value
                });
            }
            if(param.hasOwnProperty('color')){
                this.customColorSpacer.addCustomStyle(node.getId(),{
                    color: param.color
                });
                this.customTextColorSpacer.addCustomStyle(node.getId(),{
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
        for (var i = 0; i < updates.length; i++) {
            var command:ICommand = updates[i];
            if (command.getType() === "add-node") {
                var node:INode = command.getValue();

                if (!this.firstBoxMap) {
                    this.firstBoxMap = new BoxMap(node.getId());
                    this.secondBoxMap = new BoxMap(node.getId());
                }

                this.firstBoxMap.setId(node.getId(), new AbstractBox(node));
                this.secondBoxMap.setId(node.getId(), new AbstractBox(node));
            } else {
                console.log("Error: Unknown Command");
            }
        }
        this.runPipeline();
    }

    private runPipeline():void {
        var i:number;
        for (i = 0; i < this.stylingPipeline.length; i++) {
            this.stylingPipeline[i].applyStyle(this.firstBoxMap);
        }
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
        var style: IStyler;
        switch(type){
            case 'detail-style':
                style = new DetailChartSpacer();
                break;
            case 'reunion-style':
                style = new FamilyReunionChartSpacer();
                break;
            case 'vertical-style':
                style = new VertDetChartSpacer();
                break;
            case 'eight-eleven-style':
                style = new EightElevenSpacer();
                break;
            case 'eight-eleven-detail-style':
                style = new EightElevenDetailSpacer();
                break;
            case 'js-public-style':
                style = new JSPublicSpacer();
                break;
            case 'js-reunion-public-style':
                style = new FamilyReunionDescPublicSpacer();
                break;
            default:
                return false;
        }
        this.stylingPipeline = [];
        this.stylingPipeline.push(this.collapseSpacer);
        this.stylingPipeline.push(new SpacingSpacer());

        this.stylingPipeline.push(style);

        this.stylingPipeline.push(this.customSpacer.clear());
        this.stylingPipeline.push(this.customColorSpacer);
        this.stylingPipeline.push(this.customTextColorSpacer);
        this.stylingPipeline.push(new YSpacer());
        return true;
    }

    /**
     * Attempts to change the style spacer for the chart. Succeeds and returns true if the supplied type matches a style
     * spacer. Fails and returns false if the supplied type does not match a style spacer.
     *
     * @param type A key word that may map to a particular style spacer.
     *
     * @returns {boolean} whether or not the style spacing was edited as a result of the function.
     */
    private changeColorStyle(type:string):boolean {
        var style: IStyler;
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
            case 'to-generation-color':
                style = new GenColorSpacer();
                break;
            case 'to-generation-color-vibrant':
                style = new GenColorVibrantSpacer();
                break;
            case 'to-gender-color':
                style = new GenderColorSpacer();
                break;
            default:
                return false;
        }
        var temp = this.stylingPipeline;
        this.stylingPipeline = [];
        /*
         The first three entries in the styling pipeline are:
         Collapse Spacer,
         Spacing Spacer,
         Style Spacer * There are several of these that may be in place.

         These Spacers need to be added first.
         */
        var i: number;
        for(i = 0; i < 3; ++i){
            this.stylingPipeline[i] = temp[i];
        }

        this.stylingPipeline.push(style);

        this.stylingPipeline.push(this.customSpacer);
        this.stylingPipeline.push(this.customColorSpacer.clear());
        this.stylingPipeline.push(this.customTextColorSpacer.clear());
        this.stylingPipeline.push(new YSpacer());
        return true;
    }
}