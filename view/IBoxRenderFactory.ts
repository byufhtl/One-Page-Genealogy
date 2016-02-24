///<reference path="IBoxRender"/>
/**
 * Created by calvinmcm on 2/24/16.
 */

interface IBoxRenderFactory{

    /**
     * Uses the given JSON object to create a BoxRender object that can be used in a box to determine its styling.
     * @param obj
     */
    getNewBoxRenderer(obj) : IBoxRender;

    /**
     * Retrieves the height of a given type of box, or 0 if the box is not registered.
     * @param type
     */
    getHeight(type: string) : number;

    /**
     * Retrieves the width of a given type of box, or 0 if the box is not registered.
     * @param type
     */
    getWidth(type:string) : number;

    /**
     * Returns whether or not a given box type requires loading.
     * @param type
     */
    requiresLoad(type:string) : boolean;

}