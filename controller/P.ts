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
/**
 * Created by krr428 on 3/7/15.
 */

class P implements IControllerListener, ITreeListener {

    private stylingPipeline: IStyler[]; // This changes based on
    private collapseSpacer: CollapseSpacer;
    private customSpacer: CustomSpacer;
    private tree:ITree;

    constructor(private c: C) {
        this.customSpacer = new CustomSpacer();
        this.collapseSpacer
            = new CollapseSpacer();

        this.stylingPipeline = [];
        this.stylingPipeline.push(this.collapseSpacer);
        this.stylingPipeline.push(new SimpleGenerationSpacer());
        this.stylingPipeline.push(this.customSpacer);
        this.stylingPipeline.push(new YSpacer());
    }
    handle(param: any): void {
        var refresh = false;
        if(param.type) {
            if(param.type === 'changeIndividual') {
                this.customSpacer.addCustomStyle(param.id, {
                    type: param.value
                });
            }
            else if(param.type === 'changeGeneration') {
                var root:INode = this.tree.getRoot();
                var gen = this.getGeneration(root, param.id);
                this.applyToGeneration(gen, root, param);
            }
            else if(param.type === 'collapse-sub-tree') {
                this.collapseSpacer.collapseId(param.id, true);
            }

            refresh = true;
        }

        if(refresh) {
            this.runPipeline();
        }
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
                    return childNum + 1;
                }
            }
        }
        return -1;
    }
    private applyToGeneration(gen: number, node: INode, param: any) {
        if(gen === 0) {
            this.customSpacer.addCustomStyle(node.getId(), {
                type: param.value
            });
        }
        var branchIds: string[] = node.getBranchIds();
        for(var i=0; i<branchIds.length; i++) {
            var child = this.tree.getId(branchIds[i]);
            if(child) {
                this.applyToGeneration(gen - 1, child, param);
            }
        }
    }

    handleUpdate(tree: ITree): void {
        this.tree = tree;
        this.runPipeline();
    }
    private runPipeline():void {
        var boxMap: BoxMap = this.tree.asBoxMap();
        for(var i=0; i<this.stylingPipeline.length; i++) {
            this.stylingPipeline[i].applyStyle(boxMap);
        }
        this.c.refresh(boxMap);
    }

}