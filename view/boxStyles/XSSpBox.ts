///<reference path="../IBoxData.ts"/>
/**
 * Created by justinrasband on 8/28/15.
 */
///<reference path="../IBoxRender.ts"/>
///<reference path="../../util/DateFormat.ts"/>
///<reference path="../../util/StringUtils.ts"/>

class XSSpBox extends IBoxData {
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

        //g.setAttribute("transform","translate("+box.getX()+", "+box.getY()+") rotate(-90 0,0)");
        g.setAttribute("transform","translate("+box.getX()+", "+box.getY()+")");


        rect.setAttribute('rx', "5");
        rect.setAttribute('ry', "5");
        rect.setAttribute('stroke-width', '1');


        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        gt.appendChild(text);

        var n: INode = box.getNode();
        var sn: INode = n.getDisplaySpouse();
        var node: INode;
        var spousenode: INode;
        var gender = 'none';
        /*if(n.hasAttr('gender')) {
         gender = n.getAttr('gender');
         }
         if(gender === 'Female') {
         node = sn;
         spousenode = n;
         }*/
        //else {
        node = n;
        spousenode = sn;
        //}

        if(node.hasAttr('name')) {
            var nameTextPath = document.createTextNode(box.getNode().getAttr('name'));
            text.appendChild(nameTextPath);
            text.setAttribute("x", "10");
            text.setAttribute("y", "8");
            text.setAttribute("font-size", "9px");
            text.setAttribute("fill", box.getTextColor());
            text.setAttribute("style", this.getFont() );
            if(node.isMainPerson())
                text.setAttribute("font-weight", "bold");
            StringUtils.fitName(text,node.getAttr('name'),19);
            //StringUtils.centerElement(text, 210, 290);
        }

        var text3 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        gt.appendChild(text3);
        var nameTextPath = document.createTextNode("");
        text3.appendChild(nameTextPath);
        text3.setAttribute("x", "110");
        text3.setAttribute("y", "7");
        text3.setAttribute("font-size", "8px");
        text3.setAttribute("fill", box.getTextColor());
        text3.setAttribute("style", this.getFont() );

        StringUtils.fitDate(text3, node.getAttr('birthdate'), node.getAttr('deathdate'), 12);

        //if(node.hasAttr('spousename')) {
        spousenode = node.getDisplaySpouse();
        //console.log(spousenode)
        if(spousenode != null) {
            //console.log("apparently spousenode isn't null.....")
            var text6 = document.createElementNS("http://www.w3.org/2000/svg", "text");
            gt.appendChild(text6);
            var nameTextPath = document.createTextNode('Spouse Name');
            text6.appendChild(nameTextPath);
            text6.setAttribute("x", "10");
            text6.setAttribute("y", "17");
            text6.setAttribute("font-size", "9px");
            text6.setAttribute("fill", box.getTextColor());
            text6.setAttribute("style", this.getFont() );
            if (spousenode.isMainPerson())
                text6.setAttribute("font-weight", "bold");
            StringUtils.fitName(text6, spousenode.getAttr('name'), 19);

            var text7 = document.createElementNS("http://www.w3.org/2000/svg", "text");
            gt.appendChild(text7);
            var nameTextPath = document.createTextNode("");
            text7.appendChild(nameTextPath);
            text7.setAttribute("x", "110");
            text7.setAttribute("y", "16");
            text7.setAttribute("font-size", "8px");
            text7.setAttribute("fill", box.getTextColor());
            text7.setAttribute("style", this.getFont() );
            StringUtils.fitDate(text7, spousenode.getAttr('birthdate'), node.getAttr('deathdate'), 12);
        }

        var text10 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        gt.appendChild(text10);
        var nameTextPath = document.createTextNode("M: "+StringUtils.standardDate(node.getAttr('marriagedate')));//date.toDateString()));
        text10.appendChild(nameTextPath);
        //var nameTextPath = document.createTextNode("M: "+StringUtils.standardDate(date.toDateString()));
        //text10.appendChild(nameTextPath);
        text10.setAttribute("x", "10");
        text10.setAttribute("y", "25");
        text10.setAttribute("font-size", "8px");
        text10.setAttribute("fill", box.getTextColor());
        text10.setAttribute("style", this.getFont() );

        if(box.getColor()!= null){
            rect.setAttribute('fill', box.getColor());
        }
        else {
            rect.setAttribute('fill','#E2C6FF');//'#CC99FF');

        }

        //gt.setAttribute("transform","translate(0, "+ (this.getHeight()-2)+") rotate(-90 0,0)");
        //gt.setAttribute("transform","translate(0, "+ (this.getHeight()-2)+")");

        return g;
    }
    move(box:IBox, graphic: any): any {
        //graphic.setAttribute("transform","translate("+(box.getX()+2)+", "+(box.getY()+4)+")");
        graphic.setAttribute("transform","translate("+(box.getX()+2)+", "+
            (box.getY()+1+Math.round(box.getSpace()/2))+")");
    }
    getType(): string {
        return "xsSpBox";
    }
    getHeight(): number {
        return 29;
    }
    getWidth(): number {
        return 162;
    }
    requiresLoad(): boolean {
        return false;
    }
}