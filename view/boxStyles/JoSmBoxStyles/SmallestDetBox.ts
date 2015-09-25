///<reference path="../../IBoxRender.ts"/>
///<reference path="../../../util/StringUtils.ts"/>
/**
 * Created by renae on 9/25/15.
 */
class JSSmallestDetBox implements IBoxRender {
    render(box:IBox, rootElement): any {
        var g:Element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        var gt:Element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        if(rootElement) {
            rootElement.appendChild(g);
        }
        var rect:Element = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        g.appendChild(rect);


        rect.setAttribute('width', String(this.getWidth()-4));
        rect.setAttribute('height', String(box.getHeight()-6-box.getSpace()));

        if(isNaN(box.getY())) {
            console.log(box);
        }

        g.setAttribute("transform","translate("+box.getX()+", "+box.getY()+")");
        gt.setAttribute("transform","translate(7, 8)");


        rect.setAttribute('rx', "7");
        rect.setAttribute('ry', "7");
        rect.setAttribute('stroke-width', '2');
        rect.setAttribute('stroke', 'black')
        var rect2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect2.setAttribute('rx','5')
        rect2.setAttribute('ry','5')
        rect2.setAttribute('stroke-width','1')
        rect2.setAttribute('stroke','#FFFF66')
        rect2.setAttribute('width', String(this.getWidth()-7));
        rect2.setAttribute('height', String(box.getHeight()-9-box.getSpace()));
        //rect2.setAttribute('height', String(box.getHeight()-10));
        g.appendChild(rect2)
        rect2.setAttribute('x','1')
        rect2.setAttribute('y','1')
        rect2.setAttribute('fill-opacity','.001')

        g.appendChild(gt);
        //gt.setAttribute("transform","translate(2, 2)");


        var n: INode = box.getNode();
        //var sn: INode = n.getDisplaySpouse();
        var node: INode;
        //var spousenode: INode;
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
        //spousenode = sn;
        //}

        //var secondG = document.createElementNS("http://www.w3.org/2000/svg", "g");
        //var firstG = document.createElementNS("http://www.w3.org/2000/svg", "g");
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        gt.appendChild(text);

        //gt.appendChild(firstG);
        //firstG.appendChild(text);
        //gt.appendChild(secondG)

        if(node.hasAttr('name')) {
            var nameTextPath = document.createTextNode(box.getNode().getAttr('name'));
            text.appendChild(nameTextPath);
            //text.setAttribute("x", "5");
            //text.setAttribute("y", "2");
            text.setAttribute("font-size", "9px");
            text.setAttribute("style", "font-family:'Times New Roman',tahoma, sans-serif");
            if(node.isMainPerson())
                text.setAttribute("font-weight", "bold");
            StringUtils.fitName(text,node.getAttr('name'),28);
            //StringUtils.centerElement(text, 210, 290);
        }

        var text3 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        gt.appendChild(text3);
        //firstG.appendChild(text3);
        var nameTextPath = document.createTextNode("");
        text3.appendChild(nameTextPath);
        text3.setAttribute("x", "150");
        //text3.setAttribute("y", "11");
        text3.setAttribute("font-size", "9px");
        text3.setAttribute("style", "font-family:'Times New Roman',tahoma, sans-serif");
        StringUtils.fitYearsState(text3,node.getAttr('birthdate'),node.getAttr('deathdate'),node.getAttr('birthplace'),20);
        //StringUtils.fitDatePlace(text3,node.getAttr('birthdate'), node.getAttr('birthplace'), 70);
        //StringUtils.fitDatePlace(text3,node.getAttr('birthdate'),node.getAttr('birthplace'),40);
        //StringUtils.fitDate(text3, node.getAttr('birthdate'), node.getAttr('deathdate'), 290);
        //StringUtils.centerElement(text3, 210, 290);

        /*var text4 = document.createElementNS("http://www.w3.org/2000/svg", "text");
         firstG.appendChild(text4);
         var nameTextPath = document.createTextNode("");
         text4.appendChild(nameTextPath);
         //text3.setAttribute("x", "160");
         text4.setAttribute("y", "20");
         text4.setAttribute("font-size", "8px");
         text4.setAttribute("style", "font-family:'Times New Roman',tahoma, sans-serif");

         StringUtils.fitDatePlace(text4,node.getAttr('deathdate'), node.getAttr('deathplace'), 70);*/

        //firstG.setAttribute('transform','translate(8,13)')
        //secondG.setAttribute('transform','translate(6,13)')

        //StringUtils.fitDatePlace(text4,node.getAttr('deathdate'),node.getAttr('deathplace'),40);
        //StringUtils.centerElement(text4, 210, 290);
        //StringUtils.fitPlace(text4, node.getAttr('birthplace'), 28);
        //text4.textContent = 'B: '+text4.textContent;

        var grayScale = box.isGray();
        //if(box.getColor()!= null && !grayScale){
        //    rect.setAttribute('fill', box.getColor());
        //    rect.setAttribute('stroke','black');
        //}
        //else
        if(!grayScale) {
            rect.setAttribute('fill','#FFFFE0');//'#CC99FF');
            //rect.setAttribute('stroke', '#CC66FF');

        }
        else {
            rect.setAttribute('fill','#E5E5E5');
            rect.setAttribute('stroke', 'black');
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
        return "JSSmallestDetBox";
    }
    getHeight(): number {
        return 16;
    }
    getWidth(): number {
        return 250;//214;
    }
    requiresLoad(): boolean {
        return true;
    }
}