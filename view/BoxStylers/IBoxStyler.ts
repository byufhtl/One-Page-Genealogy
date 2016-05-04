///<reference path="../boxRenderers/StyleManager.ts"/>
/**
 * Created by calvinmcm on 4/14/16.
 */

/**
 * Provides some requirements for box style functions.
 * Used in all prefabricated and custom box styles as a template framework.
 */
interface IBoxStyler{
    getName();
    applyStyleTo(box :IBox, showMarriage :boolean, flavor_key :string);
}