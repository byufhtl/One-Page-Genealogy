///<reference path="IStyler.ts"/>
///<reference path="IControllerListener.ts"/>
///<reference path="../model/ITreeListener.ts"/>
///<reference path="SimpleGenerationSpacer.ts"/>
///<reference path="YSpacer.ts"/>
///<reference path="../view/IViewManager.ts"/>
///<reference path="CustomSpacer.ts"/>
///<reference path="C.ts"/>
///<reference path="LeafNodeSpacer.ts"/>
///<reference path="CollapseSpacer.ts"/>
///<reference path="TranslateSpacer.ts"/>
///<reference path="RotateSpacer.ts"/>
///<reference path="GenerationSpacer2.ts"/>
///<reference path="EightElevenSpacer.ts"/>
///<reference path="EightElevenDetailSpacer.ts"/>
///<reference path="DetailChartSpacer.ts"/>
///<reference path="VertDetChartSpacer.ts"/>
///<reference path="VertDescDetChartSpacer.ts"/>
///<reference path="GreyScaleSpacer.ts"/>
///<reference path="ColorSpacer.ts"/>
///<reference path="AscColorSpacer.ts"/>
///<reference path="GenColorSpacer.ts"/>
///<reference path="GenColorVibrantSpacer.ts"/>
///<reference path="GenderColorSpacer.ts"/>
///<reference path="SpacingSpacer.ts"/>
///<reference path="JSstyleSpacer.ts"/>
///<reference path="JSPublicSpacer.ts"/>
///<reference path="IdTest.ts"/>
/**
 * Created by krr428 on 3/7/15.
 */

declare var accessToken;
declare var numGenerations;


class P implements IControllerListener, ITreeListener {

    private stylingPipeline:IStyler[]; // This changes based on
    private transformationPipline:IStyler[];

    private collapseSpacer:CollapseSpacer;
    private customSpacer:CustomSpacer;
    private translateSpacer:TranslateSpacer;
    private tree:ITree;

    private beforeTransformBoxes:BoxMap;
    private firstBoxMap:BoxMap;
    private secondBoxMap:BoxMap;

    constructor(private c:C) {

        this.customSpacer = new CustomSpacer();
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
                this.customSpacer.addCustomStyle(param.id, {
                    type: param.value
                    , color: param.color
                });
                refresh = true;
            }
            else if (param.type === 'changeGeneration') {
                var root:INode = this.tree.getRoot();
                console.log(root);
                var gen = this.getGeneration(root, param.id);
                console.log("Gen: " + gen);
                this.applyToGeneration(gen, root, param);
                refresh = true;
            }
            else if (param.type === 'changeAll') {
                var root:INode = this.tree.getRoot();
                //var gen = this.getGeneration(root, param.id);

                for (var gen = 0; gen < numGenerations; gen++) {
                    this.applyToGeneration(gen, root, param);
                }
                refresh = true;
            }
            else if (param.type === 'VP-view') {
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
                var currentPID = param.id;
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
            /*else if(param.type === 'detail-style' || param.type === 'vertical-style' ||
             param.type === 'eight-eleven-style' || param.type === 'eight-eleven-detail-style'){
             this.changeChartStyle(param.type);
             refresh = true;
             }*/
            else if (param.type === 'detail-style') {
                this.changeStyleDetail();
                refresh = true;
            }
            else if (param.type === 'vertical-style') {
                this.changeStyleVert();
                refresh = true;
            }
            else if (param.type === 'eight-eleven-style') {
                this.changeStyleEightEleven();
                refresh = true;
            }
            else if (param.type === 'eight-eleven-detail-style') {
                this.changeStyleEightElevenDetail();
                refresh = true;
            }
            else if (param.type === 'js-public-style') {
                this.changeStyleJSPublic();
                refresh = true;
            }
            else if (param.type === 'to-greyscale') {
                this.toggleGreyscale();
                refresh = true;
            }
            else if (param.type === 'to-branch-color') {
                this.changeToBranchColor();
                refresh = true;
            }
            else if (param.type === 'to-generation-color') {
                this.changeToGenColor();
                refresh = true;
            }
            else if (param.type === 'to-generation-color-vibrant') {
                this.changeToGenColorVibrant();
                refresh = true;
            }
            else if (param.type === 'to-gender-color') {
                this.changeToGenderColor();
                refresh = true;
            }
            else if (param.type === 'show-empty') {
                var showOption = document.getElementById('opg-show-empty').innerHTML;
                if (showOption === "Show Empty Boxes") {
                    this.showEmptyBoxes();
                    document.getElementById('opg-show-empty').innerHTML = "Hide Empty Boxes";
                    refresh = true;
                } else {
                    this.hideEmptyBoxes();
                    document.getElementById('opg-show-empty').innerHTML = "Show Empty Boxes";
                    refresh = true;
                }
            }
            else if (param.type === 'show-duplicates') {
                console.log('showing duplicates');
            }
        }

        if (refresh) {
            this.runPipeline();
        }
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

    private showEmptyBoxes() {
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

                countID = this.addBlanks(box, countID, numGenerations, list.length);
                //countID += 2;
            }
        }
        //console.log(this.tree.getTreeMap());
    }

    private addBlanks(box:string, countID:number, numGen:number, listLen:number):number {
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
        if (listLen < numGen) {
            newCount = this.addBlanks(String(countID), countID + 2, numGen, listLen);
            newCount = this.addBlanks(String(countID + 1), newCount, numGen, listLen);
        }

        if (newCount === -1) {
            newCount = countID + 2;
        }
        return newCount;
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
            this.customSpacer.addCustomStyle(node.getId(), {
                type: param.value
                , color: param.color
            });
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
        for (var i = 0; i < this.stylingPipeline.length; i++) {
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

    private changeStyleDetail():void {
        this.stylingPipeline = [];
        this.stylingPipeline.push(this.collapseSpacer);
        this.stylingPipeline.push(new SpacingSpacer());
        this.stylingPipeline.push(new DetailChartSpacer());
        this.stylingPipeline.push(this.customSpacer);
        this.stylingPipeline.push(new YSpacer());
    }

    private changeStyleVert():void {
        this.stylingPipeline = [];
        this.stylingPipeline.push(this.collapseSpacer);
        this.stylingPipeline.push(new SpacingSpacer());
        this.stylingPipeline.push(new VertDetChartSpacer());
        this.stylingPipeline.push(this.customSpacer);
        this.stylingPipeline.push(new YSpacer());
    }

    private changeStyleEightEleven():void {

        this.stylingPipeline = [];
        this.stylingPipeline.push(this.collapseSpacer);
        this.stylingPipeline.push(new SpacingSpacer());
        this.stylingPipeline.push(new EightElevenSpacer());
        this.stylingPipeline.push(this.customSpacer);
        this.stylingPipeline.push(new YSpacer());
    }

    private changeStyleEightElevenDetail():void {
        this.stylingPipeline = [];
        this.stylingPipeline.push(this.collapseSpacer);
        this.stylingPipeline.push(new SpacingSpacer());
        this.stylingPipeline.push(new EightElevenDetailSpacer());
        this.stylingPipeline.push(this.customSpacer);
        this.stylingPipeline.push(new YSpacer());
    }

    private changeStyleJSPublic():void {
        this.stylingPipeline = [];
        this.stylingPipeline.push(this.collapseSpacer);
        this.stylingPipeline.push(new SpacingSpacer());
        this.stylingPipeline.push(new JSPublicSpacer());
        this.stylingPipeline.push(this.customSpacer);
        this.stylingPipeline.push(new YSpacer());
    }

    private changeChartStyle(type:string):void {
        var temp = this.stylingPipeline;
        this.stylingPipeline = [];
        var i:number;
        for (i = 0; i < 2; i++) {
            this.stylingPipeline.push(temp[i]);
        }
        if (type === 'detail-style') {
            this.stylingPipeline.push(new DetailChartSpacer());
        }
        else if (type === 'vertical-style') {
            this.stylingPipeline.push(new VertDetChartSpacer());
        }
        else if (type === 'eight-eleven-style') {
            this.stylingPipeline.push(new EightElevenSpacer());
        }
        else if (type === 'eight-eleven-detail-style') {
            this.stylingPipeline.push(new EightElevenDetailSpacer());
        }
        else if (type === 'js-public-style') {
            this.stylingPipeline.push(new JSPublicSpacer());
        }
        for (i = 2; i < temp.length; i++) {
            this.stylingPipeline.push(temp[i]);
        }
    }

    private toggleGreyscale():void {
        var temp = this.stylingPipeline;
        this.stylingPipeline = [];
        var i:number;
        this.stylingPipeline.push(this.collapseSpacer);
        this.stylingPipeline.push(new GreyScaleSpacer());
        for (i = 2; i < temp.length; i++) {
            this.stylingPipeline.push(temp[i]);
        }
    }

    private changeToBranchColor():void {
        var temp = this.stylingPipeline;
        this.stylingPipeline = [];
        var i:number;
        this.stylingPipeline.push(this.collapseSpacer);

        if (this.c.dscOrAsc == "descendancy") {
            this.stylingPipeline.push(new ColorSpacer());
        } else {
            this.stylingPipeline.push(new AscColorSpacer());
        }

        //this.stylingPipeline.push(new ColorSpacer());
        for (i = 2; i < temp.length; i++) {
            this.stylingPipeline.push(temp[i]);
        }

    }

    private changeToGenColor():void {
        var temp = this.stylingPipeline;
        this.stylingPipeline = [];
        var i:number;
        this.stylingPipeline.push(this.collapseSpacer);
        this.stylingPipeline.push(new GenColorSpacer());
        for (i = 2; i < temp.length; i++) {
            this.stylingPipeline.push(temp[i]);
        }

    }

    private changeToGenColorVibrant():void {
        var temp = this.stylingPipeline;
        this.stylingPipeline = [];
        var i:number;
        this.stylingPipeline.push(this.collapseSpacer);
        this.stylingPipeline.push(new GenColorVibrantSpacer());
        for (i = 2; i < temp.length; i++) {
            this.stylingPipeline.push(temp[i]);
        }
    }

    private changeToGenderColor():void {
        var temp = this.stylingPipeline;
        this.stylingPipeline = [];
        var i:number;
        this.stylingPipeline.push(this.collapseSpacer);
        this.stylingPipeline.push(new GenderColorSpacer());
        for (i = 2; i < temp.length; i++) {
            this.stylingPipeline.push(temp[i]);
        }

    }

    private changeColorStyle(type:string):void {
        console.log(type);
        var temp = this.stylingPipeline;
        this.stylingPipeline = [];
        var i:number;
        this.stylingPipeline.push(this.collapseSpacer);
        if (type === 'to-greyscale') {
            console.log("Grey");
            this.stylingPipeline.push(new GreyScaleSpacer());
        }
        else if (type === 'to-branch-color')
            this.stylingPipeline.push(new GenColorSpacer());
        else if (type === 'to-generation-color')
            this.stylingPipeline.push(new ColorSpacer());
        else if (type === 'to-gender-color')
            this.stylingPipeline.push(new GenderColorSpacer());
        for (i = 2; i < temp.length; i++) {
            this.stylingPipeline.push(temp[i]);
        }

    }

}