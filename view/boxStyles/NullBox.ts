///<reference path="../IBoxRender.ts"/>
///<reference path="../../util/DateFormat.ts"/>
///<reference path="../../util/StringUtils.ts"/>
/**
 * Created by renae on 8/18/15.
 */
class NullBox implements IBoxRender {
    render(box:IBox, rootElement): any {
        var g:Element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        if(rootElement) {
            rootElement.appendChild(g);
        }

        if(isNaN(box.getY())) {
            console.log(box);
        }

        g.setAttribute("transform","translate("+box.getX()+", "+box.getY()+")");

        return g;
    }
    move(box:IBox, graphic: any): any {
        //graphic.setAttribute("transform","translate("+(box.getX()+2)+", "+(box.getY()+4)+")");
        graphic.setAttribute("transform","translate("+(box.getX()+2)+", "+
            (box.getY()+1+Math.round(box.getSpace()/2))+")");
    }
    getType(): string {
        return "nullBox";
    }
    getHeight(): number {
        return 500;
    }
    getWidth(): number {
        return 199+2+3;//214;
    }
    requiresLoad(): boolean {
        return true;
    }
}