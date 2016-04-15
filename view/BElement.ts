///<reference path="IElement.ts"/>
///<reference path="BoxStyleFactory.ts"/>
///<reference path="IGraphicObject.ts"/>
///<reference path="boxRenderers/Renderer.ts"/>
/**
 * Created by curtis on 3/25/15.
 */
class BElement implements IElement {
    private g;
    private lastBox: IBox;
    private hammer;

    constructor() {
        this.lastBox = null;
    }
    make(box: IBox, rootElement, graphicObject: IGraphicObject) {
        this.lastBox = box.copy();
        this.g = Renderer.renderBox(box,rootElement);
        this.define(box, rootElement);
        if(this.g) {
            rootElement.appendChild(this.g);
        }
        //var self = this;
        //(function () {
        //    self.hammer = new Hammer(self.g);
        //    self.hammer.on('tap', function (ev) {
        //        graphicObject.fireClick(self.getLastBox().getNode().getId());
        //    });
        //})();
    }
    define(box: IBox, rootElement) {
        box.copyContents(this.lastBox);
        this.move(box, rootElement);
    }
    move(box: IBox, rootElement) {
        box.copyContents(this.lastBox);
        Renderer.move(box, this.g, rootElement);
    }
    remove(rootElement) {
        this.lastBox = null;
        if(this.g) {
            rootElement.removeChild(this.g);
            this.g = null;
        }
    }
    getLastBox(): IBox {
        return this.lastBox;
    }
}