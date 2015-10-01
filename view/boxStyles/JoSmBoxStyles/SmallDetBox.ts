///<reference path="../../IBoxRender.ts"/>
///<reference path="../../../util/StringUtils.ts"/>
/**
 * Created by justinrasband on 9/24/15.
 */
class JSSmallDetBox implements IBoxRender {
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


        rect.setAttribute('rx', "10");
        rect.setAttribute('ry', "10");
        rect.setAttribute('stroke-width', '3');
        rect.setAttribute('stroke', 'black');
        var rect2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect2.setAttribute('rx','5');
        rect2.setAttribute('ry','5');
        rect2.setAttribute('stroke-width','5');
        rect2.setAttribute('stroke','#FFFF66');
        rect2.setAttribute('width', String(this.getWidth()-14));
        rect2.setAttribute('height', String(box.getHeight()-16-box.getSpace()));
        //rect2.setAttribute('height', String(box.getHeight()-10));
        g.appendChild(rect2);
        rect2.setAttribute('x','5');
        rect2.setAttribute('y','5');
        rect2.setAttribute('fill-opacity','.001');

        g.appendChild(gt);


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

        var secondG = document.createElementNS("http://www.w3.org/2000/svg", "g");
        var firstG = document.createElementNS("http://www.w3.org/2000/svg", "g");
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        gt.appendChild(firstG);
        firstG.appendChild(text);
        gt.appendChild(secondG)

        if(node.hasAttr('name')) {
            var nameTextPath = document.createTextNode(box.getNode().getAttr('name'));
            text.appendChild(nameTextPath);
            //text.setAttribute("x", "160");
            //text.setAttribute("y", "18");
            text.setAttribute("font-size", "12px");
            text.setAttribute("style", "font-family:'Times New Roman',tahoma, sans-serif");
            if(node.isMainPerson())
                text.setAttribute("font-weight", "bold");
            StringUtils.fitName(text,node.getAttr('name'),18);
            //StringUtils.centerElement(text, 210, 290);
        }


        /*var text2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
         gt.appendChild(text2);
         if(node.hasAttr('surname')) {
         var nameTextPath = document.createTextNode(box.getNode().getAttr('surname'));
         text2.appendChild(nameTextPath);
         text2.setAttribute("x", "220");
         text2.setAttribute("y", "80");
         text2.setAttribute("font-size", "40px");
         text2.setAttribute("style", "font-family:tahoma, sans-serif");
         StringUtils.fitName(text2,node.getAttr('surname'),30);
         //StringUtils.centerElement(text2, 210, 290);
         }*/

        var text3 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        firstG.appendChild(text3);
        var nameTextPath = document.createTextNode("");
        text3.appendChild(nameTextPath);
        //text3.setAttribute("x", "160");
        text3.setAttribute("y", "9");
        text3.setAttribute("font-size", "8px");
        text3.setAttribute("style", "font-family:'Times New Roman',tahoma, sans-serif");

        StringUtils.fitDatePlace(text3,node.getAttr('birthdate'), node.getAttr('birthplace'), 70);
        //StringUtils.fitDatePlace(text3,node.getAttr('birthdate'),node.getAttr('birthplace'),40);
        //StringUtils.fitDate(text3, node.getAttr('birthdate'), node.getAttr('deathdate'), 290);
        //StringUtils.centerElement(text3, 210, 290);

        var text4 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        firstG.appendChild(text4);
        var nameTextPath = document.createTextNode("");
        text4.appendChild(nameTextPath);
        //text3.setAttribute("x", "160");
        text4.setAttribute("y", "18");
        text4.setAttribute("font-size", "8px");
        text4.setAttribute("style", "font-family:'Times New Roman',tahoma, sans-serif");

        StringUtils.fitDatePlace(text4,node.getAttr('deathdate'), node.getAttr('deathplace'), 70);



        firstG.setAttribute('transform','translate(8,16)')

        //if(box.getColor()!= null && !grayScale){
        //    rect.setAttribute('fill', box.getColor());
        //    rect.setAttribute('stroke','black');
        //}
        //else
        //if(!grayScale) {
            rect.setAttribute('fill','#F9F4FF');//'#CC99FF');
            //rect.setAttribute('stroke', '#CC66FF');

        //}
        //else {
        //    rect.setAttribute('fill','#E5E5E5');
        //    rect.setAttribute('stroke', 'black');
        //}


        return g;
    }
    move(box:IBox, graphic: any): any {
        //graphic.setAttribute("transform","translate("+(box.getX()+2)+", "+(box.getY()+4)+")");
        graphic.setAttribute("transform","translate("+(box.getX()+2)+", "+
            (box.getY()+1+Math.round(box.getSpace()/2))+")");
    }
    getType(): string {
        return "JSSmallDetBox";
    }
    getHeight(): number {
        return 55;
    }
    getWidth(): number {
        return 250;//214;
    }
    requiresLoad(): boolean {
        return true;
    }
}