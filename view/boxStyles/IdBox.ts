///<reference path="../IBoxRender.ts"/>
///<reference path="../../util/DateFormat.ts"/>
///<reference path="../../util/StringUtils.ts"/>
/**
 * Created by renae on 9/18/15.
 */
class IdBox implements IBoxRender {
    render(box:IBox, rootElement): any {
        var g:Element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        var gt:Element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        if(rootElement) {
            rootElement.appendChild(g);
        }
        var rect:Element = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        g.appendChild(rect);
        g.appendChild(gt);

        rect.setAttribute('width', String(this.getWidth()-4));
        rect.setAttribute('height', String(box.getHeight()-2-box.getSpace()));

        if(isNaN(box.getY())) {
            console.log(box);
        }

        g.setAttribute("transform","translate("+box.getX()+", "+box.getY()+")");


        rect.setAttribute('rx', "20");
        rect.setAttribute('ry', "20");
        rect.setAttribute('stroke-width', '2');
        rect.setAttribute('stroke', 'black');

        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        gt.appendChild(text);
        var node = box.getNode();
        if (node.hasAttr('name')) {
            var fullname = (box.getNode().getAttr('name'));

            var nameTextPath = document.createTextNode("");
            text.appendChild(nameTextPath);
            text.setAttribute("x", "15");
            text.setAttribute("y", "15");
            text.setAttribute("font-size", "15px");
            text.setAttribute("style", "font-family:tahoma, sans-serif");
            StringUtils.fitName(text, fullname, 25);
        }

        var text3 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        gt.appendChild(text3);
        var ID = document.createTextNode(node.getId());
        text3.appendChild(ID);
        text3.setAttribute("x", "15");
        text3.setAttribute("y", "32");
        text3.setAttribute("font-size", "15px");
        text3.setAttribute("style", "font-family:tahoma, sans-serif");

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

        //gt.setAttribute("transform","translate(0, "+ (this.getHeight()-2)+") rotate(-90 0,0)");

        return g;
    }
    move(box:IBox, graphic: any): any {
        //graphic.setAttribute("transform","translate("+(box.getX()+2)+", "+(box.getY()+4)+")");
        graphic.setAttribute("transform","translate("+(box.getX()+2)+", "+
            (box.getY()+1+Math.round(box.getSpace()/2))+")");
    }
    getType(): string {
        return "idBox";
    }
    getHeight(): number {
        return 40+2+3;//500;
    }
    getWidth(): number {
        return 250;//214;
    }
    requiresLoad(): boolean {
        return false;
    }
}
