///<reference path="IStyler.ts"/>
///<reference path="BoxMap.ts"/>

/**
 * Created by calvinmcm on 2/23/16.
 */

interface IPipeline{

     /** Used to add an element to the pipeline
      * @param element The element to add.
      */
    add(element:IStyler) : void;

    /**
     * Runs the pipeline.
     */
    runPipeline(boxes:BoxMap) : void;

    /**
     * Empties the pipeline.
     */
    clearPipeline() :void;
}