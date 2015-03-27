///<reference path="IElement.ts"/>
///<reference path="BoxStyleFactory.ts"/>
/**
 * Created by curtis on 3/25/15.
 */
class BElement implements IElement {
    private g;
    private lastBox: IBox;

    constructor() {
        this.lastBox = null;
    }
    make(box: IBox, rootElement, graphicObject: IGraphicObject) {
        this.lastBox = box;
        this.g = BoxStyleFactory.getNewBoxStyle(box.getType()).render(box);
        this.define(box);

        rootElement.appendChild(this.g);
        var self = this;
        (function () {
            var hammer = new Hammer(self.g);
            //var pan = hammer.add(new Hammer.Pan({direction: Hammer.DIRECTION_ALL, threshold: 0}));
            hammer.on('tap', function (ev) {
                graphicObject.fireClick(self.getLastBox().getNode().getId());
            });
        })();
    }
    define(box: IBox) {
        this.lastBox = box;
        this.move(box);
    }
    move(box: IBox) {
        this.lastBox = box;
        BoxStyleFactory.getNewBoxStyle(box.getType()).move(box, this.g);
    }
    remove(rootElement) {
        this.lastBox = null;
        rootElement.removeChild(this.g);
    }
    getLastBox(): IBox {
        return this.lastBox;
    }
}