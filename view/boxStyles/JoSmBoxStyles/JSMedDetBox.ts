///<reference path="../../IBoxRender.ts"/>
///<reference path="../../../util/StringUtils.ts"/>
///<reference path="../../IBoxData.ts"/>
/**
 * Created by justinrasband on 9/15/15.
 */


class JSMedDetBox extends IBoxData {
    render(box:IBox, rootElement): any {
        var g:Element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        var gt:Element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        if(rootElement) {
            rootElement.appendChild(g);
        }
        var rect:Element = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        g.appendChild(rect);
        //g.appendChild(gt);

        rect.setAttribute('width', String(this.getWidth()-4));
        rect.setAttribute('height', String(box.getHeight()-6-box.getSpace()));

        if(isNaN(box.getY())) {
            console.log(box);
        }

        g.setAttribute("transform","translate("+box.getX()+", "+box.getY()+")");


        rect.setAttribute('rx', "30");
        rect.setAttribute('ry', "30");
        rect.setAttribute('stroke-width', '5');

        rect.setAttribute('stroke','black')

        var rect2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect2.setAttribute('rx','15')
        rect2.setAttribute('ry','15')
        rect2.setAttribute('stroke-width','15')
        rect2.setAttribute('stroke','#FFFF66')
        rect2.setAttribute('width', String(this.getWidth()-33));
        rect2.setAttribute('height', String(box.getHeight()-34-box.getSpace()));
        g.appendChild(rect2)
        rect2.setAttribute('x','15')
        rect2.setAttribute('y','14')
        rect2.setAttribute('fill-opacity','.001')

        g.appendChild(gt);


        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        var text2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        gt.appendChild(text);
        gt.appendChild(text2);
        var node = box.getNode();

        var nameTextpath = document.createTextNode("");
        var nameString = "";

        if(node.hasAttr('name')) {
            nameString = box.getNode().getAttr('name');
            nameTextPath = document.createTextNode(nameString);
        }else if (node.hasAttr('givenname') && node.hasAttr('surname')) {
            nameString = box.getNode().getAttr('givenname') + " " + box.getNode().getAttr('surname');
            nameTextpath = document.createTextNode(nameString);
        }
        text.appendChild(nameTextPath);
        text.setAttribute('font-size', '35px');
        text.setAttribute("style", this.getFont());
        StringUtils.fitName(text, nameString, 15);
        StringUtils.centerElement(text, 30, 260);
        text.setAttribute('y','55')
        text.setAttribute("font-weight", "bold");

        var text3 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        gt.appendChild(text3);
        var nameTextPath = document.createTextNode("");
        text3.appendChild(nameTextPath);
        text3.setAttribute("x", "25");
        text3.setAttribute("y", "83");
        text3.setAttribute("font-size", "20px");
        text3.setAttribute("style", this.getFont());

        StringUtils.fitDatePlace(text3,node.getAttr('birthdate'),node.getAttr('birthplace'),20);
        //StringUtils.fitDate(text3, node.getAttr('birthdate'), node.getAttr('deathdate'), 290);
        //StringUtils.centerElement(text3, 210, 290);
        StringUtils.centerElement(text3, 30, 290);

        var text4 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        gt.appendChild(text4);
        var nameTextPath = document.createTextNode("");
        text4.appendChild(nameTextPath);
        text4.setAttribute("x", "25");
        text4.setAttribute("y", "105");
        text4.setAttribute("font-size", "20px");
        text4.setAttribute("style", this.getFont());
        //StringUtils.centerElement(text4, 210, 290);
        StringUtils.fitDatePlace(text4,node.getAttr('deathdate'),node.getAttr('deathplace'),28);
        //StringUtils.fitPlace(text4, node.getAttr('birthplace'), 25);
        //text4.textContent = 'B: '+text4.textContent;
        StringUtils.centerElement(text4, 40, 260);



        var gender = 'none';
        if(node.hasAttr('gender')) {
            gender = node.getAttr('gender');
        }
        if(box.getColor()!= null){
            rect.setAttribute('fill', '#FFFFE0');
        }
        else if(gender === 'Male') {
            rect.setAttribute('fill','#FFFFE0');
        }
        else if(gender === 'Female') {
            rect.setAttribute('fill','#FFFFE0');
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
        return "JSMedDetBox";
    }
    getHeight(): number {
        return 135;
    }
    getWidth(): number {
        return 325;//214;
    }
    requiresLoad(): boolean {
        return false;
    }
}