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

    /**
     * Takes a box and applies to it the style set as it's type (box.getType()), defaulting to the TINY box style if the
     * registered type does not match any of the presets.
     * @param box the box to stylize
     * @param flavor_key The box flavor to use.
     */
    static stylize(box :IBox, flavor_key :string = null) :void{
        switch(box.getType()){
            case StyleManager.ENORMOUS:
                EnrBoxStyle.applyStyleTo(box, flavor_key);
                break;
            case StyleManager.HUGE:
                HugeBoxStyle.applyStyleTo(box, flavor_key);
                break;
            case StyleManager.LARGE:
                LargeBoxStyle.applyStyleTo(box, flavor_key);
                break;
            case StyleManager.MEDIUM:
                MediumBoxStyle.applyStyleTo(box, flavor_key);
                break;
            case StyleManager.SMALL:
                SmallBoxStyle.applyStyleTo(box, flavor_key);
                break;
            case StyleManager.MINI:
                MiniBoxStyle.applyStyleTo(box, flavor_key);
                break;
            case StyleManager.TINY:
                TinyBoxStyle.applyStyleTo(box, flavor_key);
                break;
            case StyleManager.NULL:
                NullBoxStyle.applyStyleTo(box);
                break;
            default:
                TinyBoxStyle.applyStyleTo(box, flavor_key);
        }
    }

    /**
     * Takes a box and applies to it the style set as it's type (box.getType()), defaulting to the TINY box style if the
     * registered type does not match any of the presets. Designed for boxes that just need minor cosmetic adjustments.
     * @param box
     * @param flavor_key
     */
    static restylize(box :IBox, flavor_key :string = null) :void{
        switch(box.getType()){
            case StyleManager.ENORMOUS:
                EnrBoxStyle.applyStyleTo(box, flavor_key, false);
                break;
            case StyleManager.HUGE:
                HugeBoxStyle.applyStyleTo(box, flavor_key, false);
                break;
            case StyleManager.LARGE:
                LargeBoxStyle.applyStyleTo(box, flavor_key, false);
                break;
            case StyleManager.MEDIUM:
                MediumBoxStyle.applyStyleTo(box, flavor_key, false);
                break;
            case StyleManager.SMALL:
                SmallBoxStyle.applyStyleTo(box, flavor_key, false);
                break;
            case StyleManager.MINI:
                MiniBoxStyle.applyStyleTo(box, flavor_key, false);
                break;
            case StyleManager.TINY:
                TinyBoxStyle.applyStyleTo(box, flavor_key, false);
                break;
            case StyleManager.NULL:
                NullBoxStyle.applyStyleTo(box);
                break;
            default:
                TinyBoxStyle.applyStyleTo(box, flavor_key, false);
        }
    }

}