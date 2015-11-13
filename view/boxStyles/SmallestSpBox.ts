/**
 * Created by justinrasband on 8/28/15.
 */
///<reference path="../IBoxRender.ts"/>
///<reference path="../../util/DateFormat.ts"/>
///<reference path="../../util/StringUtils.ts"/>

class SmallestSpBox implements IBoxRender {
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
            //text.setAttribute("x", "10");
            //text.setAttribute("y", "8");
            text.setAttribute("font-size", "10px");
            text.setAttribute("style", "font-family:tahoma, sans-serif");
            if(node.isMainPerson())
                text.setAttribute("font-weight", "bold");
            StringUtils.fitName(text,node.getAttr('name'),15);

            //StringUtils.centerElement(text, 210, 290);
        }

        var text3 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        firstG.appendChild(text3);
        var nameTextPath = document.createTextNode("");
        text3.appendChild(nameTextPath);
        text3.setAttribute("x", "75");
        text3.setAttribute("y", "-1");
        text3.setAttribute("font-size", "8px");
        text3.setAttribute("style", "font-family:tahoma, sans-serif");

        StringUtils.fitDate(text3, node.getAttr('birthdate'), node.getAttr('deathdate'), 12);
        //StringUtils.centerElement(text3, 210, 290);

        firstG.setAttribute('transform','translate(10,8)')
        secondG.setAttribute('transform','translate(10,8)')

        spousenode = node.getDisplaySpouse();


        var firstGGender = null;
        var secondGGender = null;

        if(spousenode.hasAttr('gender')){
            secondGGender = spousenode.getAttr('gender')
            if(secondGGender== "Male"){
                firstG.setAttribute('transform','translate(10,17)')
            }else{
                secondG.setAttribute('transform','translate(10,17)')
            }
        }else if(node.hasAttr('gender')){
            firstGGender = node.getAttr('gender')
            if(firstGGender == "Male"){
                secondG.setAttribute('transform','translate(10,17)')
            }else{
                firstG.setAttribute('transform','translate(10,17)')
            }
        }else{
            if(spousenode.isMainPerson()){
                firstG.setAttribute('transform','translate(10,17)')
            }else {
                secondG.setAttribute('transform','translate(10,17)')
            }
        }
        //console.log(spousenode)
        if(spousenode != null) {
            //console.log("apparently spousenode isn't null.....")
            var text6 = document.createElementNS("http://www.w3.org/2000/svg", "text");
            secondG.appendChild(text6);
            var nameTextPath = document.createTextNode('Spouse Name');
            text6.appendChild(nameTextPath);
            //text6.setAttribute("x", "10");
            //text6.setAttribute("y", "17");
            text6.setAttribute("font-size", "10px");
            text6.setAttribute("style", "font-family:tahoma, sans-serif");
            if (spousenode.isMainPerson())
                text6.setAttribute("font-weight", "bold");

            StringUtils.fitName(text6, spousenode.getAttr('name'), 15);


            //StringUtils.centerElement(text, 210, 290);
            //}

            var text7 = document.createElementNS("http://www.w3.org/2000/svg", "text");
            secondG.appendChild(text7);
            var nameTextPath = document.createTextNode("");
            text7.appendChild(nameTextPath);
            text7.setAttribute("x", "75");
            text7.setAttribute("y", "-1");
            text7.setAttribute("font-size", "8px");
            text7.setAttribute("style", "font-family:tahoma, sans-serif");

            StringUtils.fitDate(text7, spousenode.getAttr('birthdate'), node.getAttr('deathdate'), 12);
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

        //var text10 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        //gt.appendChild(text10);
        ////var date = new Date();
        //var nameTextPath = document.createTextNode("M: "+StringUtils.standardDate(node.getAttr('marriagedate')));//date.toDateString()));
        //text10.appendChild(nameTextPath);
        ////var nameTextPath = document.createTextNode("M: "+StringUtils.standardDate(date.toDateString()));
        ////text10.appendChild(nameTextPath);
        //text10.setAttribute("x", "10");
        //text10.setAttribute("y", "24");
        //text10.setAttribute("font-size", "8px");
        //text10.setAttribute("style", "font-family:tahoma, sans-serif");
        ////StringUtils.centerElement(text10, 100, 290)


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