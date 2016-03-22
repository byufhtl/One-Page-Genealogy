///<reference path="./BoxMap.ts"/>
/**
 * Created by curtis on 3/11/15.
 */
interface IOptionListener {
    handleOption(key:string, value:any):void;
    getBoxes():BoxMap;
}