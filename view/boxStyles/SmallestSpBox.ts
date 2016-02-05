///<reference path="../IBoxData.ts"/>
/**
 * Created by justinrasband on 8/28/15.
 */
///<reference path="../IBoxRender.ts"/>
///<reference path="../../util/DateFormat.ts"/>
///<reference path="../../util/StringUtils.ts"/>

class SmallestSpBox extends IBoxData {
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


        var secondG = document.createElementNS("http://www.w3.org/2000/svg", "g");
        var firstG = document.createElementNS("http://www.w3.org/2000/svg", "g");
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        gt.appendChild(firstG);
        firstG.appendChild(text);
        gt.appendChild(secondG)

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
            text.setAttribute("font-size", "8px");
            text.setAttribute("fill", box.getTextColor());
            text.setAttribute("style", this.getFont() );
            if(node.isMainPerson())
                text.setAttribute("font-weight", "bold");
            StringUtils.fitName(text,node.getAttr('name'),14);

            //StringUtils.centerElement(text, 210, 290);
        }

        var text3 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        firstG.appendChild(text3);
        var nameTextPath = document.createTextNode("");
        text3.appendChild(nameTextPath);
        text3.setAttribute("x", "75");
        text3.setAttribute("font-size", "8px");
        text3.setAttribute("fill", box.getTextColor());
        text3.setAttribute("style", this.getFont() );
        StringUtils.fitDate(text3, node.getAttr('birthdate'), node.getAttr('deathdate'), 12);

        firstG.setAttribute('transform','translate(10,7)')
        secondG.setAttribute('transform','translate(10,7)')

        spousenode = node.getDisplaySpouse();


        var firstGGender = null;
        var secondGGender = null;

        if(spousenode.hasAttr('gender')){
            secondGGender = spousenode.getAttr('gender')
            if(secondGGender== "Male"){
                firstG.setAttribute('transform','translate(10,16)')
            }else{
                secondG.setAttribute('transform','translate(10,16)')
            }
        }else if(node.hasAttr('gender')){
            firstGGender = node.getAttr('gender')
            if(firstGGender == "Male"){
                secondG.setAttribute('transform','translate(10,16)')
            }else{
                firstG.setAttribute('transform','translate(10,16)')
            }
        }else{
            if(spousenode.isMainPerson()){
                firstG.setAttribute('transform','translate(10,16)')
            }else {
                secondG.setAttribute('transform','translate(10,16)')
            }
        }
        //console.log(spousenode)
        if(spousenode != null) {
            //console.log("apparently spousenode isn't null.....")
            var text6 = document.createElementNS("http://www.w3.org/2000/svg", "text");
            secondG.appendChild(text6);
            var nameTextPath = document.createTextNode('Spouse Name');
            text6.appendChild(nameTextPath);
            text6.setAttribute("font-size", "8px");
            text6.setAttribute("fill", box.getTextColor());
            text6.setAttribute("style", this.getFont() );
            if (spousenode.isMainPerson())
                text6.setAttribute("font-weight", "bold");

            StringUtils.fitName(text6, spousenode.getAttr('name'), 14);


            //StringUtils.centerElement(text, 210, 290);
            //}

            var text7 = document.createElementNS("http://www.w3.org/2000/svg", "text");
            secondG.appendChild(text7);
            var nameTextPath = document.createTextNode("");
            text7.appendChild(nameTextPath);
            text7.setAttribute("x", "75");
            text7.setAttribute("font-size", "8px");
            text7.setAttribute("fill", box.getTextColor());
            text7.setAttribute("style", this.getFont() );

            StringUtils.fitDate(text7, spousenode.getAttr('birthdate'), node.getAttr('deathdate'), 12);

        }

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
        return "smallestSpBox";
    }
    getHeight(): number {
        return 20;
    }
    getWidth(): number {
        return 142;
    }
    requiresLoad(): boolean {
        return false;
    }
}