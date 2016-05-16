///<reference path="../../model/IBox.ts"/>
///<reference path="../boxRenderers/RenderInstructionSchedule.ts"/>
/**
 * Created by calvinmcm on 5/10/16.
 * Last Updated 5/13/16.
 *
 *
 * The Null Box Style is a placeholder box that does very little other than create a place where a branch will appear to
 * suddenly branch although no node exists.
 */
class NullBoxStyle{

    public static applyStyleTo(box :IBox) :void{

        //~~~ Setup ~~~

        box.setWidth(1);
        box.setHeight(1);
        box.setRenderInstructions(new RenderInstructionSchedule().setFlavorKey(this.NULL));
    }

    static NULL = "null_box";
    static OFFSET = 10;
}