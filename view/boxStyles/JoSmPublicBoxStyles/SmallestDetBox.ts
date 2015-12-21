///<reference path="../../IBoxRender.ts"/>
///<reference path="../../../util/StringUtils.ts"/>
///<reference path="../../IBoxData.ts"/>
/**
 * Created by renae on 10/2/15.
 */
class JSSmallestDetPubBox extends IBoxData {
    render(box:IBox, rootElement): any {
        var g:Element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        var gt:Element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        if(rootElement) {
            rootElement.appendChild(g);
        }
        var rect:Element = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        g.appendChild(rect);


        rect.setAttribute('width', String(this.getWidth()-4));
        rect.setAttribute('height', String(box.getHeight()-2-box.getSpace()));

        if(isNaN(box.getY())) {
            console.log(box);
        }

        g.setAttribute("transform","translate("+box.getX()+", "+box.getY()+")");
        gt.setAttribute("transform","translate(7, 7)");


        rect.setAttribute('rx', "6");
        rect.setAttribute('ry', "6");
        rect.setAttribute('stroke-width', '1');
        rect.setAttribute('stroke', 'black')
        var rect2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect2.setAttribute('rx','4.5')
        rect2.setAttribute('ry','4.5')
        rect2.setAttribute('stroke-width','1')
        rect2.setAttribute('stroke','#FFFF66')
        rect2.setAttribute('width', String(this.getWidth()-7));
        rect2.setAttribute('height', String(box.getHeight()-4-box.getSpace()));
        //rect2.setAttribute('height', String(box.getHeight()-10));
        g.appendChild(rect2)
        rect2.setAttribute('x','1.5')
        rect2.setAttribute('y','1')
        rect2.setAttribute('fill-opacity','.001')

        g.appendChild(gt);
        //gt.setAttribute("transform","translate(-1, 0)");


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


        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        gt.appendChild(text);


        if(node.hasAttr('name')) {
            var nameTextPath = document.createTextNode(box.getNode().getAttr('name'));
            text.appendChild(nameTextPath);
            text.setAttribute("x", "-1");
            text.setAttribute("y", "3");
            text.setAttribute("font-size", "9px");
            text.setAttribute("style", this.getFont() );
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
        text3.setAttribute("x", "149");
        text3.setAttribute("y", "2");
        text3.setAttribute("font-size", "8px");
        text3.setAttribute("style", this.getFont() );
        StringUtils.fitYearsState(text3,node.getAttr('birthdate'),node.getAttr('deathdate'),node.getAttr('birthplace'),20);

        if(box.getColor()!= null){
            rect.setAttribute('fill', 'white');
            rect2.setAttribute('stroke',box.getColor());
            rect2.setAttribute('fill',box.getColor());
        }
        else
            rect.setAttribute('fill','#FFFFE0');//'#CC99FF');

        return g;
    }
    move(box:IBox, graphic: any): any {
        //graphic.setAttribute("transform","translate("+(box.getX()+2)+", "+(box.getY()+4)+")");
        graphic.setAttribute("transform","translate("+(box.getX()+2)+", "+
            (box.getY()+1+Math.round(box.getSpace()/2))+")");
    }
    getType(): string {
        return "JSSmallestDetPubBox";
    }
    getHeight(): number {
        return 15;
    }
    getWidth(): number {
        return 245;//214;
    }
    requiresLoad(): boolean {
        return false;
    }
}