///<reference path="IBoxStyler.ts"/>
/**
 * Created by calvinmcm on 5/10/16.
 */

/**
 * The Null Box Style is a placeholder box that does very little other than create a place where a branch will appear to
 * suddenly branch although no node exists.
 */
class NullBoxStyle implements IBoxStyler{
    getName(){return StyleManager.NULL;}

    applyStyleTo(box :IBox, flavor_key :string){

        // Basic data
        box.setWidth(1);
        box.setHeight(1);
        var render_sched = new RenderInstructionSchedule().setFlavorKey(flavor_key);

        //console.log(render_sched.toString());

        box.setRenderInstructions(render_sched);
    }

    static NULL = "null_box";
    static OFFSET = 10;
}