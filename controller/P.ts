///<reference path="IStyler.ts"/>
///<reference path="IControllerListener.ts"/>
///<reference path="../model/ITreeListener.ts"/>
///<reference path="SimpleGenerationSpacer.ts"/>
///<reference path="YSpacer.ts"/>
///<reference path="../view/IViewManager.ts"/>
///<reference path="CustomSpacer.ts"/>
///<reference path="C.ts"/>
///<reference path="LeafNodeSpacer.ts"/>
/**
 * Created by krr428 on 3/7/15.
 */

class P implements IControllerListener, ITreeListener {

    private stylingPipeline: IStyler[]; // This changes based on
    private customSpacer: CustomSpacer;
    private tree:ITree;

    constructor(private c: C) {
        this.stylingPipeline = [];
        this.stylingPipeline.push(new SimpleGenerationSpacer());
        this.stylingPipeline.push(new LeafNodeSpacer());
        this.customSpacer = new CustomSpacer();
        this.stylingPipeline.push(this.customSpacer);
        this.stylingPipeline.push(new YSpacer());
    }
    handle(param: any): void {
        var refresh = false;
        if(param.type) {
            this.customSpacer.addCustomStyle(param.id, {
                type: param.type
            });
            refresh = true;
        }

        if(refresh) {
            this.runPipeline();
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