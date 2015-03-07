/**
 * Created by curtis on 3/7/15.
 */
/// <reference path="model/INode.ts"/>

interface ISourceListener {
    gotNode(node: INode): void;
    done(): void;
}