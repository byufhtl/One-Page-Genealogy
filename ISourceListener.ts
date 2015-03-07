/**
 * Created by curtis on 3/7/15.
 */
/// <reference path="INode.ts"/>

interface ISourceListener {
    gotNode(node:INode):void;
    done():void;
}