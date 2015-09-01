/**
 * Created by justinrasband on 8/28/15.
 */
///<reference path="../IBoxRender.ts"/>
///<reference path="../../util/DateFormat.ts"/>
///<reference path="../../util/StringUtils.ts"/>

class XSSpBox implements IBoxRender {
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
            text.setAttribute("font-size", "10px");
            text.setAttribute("style", "font-family:tahoma, sans-serif");
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
        text3.setAttribute("style", "font-family:tahoma, sans-serif");

        StringUtils.fitDate(text3, node.getAttr('birthdate'), node.getAttr('deathdate'), 50);
        //StringUtils.centerElement(text3, 210, 290);

        //var text4 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        //gt.appendChild(text4);
        //var nameTextPath = document.createTextNode("");
        //text4.appendChild(nameTextPath);
        //text4.setAttribute("x", "10");
        //text4.setAttribute("y", "16");
        //text4.setAttribute("font-size", "8px");
        //text4.setAttribute("style", "font-family:sans-serif");
        ////StringUtils.centerElement(text4, 210, 290);
        //StringUtils.fitPlace(text4, node.getAttr('birthplace'), 28);
        //text4.textContent = 'B: '+text4.textContent;

        //var text5 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        //gt.appendChild(text5);
        //var nameTextPath = document.createTextNode("");
        //text5.appendChild(nameTextPath);
        //text5.setAttribute("x", "10");
        //text5.setAttribute("y", "30");
        //text5.setAttribute("font-size", "8px");
        //text5.setAttribute("style", "font-family:tahoma, sans-serif");
        ////StringUtils.centerElement(text5, 210, 290);
        //StringUtils.fitPlace(text5, node.getAttr('deathplace'), 28);
        //text5.textContent = 'D: '+text5.textContent;


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
            text6.setAttribute("font-size", "10px");
            text6.setAttribute("style", "font-family:tahoma, sans-serif");
            if (spousenode.isMainPerson())
                text6.setAttribute("font-weight", "bold");

            StringUtils.fitName(text6, spousenode.getAttr('name'), 19);


            //StringUtils.centerElement(text, 210, 290);
            //}

            var text7 = document.createElementNS("http://www.w3.org/2000/svg", "text");
            gt.appendChild(text7);
            var nameTextPath = document.createTextNode("");
            text7.appendChild(nameTextPath);
            text7.setAttribute("x", "110");
            text7.setAttribute("y", "16");
            text7.setAttribute("font-size", "8px");
            text7.setAttribute("style", "font-family:tahoma, sans-serif");

            StringUtils.fitDate(text7, spousenode.getAttr('birthdate'), node.getAttr('deathdate'), 50);
            //StringUtils.centerElement(text3, 210, 290);

            //var text8 = document.createElementNS("http://www.w3.org/2000/svg", "text");
            //gt.appendChild(text8);
            //var nameTextPath = document.createTextNode("");
            //text8.appendChild(nameTextPath);
            //text8.setAttribute("x", "10");
            //text8.setAttribute("y", "34");
            //text8.setAttribute("font-size", "8px");
            //text8.setAttribute("style", "font-family:sans-serif");
            ////StringUtils.centerElement(text4, 210, 290);
            //StringUtils.fitPlace(text8, spousenode.getAttr('birthplace'), 28);
            //text8.textContent = 'B: ' + text8.textContent;

            //var text9 = document.createElementNS("http://www.w3.org/2000/svg", "text");
            //gt.appendChild(text9);
            //var nameTextPath = document.createTextNode("");
            //text9.appendChild(nameTextPath);
            //text9.setAttribute("x", "10");
            //text9.setAttribute("y", '65');
            //text9.setAttribute("font-size", "8px");
            //text9.setAttribute("style", "font-family:tahoma, sans-serif");
            ////StringUtils.centerElement(text5, 210, 290);
            //StringUtils.fitPlace(text9, spousenode.getAttr('deathplace'), 28);
            //text9.textContent = 'D: ' + text9.textContent;
        }

        var text10 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        gt.appendChild(text10);
        //var date = new Date();
        var nameTextPath = document.createTextNode("M: "+StringUtils.standardDate(node.getAttr('marriagedate')));//date.toDateString()));
        text10.appendChild(nameTextPath);
        //var nameTextPath = document.createTextNode("M: "+StringUtils.standardDate(date.toDateString()));
        //text10.appendChild(nameTextPath);
        text10.setAttribute("x", "10");
        text10.setAttribute("y", "24");
        text10.setAttribute("font-size", "8px");
        text10.setAttribute("style", "font-family:tahoma, sans-serif");
        //StringUtils.centerElement(text10, 100, 290)


        var grayScale = box.isGray();
        if(box.getColor()!= null && !grayScale){
            rect.setAttribute('fill', box.getColor());
            rect.setAttribute('stroke','black');
        }
        else if(!grayScale) {
            rect.setAttribute('fill','#E2C6FF');//'#CC99FF');
            rect.setAttribute('stroke', '#CC66FF');

        }
        else {
            rect.setAttribute('fill','#E5E5E5');
            rect.setAttribute('stroke', 'black');
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
        return 27;
    }
    getWidth(): number {
        return 162;
    }
    requiresLoad(): boolean {
        return true;
    }
}