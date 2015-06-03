///<reference path="../IBoxRender.ts"/>
///<reference path="../../util/DateFormat.ts"/>
///<reference path="../../util/StringUtils.ts"/>
/**
 * Created by curtis on 3/16/15.
 */
class XSNameBox implements IBoxRender {
    render(box:IBox, rootElement): any {
        var g:Element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        if(rootElement) {
            rootElement.appendChild(g);
        }
        var rect:Element = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        g.appendChild(rect);

        rect.setAttribute('width', String(this.getWidth()));
        rect.setAttribute('height', String(this.getHeight()));

        if(isNaN(box.getY())) {
            console.log(box);
        }

        g.setAttribute("transform","translate("+box.getX()+", "+box.getY()+")");


        rect.setAttribute('rx', "5");
        rect.setAttribute('ry', "5");
        rect.setAttribute('stroke-width', '1');


        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text);

        var node: INode = box.getNode();
        if(node.hasAttr('name')) {
            var nameTextPath = document.createTextNode(box.getNode().getAttr('name'));
            text.appendChild(nameTextPath);
            text.setAttribute("x", "10");
            text.setAttribute("y", "8");
            text.setAttribute("font-size", "10px");
            StringUtils.centerElement(text, 0, 200);
        }

        //var text3 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        //g.appendChild(text3);
        //var nameTextPath = document.createTextNode("");
        //text3.appendChild(nameTextPath);
        //text3.setAttribute("x", "10");
        //text3.setAttribute("y", "50");
        //text3.setAttribute("font-size", "15px");
        //
        //
        //StringUtils.fitDate(text3, node.getAttr('birthdate'), node.getAttr('deathdate'), 240);
        //StringUtils.centerElement(text3, 60, 240);



        var gender = 'none';
        if(node.hasAttr('gender')) {
            gender = node.getAttr('gender');
        }
        if(gender === 'Male') {
            rect.setAttribute('fill','#8DEEEE');
            rect.setAttribute('stroke', '#2ee0e0');

        }
        else if(gender === 'Female') {
            rect.setAttribute('fill','#FFD1DC');
            rect.setAttribute('stroke', '#ffa3b9');
        }
        else {
            rect.setAttribute('fill','#CFCFC4');
            rect.setAttribute('stroke', 'black');
        }

        return g;
    }
    move(box:IBox, graphic: any): any {
        graphic.setAttribute("transform","translate("+box.getX()+", "+box.getY()+")");
    }
    getType(): string {
        return "xsNameBox";
    }
    getHeight(): number {
        return 10;
    }
    getWidth(): number {
        return 200;
    }
}