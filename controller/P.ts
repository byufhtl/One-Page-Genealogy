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

    private stylingPipeline: IStyler[]; // This changes based on
    private transformationPipline: IStyler[];

    private collapseSpacer: CollapseSpacer;
    private customSpacer: CustomSpacer;
    private translateSpacer: TranslateSpacer;
    private tree:ITree;

    private beforeTransformBoxes: BoxMap;
    private firstBoxMap: BoxMap;
    private secondBoxMap: BoxMap;

    constructor(private c: C) {

        this.customSpacer = new CustomSpacer();
        this.collapseSpacer = new CollapseSpacer();
        this.translateSpacer = new TranslateSpacer();

        this.stylingPipeline = [];
        this.stylingPipeline.push(this.collapseSpacer);
        if(c.dscOrAsc == "descendancy"){
            this.stylingPipeline.push(new ColorSpacer());
        }else{
            this.stylingPipeline.push(new AscColorSpacer());
        }
        //this.stylingPipeline.push(new GreyScaleSpacer());
        this.stylingPipeline.push(new SpacingSpacer());
        //this.stylingPipeline.push(new DetailChartSpacer());
        //his.stylingPipeline.push(new VertDetChartSpacer());
        if(c.dscOrAsc == "descendancy"){
            //this.stylingPipeline.push(new JSstyleSpacer());
            this.stylingPipeline.push(new JSPublicSpacer());
        }else{
            this.stylingPipeline.push(new VertDetChartSpacer());
        }
        //this.stylingPipeline.push(new IdTest());
        //this.stylingPipeline.push(new EightElevenSpacer());
        //this.stylingPipeline.push(new EightElevenDetailSpacer());
        //this.stylingPipeline.push(new GenerationSpacer2());
        //this.stylingPipeline.push(new SimpleGenerationSpacer());
        this.stylingPipeline.push(this.customSpacer);
        this.stylingPipeline.push(new YSpacer());

        //this.stylingPipeline.push(this.translateSpacer);

        this.transformationPipline = [];
        this.transformationPipline.push(this.translateSpacer);
    }
    handle(param: any): any {
        var refresh = false;
        if(param.type) {
            if(param.type === 'changeIndividual') {
                this.customSpacer.addCustomStyle(param.id, {
                    type: param.value
                });
                refresh = true;
            }
            else if(param.type === 'changeGeneration') {
                var root:INode = this.tree.getRoot();
                var gen = this.getGeneration(root, param.id);
                console.log("Gen: "+gen);
                this.applyToGeneration(gen, root, param);
                refresh = true;
            }
            else if(param.type === 'changeAll'){
                var root:INode = this.tree.getRoot();
                //var gen = this.getGeneration(root, param.id);

                for(var gen=0; gen < 20; gen++) {
                    this.applyToGeneration(gen, root, param);
                }
                refresh = true;
            }
            else if(param.type === 'VP-view'){
                //console.log(this.tree.getTreeMap());
                var childMap: {[key: string]: string} = {};
                var treeMap = this.tree.getTreeMap();
                for(var key in treeMap){
                    if(treeMap.hasOwnProperty(key)){
                        if(treeMap[key].getBranchIds().length > 0) {
                            for (var i in treeMap[key].getBranchIds()) {
                                childMap[treeMap[key].getBranchIds()[i].substring(0,8)] = key.substring(0,8);
                            }
                        }
                    }
                }
                var list = [];
                var currentPID = param.id;
                list.push(currentPID);
                while(childMap[currentPID] != null){
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
            else if(param.type === 'collapse-sub-tree') {
                this.collapseSpacer.collapseId(param.id, true);
                refresh = true;
            }
            else if(param.type === 'expand-sub-tree') {
                this.collapseSpacer.collapseId(param.id, false);
                refresh = true;
            }
            else if(param.type === 'update-translate') {
                this.translateSpacer.setTranslation(param.dx, param.dy);
                refresh = true;
            }
            else if(param.type === 'getBoxByPoint') {
                return this.getBoxByPoint(param.pt);
            }
            /*else if(param.type === 'detail-style' || param.type === 'vertical-style' ||
                param.type === 'eight-eleven-style' || param.type === 'eight-eleven-detail-style'){
                this.changeChartStyle(param.type);
                refresh = true;
            }*/
            else if(param.type === 'detail-style'){
                this.changeStyleDetail();
                refresh = true;
            }
            else if(param.type === 'vertical-style'){
                this.changeStyleVert();
                refresh = true;
            }
            else if(param.type === 'eight-eleven-style'){
                this.changeStyleEightEleven();
                refresh = true;
            }
            else if(param.type === 'eight-eleven-detail-style'){
                this.changeStyleEightElevenDetail();
                refresh = true;
            }
            else if(param.type === 'js-public-style'){
                this.changeStyleJSPublic();
                refresh = true;
            }
            /*else if(param.type == 'to-greyscale' || param.type =='to-branch-color'
                || param.type == 'to-gender-color'){
                this.changeColorStyle(param.type);
                refresh = true;
            }*/
            else if(param.type === 'to-greyscale'){
                this.toggleGreyscale();
                refresh = true;
            }
            else if(param.type === 'to-branch-color'){
                this.changeToBranchColor();
                refresh = true;
            }
            else if(param.type === 'to-generation-color'){
                this.changeToGenColor();
                refresh = true;
            }
            else if(param.type === 'to-gender-color'){
                this.changeToGenderColor();
                refresh = true;
            }else if(param.type === 'show-empty'){
                var childMap: {[key: string]: string} = {};
                var treeMap = this.tree.getTreeMap();
                //Create Child Map:
                for(var key in treeMap){
                    if(treeMap.hasOwnProperty(key)){
                        if(treeMap[key].getBranchIds().length > 0) {
                            for (var i in treeMap[key].getBranchIds()) {
                                var index = treeMap[key].getBranchIds()[i];
                                if(index.indexOf(":") === 8) {
                                    childMap[index] = key;
                                }
                            }
                        }
                    }
                }

                var countID = -1;
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
                        refresh = true;
                    }
                }
            }
        }

        if(refresh) {
            this.runPipeline();
        }
    }

    private addBlanks(box: string, countID: number, numGen: number, listLen: number) : number{
        //console.log(box + ": (" + String(countID + 1) + "," + String(countID + 2) + ")");
        this.firstBoxMap.getId(box).getNode().setBranchIds([String(countID + 1), String(countID + 2)]);
        listLen++;
        var newCount = -1;
        if(listLen < numGen){
            newCount = this.addBlanks(String(countID + 1), countID + 2, numGen, listLen);
            newCount = this.addBlanks(String(countID + 2), newCount, numGen, listLen);
        }

        if(newCount === -1){
            newCount = countID + 2;
        }
        return newCount;
    }

    private getBoxByPoint(pt: Point): IBox {

        var queue = [];

        queue.push(this.secondBoxMap.getRoot());
        while(queue.length > 0) {
            var nextId: string = queue.shift();
            var nextBox: IBox = this.secondBoxMap.getId(nextId);

            if(!nextBox) {
                continue;
            }

            if(nextBox.hitTest(pt)) {
                return nextBox;
            }

            var nextNode: INode = nextBox.getNode();
            var childrenIds: string[] = nextNode.getBranchIds();

            if(nextBox.isCollapsed()) {
                continue;
            }

            for(var i=0; i<childrenIds.length; i++) {
                queue.push(childrenIds[i]);
            }
        }
        return null;
    }
    private getGeneration(node: INode, target: string): number {
        if(node.getId() == target) {
            return 0;
        }
        var branchIds: string[] = node.getBranchIds();
        for(var i=0; i<branchIds.length; i++) {
            var child = this.tree.getId(branchIds[i]);
            if(child) {
                var childNum: number = this.getGeneration(child, target);
                if(childNum > -1) {
                    if(child.getDisplaySpouse() != null && this.c.dscOrAsc == "descendancy"){
                        if(child.getDisplaySpouse().getSpouses().length > 1){
                            return childNum
                        }
                    }
                    if(child.getSpouses().length >1)
                        return childNum;
                    return childNum + 1;
                }
            }
        }
        return -1;
    }
    private applyToGeneration(gen: number, node: INode, param: any) {
        if(gen === 0&&node.getSpouses().length < 2) {
            this.customSpacer.addCustomStyle(node.getId(), {
                type: param.value
            });
        }
        var branchIds: string[] = node.getBranchIds();
        for(var i=0; i<branchIds.length; i++) {
            var child = this.tree.getId(branchIds[i]);
            if(child) {
                if(child.getSpouses().length > 1){
                    this.applyToGeneration(gen, child, param);
                }else{
                    this.applyToGeneration(gen - 1, child, param);
                }
            }
        }
    }

    handleUpdate(tree: ITree, updates: ICommand[]): void {
        this.tree = tree;
        for(var i=0; i<updates.length; i++) {
            var command: ICommand = updates[i];
            if(command.getType() === "add-node") {
                var node:INode = command.getValue();

                if(!this.firstBoxMap) {
                    this.firstBoxMap = new BoxMap(node.getId());
                    this.secondBoxMap = new BoxMap(node.getId());
                }

                this.firstBoxMap.setId(node.getId(), new AbstractBox(node));
                this.secondBoxMap.setId(node.getId(), new AbstractBox(node));
            }else{
                console.log("Error: Unknown Command");
            }
        }
        this.runPipeline();
    }
    private runPipeline():void {
        for(var i=0; i<this.stylingPipeline.length; i++) {
            this.stylingPipeline[i].applyStyle(this.firstBoxMap);
        }
        this.runTranslationPipeline(this.firstBoxMap);
        this.c.refresh(this.secondBoxMap);
    }
    private runTranslationPipeline(boxMap: BoxMap): BoxMap {
        boxMap.copyContents(this.secondBoxMap);
        for(var i=0; i<this.transformationPipline.length; i++) {
            this.transformationPipline[i].applyStyle(this.secondBoxMap);
        }
        return this.secondBoxMap;
    }
    private changeStyleDetail():void{
        this.stylingPipeline = [];
        this.stylingPipeline.push(this.collapseSpacer);
        this.stylingPipeline.push(new SpacingSpacer());
        this.stylingPipeline.push(new DetailChartSpacer());
        this.stylingPipeline.push(this.customSpacer);
        this.stylingPipeline.push(new YSpacer());
    }
    private changeStyleVert():void{
        this.stylingPipeline = [];
        this.stylingPipeline.push(this.collapseSpacer);
        this.stylingPipeline.push(new SpacingSpacer());
        this.stylingPipeline.push(new VertDetChartSpacer());
        this.stylingPipeline.push(this.customSpacer);
        this.stylingPipeline.push(new YSpacer());
    }
    private changeStyleEightEleven():void{

        this.stylingPipeline = [];
        this.stylingPipeline.push(this.collapseSpacer);
        this.stylingPipeline.push(new SpacingSpacer());
        this.stylingPipeline.push(new EightElevenSpacer());
        this.stylingPipeline.push(this.customSpacer);
        this.stylingPipeline.push(new YSpacer());
    }
    private changeStyleEightElevenDetail():void{
        this.stylingPipeline = [];
        this.stylingPipeline.push(this.collapseSpacer);
        this.stylingPipeline.push(new SpacingSpacer());
        this.stylingPipeline.push(new EightElevenDetailSpacer());
        this.stylingPipeline.push(this.customSpacer);
        this.stylingPipeline.push(new YSpacer());
    }
    private changeStyleJSPublic():void{
        this.stylingPipeline = [];
        this.stylingPipeline.push(this.collapseSpacer);
        this.stylingPipeline.push(new SpacingSpacer());
        this.stylingPipeline.push(new JSPublicSpacer());
        this.stylingPipeline.push(this.customSpacer);
        this.stylingPipeline.push(new YSpacer());
    }
    private changeChartStyle(type:string):void{
        var temp = this.stylingPipeline;
        this.stylingPipeline = [];
        var i:number;
        for (i = 0; i < 2; i++) {
            this.stylingPipeline.push(temp[i]);
        }
        if(type==='detail-style') {
            this.stylingPipeline.push(new DetailChartSpacer());
        }
        else if(type==='vertical-style'){
            this.stylingPipeline.push(new VertDetChartSpacer());
        }
        else if(type==='eight-eleven-style'){
            this.stylingPipeline.push(new EightElevenSpacer());
        }
        else if(type==='eight-eleven-detail-style'){
            this.stylingPipeline.push(new EightElevenDetailSpacer());
        }
        else if(type==='js-public-style'){
            this.stylingPipeline.push(new JSPublicSpacer());
        }
        for (i = 2; i < temp.length; i++) {
            this.stylingPipeline.push(temp[i]);
        }
    }
    private toggleGreyscale():void{
        var temp = this.stylingPipeline;
        this.stylingPipeline = [];
        var i:number;
        this.stylingPipeline.push(this.collapseSpacer);
        this.stylingPipeline.push(new GreyScaleSpacer());
        for (i = 2; i < temp.length; i++) {
            this.stylingPipeline.push(temp[i]);
        }

    }
    private changeToBranchColor():void{
        var temp = this.stylingPipeline;
        this.stylingPipeline = [];
        var i:number;
        this.stylingPipeline.push(this.collapseSpacer);

        if(this.c.dscOrAsc == "descendancy"){
            this.stylingPipeline.push(new ColorSpacer());
        }else{
            this.stylingPipeline.push(new AscColorSpacer());
        }

        //this.stylingPipeline.push(new ColorSpacer());
        for (i = 2; i < temp.length; i++) {
            this.stylingPipeline.push(temp[i]);
        }

    }
    private changeToGenColor():void{
        var temp = this.stylingPipeline;
        this.stylingPipeline = [];
        var i:number;
        this.stylingPipeline.push(this.collapseSpacer);
        this.stylingPipeline.push(new GenColorSpacer());
        for (i = 2; i < temp.length; i++) {
            this.stylingPipeline.push(temp[i]);
        }

    }
    private changeToGenderColor():void{
        var temp = this.stylingPipeline;
        this.stylingPipeline = [];
        var i:number;
        this.stylingPipeline.push(this.collapseSpacer);
        this.stylingPipeline.push(new GenderColorSpacer());
        for (i = 2; i < temp.length; i++) {
            this.stylingPipeline.push(temp[i]);
        }

    }
    private changeColorStyle(type:string):void{
        console.log(type);
        var temp = this.stylingPipeline;
        this.stylingPipeline = [];
        var i:number;
        this.stylingPipeline.push(this.collapseSpacer);
        if(type === 'to-greyscale') {
            console.log("Grey");
            this.stylingPipeline.push(new GreyScaleSpacer());
        }
        else if(type === 'to-branch-color')
            this.stylingPipeline.push(new GenColorSpacer());
        else if(type === 'to-generation-color')
            this.stylingPipeline.push(new ColorSpacer());
        else if(type === 'to-gender-color')
            this.stylingPipeline.push(new GenderColorSpacer());
        for (i = 2; i < temp.length; i++) {
            this.stylingPipeline.push(temp[i]);
        }

    }

}