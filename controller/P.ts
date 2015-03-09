///<reference path="IStyler.ts"/>
///<reference path="IControllerListener.ts"/>
///<reference path="../model/ITreeListener.ts"/>
///<reference path="SimpleGenerationSpacer.ts"/>
///<reference path="YSpacer.ts"/>
///<reference path="../view/IViewManager.ts"/>
///<reference path="CustomSpacer.ts"/>
/**
 * Created by krr428 on 3/7/15.
 */

class P implements IControllerListener, ITreeListener {

    private stylingPipeline: IStyler[]; // This changes based on
    private viewManager;
    private customSpacer: CustomSpacer;

    constructor() {
        this.stylingPipeline = [];
        this.stylingPipeline.push(new SimpleGenerationSpacer());
        this.customSpacer = new CustomSpacer();
        this.stylingPipeline.push(this.customSpacer);
        this.stylingPipeline.push(new YSpacer());
        this.viewManager = {
            refresh(boxes: BoxMap): void {
                console.log(boxes);
            }
        };
    }
    handle(param: any): void {
        console.log("The controller listener was fired.");
    }

    handleUpdate(tree: ITree): void {
        var boxMap: BoxMap = tree.asBoxMap();
        for(var i=0; i<this.stylingPipeline.length; i++) {
            this.stylingPipeline[i].applyStyle(boxMap);
        }
        this.viewManager.refresh(boxMap);
    }
    setViewManager(viewManager: IViewManager) {
        this.viewManager = viewManager;
    }


}