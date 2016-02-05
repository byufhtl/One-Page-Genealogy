///<reference path="../IBoxRender.ts"/>
///<reference path="../../util/DateFormat.ts"/>
///<reference path="../../util/StringUtils.ts"/>
///<reference path="../IBoxData.ts"/>
/**
 * Created by curtis on 3/16/15.
 */
class XSNameBox extends IBoxData {
    render(box:IBox, rootElement): any {
        var g:Element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        if(rootElement) {
            rootElement.appendChild(g);
        }
        var rect:Element = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        g.appendChild(rect);

        rect.setAttribute('width', String(this.getWidth()-1));
        rect.setAttribute('height', String(box.getHeight()-1-box.getSpace()-1));

        if(isNaN(box.getY())) {
            console.log(box);
        }

        g.setAttribute("transform","translate("+box.getX()+", "+box.getY()+")");


        rect.setAttribute('rx', "5");
        rect.setAttribute('ry', "5");
        rect.setAttribute('stroke-width', '1');
        rect.setAttribute('stroke', 'black');


        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text);

        var node: INode = box.getNode();
        if(node.hasAttr('name')) {
            var nameTextPath = document.createTextNode(box.getNode().getAttr('name'));
            text.appendChild(nameTextPath);
            text.setAttribute("x", "10");
            text.setAttribute("y", "8");
            text.setAttribute("font-size", "9px");
            text.setAttribute("fill", box.getTextColor());
            text.setAttribute("style", this.getFont() );
            StringUtils.centerElement(text, 0, 162);
        }


        var gender = 'none';
        if(node.hasAttr('gender')) {
            gender = node.getAttr('gender');
        }
        if(box.getColor()!= null){
            rect.setAttribute('fill', box.getColor());
        }
        else if(gender === 'Male') {
            rect.setAttribute('fill','#8DEEEE');
        }
        else if(gender === 'Female') {
            rect.setAttribute('fill','#FFD1DC');
        }
        else {
            rect.setAttribute('fill','#E5E5E5');
        }

        return g;
    }
    move(box:IBox, graphic: any): any {
        //graphic.setAttribute("transform","translate("+(box.getX()+1)+", "+(box.getY()+1)+")");
        graphic.setAttribute("transform","translate("+(box.getX()+1)+", "+
            (box.getY()+1/2+Math.round(box.getSpace()/2))+")");
    }
    getType(): string {
        return "xsNameBox";
    }
    getHeight(): number {
        return 10+3;
    }
    getWidth(): number {
        return 162;
    }
    requiresLoad(): boolean {
        return false;
    }
}