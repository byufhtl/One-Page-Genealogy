///<reference path="IElement.ts"/>
///<reference path="BoxStyleFactory.ts"/>
///<reference path="IGraphicObject.ts"/>
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
        this.g = BoxStyleFactory.getNewBoxStyle(box.getType()).render(box);
        this.define(box);

        rootElement.appendChild(this.g);
        //var self = this;
        //(function () {
        //    self.hammer = new Hammer(self.g);
        //    self.hammer.on('tap', function (ev) {
        //        graphicObject.fireClick(self.getLastBox().getNode().getId());
        //    });
        //})();
    }
    define(box: IBox) {
        box.copyContents(this.lastBox);
        this.move(box);
    }
    move(box: IBox) {
        box.copyContents(this.lastBox);
        BoxStyleFactory.getNewBoxStyle(box.getType()).move(box, this.g);
    }
    remove(rootElement) {
        this.lastBox = null;
        rootElement.removeChild(this.g);
        this.g = null;
    }
    getLastBox(): IBox {
        return this.lastBox;
    }
}