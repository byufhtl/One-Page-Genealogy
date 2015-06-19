///<reference path="../IBoxRender.ts"/>
///<reference path="../../util/DateFormat.ts"/>
///<reference path="../../util/StringUtils.ts"/>
/**
 * Created by renae on 6/5/15.
 */
class SmallDetailBox implements IBoxRender {
    render(box:IBox, rootElement): any {
        var g:Element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        if(rootElement) {
            rootElement.appendChild(g);
        }
        var rect:Element = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        g.appendChild(rect);

        rect.setAttribute('width', String(this.getWidth()-4));
        rect.setAttribute('height', String(this.getHeight()-4));

        if(isNaN(box.getY())) {
            console.log(box);
        }

        //g.setAttribute("transform","translate("+(box.getX()+50)+", "+box.getY()+")");
        this.move(box, g);


        rect.setAttribute('rx', "10");
        rect.setAttribute('ry', "10");
        rect.setAttribute('stroke-width', '2');


        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text);

        var node: INode = box.getNode();
        if(node.hasAttr('name')) {
            var nameTextPath = document.createTextNode(box.getNode().getAttr('name'));
            text.appendChild(nameTextPath);
            text.setAttribute("x", "10");
            text.setAttribute("y", "10");
            text.setAttribute("font-size", "12px");
//            StringUtils.centerElement(text, 0, 190);
            StringUtils.fitName(text,node.getAttr('name'),25);
        }

        var text3 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text3);
        var nameTextPath = document.createTextNode("");
        text3.appendChild(nameTextPath);
        text3.setAttribute("x", "140");
        text3.setAttribute("y", "10");
        text3.setAttribute("font-size", "8px");

        StringUtils.fitDate(text3, node.getAttr('birthdate'), node.getAttr('deathdate'), 50);//210);
//        StringUtils.centerElement(text3, 0, 190);

        var text4 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text4);
        var nameTextPath = document.createTextNode("");
        text4.appendChild(nameTextPath);
        text4.setAttribute("x", "10");
        text4.setAttribute("y", "20");
        text4.setAttribute("font-size", "8px");
//        StringUtils.centerElement(text4, 0, 190);
        //StringUtils.fit2Places(text4, node.getAttr('birthplace'),node.getAttr('deathplace'), 45);
        StringUtils.fitPlace(text4, node.getAttr('birthplace'), 45);
        text4.textContent = 'B: '+text4.textContent;

        var text5 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text5);
        var nameTextPath = document.createTextNode("");
        text5.appendChild(nameTextPath);
        text5.setAttribute("x", "10");
        text5.setAttribute("y", "29");
        text5.setAttribute("font-size", "8px");
//        StringUtils.centerElement(text4, 0, 190);
        StringUtils.fitPlace(text5, node.getAttr('deathplace'), 45);
        text5.textContent = 'D: '+text5.textContent;

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
        graphic.setAttribute("transform","translate("+(box.getX()+2)+", "+(box.getY()+2)+")");
    }
    getType(): string {
        return "smallDetailBox";
    }
    getHeight(): number {
        return 35;
    }
    getWidth(): number {
        return 194;
    }
    requiresLoad(): boolean {
        return false;
    }
}