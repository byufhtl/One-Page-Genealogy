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
///<reference path="SpacingSpacer.ts"/>
/**
 * Created by krr428 on 3/7/15.
 */

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
    private greyscale:boolean;

    constructor(private c: C) {

        this.greyscale = false;

        this.customSpacer = new CustomSpacer();
        this.collapseSpacer = new CollapseSpacer();
        this.translateSpacer = new TranslateSpacer();

        this.stylingPipeline = [];
        this.stylingPipeline.push(this.collapseSpacer);
        this.stylingPipeline.push(new ColorSpacer());
        //this.stylingPipeline.push(new GreyScaleSpacer());
        this.stylingPipeline.push(new SpacingSpacer());
        //this.stylingPipeline.push(new DetailChartSpacer());
        //his.stylingPipeline.push(new VertDetChartSpacer());
        if(c.dscOrAsc == "descendancy"){
            this.stylingPipeline.push(new VertDescDetChartSpacer());
        }else{
            this.stylingPipeline.push(new VertDetChartSpacer());
        }
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
                this.applyToGeneration(gen, root, param);
                refresh = true;
            }
            else if(param.type === 'changeIndColor') {
                this.customSpacer.addCustomStyle(param.id, {
                    color: param.value
                });
                refresh = true;
            }
            else if(param.type === 'changeGenColor') {
                console.log("value: "+param.value);
                var root:INode = this.tree.getRoot();
                var gen = this.getGeneration(root, param.id);
                this.applyColorToGeneration(gen, root, param);
                refresh = true;
            }
            else if(param.type === 'changeBranchColor') {
                var root:INode = this.tree.getRoot();
                this.applyColorToBranch(root, param);
                refresh = true;
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
            else if(param.type === 'toggle-greyscale'){
                this.greyscale = param.greyscale;
                this.toggleGreyscale();
                refresh = true;
            }
        }

        if(refresh) {
            this.runPipeline();
        }
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
        //console.log(node)
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

    private applyColorToGeneration(gen: number, node: INode, param: any) {
        if(gen === 0) {
            this.customSpacer.addCustomStyle(node.getId(), {
                color: param.value
            });
        }
        var branchIds: string[] = node.getBranchIds();
        //console.log(node);
        for(var i=0; i<branchIds.length; i++) {
            var child = this.tree.getId(branchIds[i]);
            if(child) {
                this.applyToGeneration(gen - 1, child, param);
            }
        }
    }

    private applyColorToBranch(node: INode, param: any) {
        this.customSpacer.addCustomStyle(node.getId(), {
            color: param.value
        });
        var branchIds: string[] = node.getBranchIds();
        //console.log(node);
        for(var i=0; i<branchIds.length; i++) {
            var child = this.tree.getId(branchIds[i]);
            if(child) {
                this.applyColorToBranch(child ,param);
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
    private toggleGreyscale():void{
        var temp = this.stylingPipeline;
        this.stylingPipeline = [];
        var i:number;
        //console.log("toggle Greyscale");
        //console.log(temp.length);
        if(this.greyscale) {
            //console.log("greyscale on");
            this.stylingPipeline.push(this.collapseSpacer);
            this.stylingPipeline.push(new GreyScaleSpacer());
            for (i = 2; i < temp.length; i++) {
                //console.log(temp[i]);
                this.stylingPipeline.push(temp[i]);
            }
        }
        else
        {
            //console.log("greyscale off");
            this.stylingPipeline.push(this.collapseSpacer);
            this.stylingPipeline.push(new ColorSpacer());
            for (i = 2; i < temp.length; i++) {
                //console.log(temp[i]);
                this.stylingPipeline.push(temp[i]);
            }
        }

    }

}