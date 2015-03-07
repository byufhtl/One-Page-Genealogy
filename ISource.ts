/**
 * Created by curtis on 3/7/15.
 */
/// <reference path="ISourceListener.ts"/>

interface ISource {
    start(id:string):void;
    addListener(listener:ISourceListener):void;
    pause():void;
    play():void;
}