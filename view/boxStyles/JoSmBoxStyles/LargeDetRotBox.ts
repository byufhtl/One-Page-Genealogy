///<reference path="../../IBoxRender.ts"/>
///<reference path="../../../util/StringUtils.ts"/>
/**
 * Created by justinrasband on 9/14/15.
 */

class JSLargeDetRotBox implements IBoxRender {
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
        rect.setAttribute('height', String(box.getHeight()-2-box.getSpace()));

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
        rect2.setAttribute('height', String(box.getHeight()-30-box.getSpace()));
        //rect2.setAttribute('height', String(box.getHeight()-10));
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
        text.setAttribute('font-size', '40px');
        text.setAttribute("style", "font-family:'Times New Roman',tahoma, sans-serif");
        StringUtils.fitName(text, nameString, 19);
        StringUtils.centerElement(text, 70, 300);
        text.setAttribute('y','70')
        text.setAttribute("font-weight", "bold");

        var text3 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        gt.appendChild(text3);
        var nameTextPath = document.createTextNode("");
        text3.appendChild(nameTextPath);
        text3.setAttribute("x", "25");
        text3.setAttribute("y", "100");
        text3.setAttribute("font-size", "20px");
        text3.setAttribute("style", "font-family:'Times New Roman',tahoma, sans-serif");

        StringUtils.fitDatePlace(text3,node.getAttr('birthdate'),node.getAttr('birthplace'),28);
        //StringUtils.fitDate(text3, node.getAttr('birthdate'), node.getAttr('deathdate'), 290);
        //StringUtils.centerElement(text3, 210, 290);
        StringUtils.centerElement(text3, 65, 300);

        var text4 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        gt.appendChild(text4);
        var nameTextPath = document.createTextNode("");
        text4.appendChild(nameTextPath);
        text4.setAttribute("x", "25");
        text4.setAttribute("y", "130");
        text4.setAttribute("font-size", "20px");
        text4.setAttribute("style", "font-family:'Times New Roman',tahoma, sans-serif");
        //StringUtils.centerElement(text4, 210, 290);
        StringUtils.fitDatePlace(text4,node.getAttr('deathdate'),node.getAttr('deathplace'),28);
        //StringUtils.fitPlace(text4, node.getAttr('birthplace'), 25);
        //text4.textContent = 'B: '+text4.textContent;
        StringUtils.centerElement(text4, 65, 300);

        /*var text5 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        gt.appendChild(text5);
        var nameTextPath = document.createTextNode("");
        text5.appendChild(nameTextPath);
        text5.setAttribute("x", "25");
        text5.setAttribute("y", "155");
        text5.setAttribute("font-size", "20px");
        text5.setAttribute("style", "font-family:'Times New Roman',tahoma, sans-serif");
        //StringUtils.centerElement(text5, 210, 290);
        StringUtils.fitPlace(text5, node.getAttr('deathplace'), 25);
        text5.textContent = 'D: '+text5.textContent;
        StringUtils.centerElement(text5, 65, 300);*/


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

        gt.setAttribute("transform","translate(0, "+ (this.getHeight()-2)+") rotate(-90 0,0)");

        return g;
    }
    move(box:IBox, graphic: any): any {
        //graphic.setAttribute("transform","translate("+(box.getX()+2)+", "+(box.getY()+4)+")");
        graphic.setAttribute("transform","translate("+(box.getX()+2)+", "+
            (box.getY()+1+Math.round(box.getSpace()/2))+")");
    }
    getType(): string {
        return "JSLargeDetRotBox";
    }
    getHeight(): number {
        return 440;
    }
    getWidth(): number {
        return 169+2+3;//214;
    }
    requiresLoad(): boolean {
        return false;
    }
}