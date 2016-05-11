///<reference path="../../model/IBox.ts"/>
///<reference path="RenderInstructionSchedule.ts"/>
///<reference path="../BoxStylers/EnrBoxStyle.ts"/>
///<reference path="../BoxStylers/HugeBoxStyle.ts"/>
///<reference path="../BoxStylers/LargeBoxStyle.ts"/>
///<reference path="../BoxStylers/MediumBoxStyle.ts"/>
///<reference path="../BoxStylers/SmallBoxStyle.ts"/>
///<reference path="../BoxStylers/MiniBoxStyle.ts"/>
///<reference path="../BoxStylers/TinyBoxStyle.ts"/>
///<reference path="../BoxStylers/NullBoxStyle.ts"/>

/**
 * Created by calvinmcm on 4/13/16.
 */

/**
 * The StyleManager is designed as a separate static class for easy referencing by other classes. It's purpose is to
 * make box style generation central to a single spot for easy future modification and customization. It also makes for
 * a good place to store static naming variables. Centralization also makes it to that stylers only need be instantiated
 * once, which should not only save space, but will save loads of time in initializing of objects.
 */
class StyleManager{

    static ENORMOUS = "Enormous";
    static HUGE     = "Huge";
    static LARGE    = "Large";
    static MEDIUM   = "Medium";
    static SMALL    = "Small";
    static MINI     = "Mini";
    static TINY     = "Tiny";
    static NULL     = "Null";

    // Styler options. Creates a static version of the object that can be used by this class only.
    private static ENR_STYLER   = new EnrBoxStyle();
    private static HUGE_STYLER  = new HugeBoxStyle();
    private static LARGE_STYLER  = new LargeBoxStyle();
    private static MEDIUM_STYLER  = new MediumBoxStyle();
    private static SMALL_STYLER  = new SmallBoxStyle();
    private static MINI_STYLER  = new MiniBoxStyle();
    private static TINY_STYLER  = new TinyBoxStyle();
    private static NULL_STYLER = new NullBoxStyle();


    /**
     * Takes a box and applies to it the style set as it's type (box.getType()), defaulting to the TINY box style if the
     * registered type does not match any of the presets.
     * @param box
     * @param showMarriage
     */
    static stylize(box :IBox, flavor_key :string = null) :void{
        //console.log("Stylizing box for " + box.getNode().getAttr("name"));
        switch(box.getType()){
            case StyleManager.ENORMOUS:
                StyleManager.ENR_STYLER.applyStyleTo(box, flavor_key);
                break;
            case StyleManager.HUGE:
                StyleManager.HUGE_STYLER.applyStyleTo(box, flavor_key);
                break;
            case StyleManager.LARGE:
                StyleManager.LARGE_STYLER.applyStyleTo(box, flavor_key);
                break;
            case StyleManager.MEDIUM:
                StyleManager.MEDIUM_STYLER.applyStyleTo(box, flavor_key);
                break;
            case StyleManager.SMALL:
                StyleManager.SMALL_STYLER.applyStyleTo(box, flavor_key);
                break;
            case StyleManager.MINI:
                StyleManager.MINI_STYLER.applyStyleTo(box, flavor_key);
                break;
            case StyleManager.TINY:
                StyleManager.TINY_STYLER.applyStyleTo(box, flavor_key);
                break;
            case StyleManager.NULL:
                StyleManager.NULL_STYLER.applyStyleTo(box, NullBoxStyle.NULL);
                break;
            default:
                StyleManager.TINY_STYLER.applyStyleTo(box, flavor_key);
        }
    }


}