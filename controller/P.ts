///<reference path="IStyler.ts"/>
///<reference path="IControllerListener.ts"/>
/**
 * Created by krr428 on 3/7/15.
 */

class P implements IControllerListener {

    stylingPipeline: IStyler[]; // This changes based on

    handle(param: any): void {
        console.log("The controller listener was fired.");
    }
}