///<reference path="../../IBoxRender.ts"/>
///<reference path="../../../util/StringUtils.ts"/>
/**
 * Created by renae on 9/24/15.
 */
class JSSmallerDetSpBox implements IBoxRender {
    render(box:IBox, rootElement): any {
        var g:Element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        var gt:Element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        if(rootElement) {
            rootElement.appendChild(g);
        }
        var rect:Element = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        g.appendChild(rect);


        rect.setAttribute('width', String(this.getWidth()-4));
        rect.setAttribute('height', String(box.getHeight()-3-box.getSpace()));

        if(isNaN(box.getY())) {
            console.log(box);
        }

        g.setAttribute("transform","translate("+box.getX()+", "+box.getY()+")");


        rect.setAttribute('rx', "7.5");
        rect.setAttribute('ry', "7.5");
        rect.setAttribute('stroke-width', '2');
        rect.setAttribute('stroke', 'black')
        var rect2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect2.setAttribute('rx','5')
        rect2.setAttribute('ry','5')
        rect2.setAttribute('stroke-width','3')
        rect2.setAttribute('stroke','#E2C6FF')
        rect2.setAttribute('width', String(this.getWidth()-10));
        rect2.setAttribute('height', String(box.getHeight()-9-box.getSpace()));
        //rect2.setAttribute('height', String(box.getHeight()-10));
        g.appendChild(rect2)
        rect2.setAttribute('x','3')
        rect2.setAttribute('y','3')
        rect2.setAttribute('fill-opacity','.001')

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
            text.setAttribute("font-size", "11px");
            text.setAttribute("style", "font-family:'Times New Roman',tahoma, sans-serif");
            if(node.isMainPerson())
                text.setAttribute("font-weight", "bold");
            StringUtils.fitName(text,node.getAttr('name'),28);
            //StringUtils.centerElement(text, 210, 290);
        }

        var text3 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        firstG.appendChild(text3);
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

        firstG.setAttribute('transform','translate(8,13)')
        secondG.setAttribute('transform','translate(6,13)')

        //StringUtils.fitDatePlace(text4,node.getAttr('deathdate'),node.getAttr('deathplace'),40);
        //StringUtils.centerElement(text4, 210, 290);
        //StringUtils.fitPlace(text4, node.getAttr('birthplace'), 28);
        //text4.textContent = 'B: '+text4.textContent;



        spousenode = node.getDisplaySpouse();


        var firstGGender = null;
        var secondGGender = null;

        if(spousenode.hasAttr('gender')){
            secondGGender = spousenode.getAttr('gender')
            if(secondGGender== "Male"){
                firstG.setAttribute('transform','translate(8,25)')
            }else{
                secondG.setAttribute('transform','translate(8,25)')
            }
        }else if(node.hasAttr('gender')){
            firstGGender = node.getAttr('gender')
            if(firstGGender == "Male"){
                secondG.setAttribute('transform','translate(8,25)')
            }else{
                firstG.setAttribute('transform','translate(8,25)')
            }
        }else{
            if(spousenode.isMainPerson()){
                firstG.setAttribute('transform','translate(8,25)')
            }else {
                secondG.setAttribute('transform','translate(8,25)')
            }
        }


        //if(node.hasAttr('spousename')) {

        //console.log(spousenode)
        if(spousenode != null) {
            //console.log("apparently spousenode isn't null.....")
            var text6 = document.createElementNS("http://www.w3.org/2000/svg", "text");
            secondG.appendChild(text6);
            var nameTextPath = document.createTextNode('Spouse Name');
            text6.appendChild(nameTextPath);
            //text6.setAttribute("x", "160");
            //text6.setAttribute("y", "18");
            text6.setAttribute("font-size", "11px");
            text6.setAttribute("style", "font-family:'Times New Roman',tahoma, sans-serif");
            if (spousenode.isMainPerson())
                text6.setAttribute("font-weight", "bold");

            StringUtils.fitName(text6, spousenode.getAttr('name'), 28);

            var text7 = document.createElementNS("http://www.w3.org/2000/svg", "text");
            secondG.appendChild(text7);
            var nameTextPath = document.createTextNode("");
            text7.appendChild(nameTextPath);
            text7.setAttribute("x", "150");
            //text7.setAttribute("y", "11");
            text7.setAttribute("font-size", "9px");
            text7.setAttribute("style", "font-family:'Times New Roman',tahoma, sans-serif");

            StringUtils.fitYearsState(text7,spousenode.getAttr('birthdate'),spousenode.getAttr('deathdate'),spousenode.getAttr('birthplace'),20);

        }


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



        //gt.setAttribute("transform","translate(0, "+ (this.getHeight()-2)+") rotate(-90 0,0)");

        return g;
    }
    move(box:IBox, graphic: any): any {
        //graphic.setAttribute("transform","translate("+(box.getX()+2)+", "+(box.getY()+4)+")");
        graphic.setAttribute("transform","translate("+(box.getX()+2)+", "+
            (box.getY()+1+Math.round(box.getSpace()/2))+")");
    }
    getType(): string {
        return "JSSmallerDetSpBox";
    }
    getHeight(): number {
        return 35;
    }
    getWidth(): number {
        return 250;//214;
    }
    requiresLoad(): boolean {
        return true;
    }
}