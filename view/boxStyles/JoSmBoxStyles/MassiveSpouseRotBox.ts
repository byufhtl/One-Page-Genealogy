///<reference path="../../IBoxRender.ts"/>
///<reference path="../../../util/StringUtils.ts"/>
///<reference path="../../IBoxData.ts"/>
/**
 * Created by justinrasband on 10/7/15.
 */

class JSMassiveSpRotBox extends IBoxData {
    render(box:IBox, rootElement): any {
        var g:Element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        var gt:Element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        if (rootElement) {
            rootElement.appendChild(g);
        }
        var rect:Element = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        g.appendChild(rect);


        rect.setAttribute('width', String(this.getWidth() - 4));
        rect.setAttribute('height', String(box.getHeight() - 6 - box.getSpace()));

        if (isNaN(box.getY())) {
            console.log(box);
        }

        g.setAttribute("transform", "translate(" + box.getX() + ", " + box.getY() + ")");


        rect.setAttribute('rx', "40");
        rect.setAttribute('ry', "40");
        rect.setAttribute('stroke-width', '6');
        rect.setAttribute('stroke', 'black')
        var rect2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect2.setAttribute('rx', '24')
        rect2.setAttribute('ry', '24')
        rect2.setAttribute('stroke-width', '20')
        rect2.setAttribute('stroke', '#E2C6FF')
        rect2.setAttribute('width', String(this.getWidth() - 37));
        rect2.setAttribute('height', String(box.getHeight() - 38 - box.getSpace()));
        //rect2.setAttribute('height', String(box.getHeight()-10));
        g.appendChild(rect2)
        rect2.setAttribute('x', '17')
        rect2.setAttribute('y', '16')
        rect2.setAttribute('fill-opacity', '.001')

        g.appendChild(gt);


        var n:INode = box.getNode();
        var sn:INode = n.getDisplaySpouse();
        var node:INode;
        var spousenode:INode;
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

        if (node.hasAttr('name')) {
            var nameTextPath = document.createTextNode(box.getNode().getAttr('name'));
            text.appendChild(nameTextPath);
            //text.setAttribute("x", "160");
            text.setAttribute("y", "18");
            text.setAttribute("font-size", "100px");
            text.setAttribute("fill", box.getTextColor());
            text.setAttribute("style", this.getFont());
            if (node.isMainPerson()) {
                text.setAttribute("font-weight", "bold");
            }
            StringUtils.fitName(text, node.getAttr('name'), 14);
            //StringUtils.centerElement(text, 210, 290);
        }


        var text3 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        firstG.appendChild(text3);
        var nameTextPath = document.createTextNode("");
        text3.appendChild(nameTextPath);
        //text3.setAttribute("x", "160");
        text3.setAttribute("y", "100");
        text3.setAttribute("font-size", "60px");
        text3.setAttribute("fill", box.getTextColor());
        text3.setAttribute("style", this.getFont());

        StringUtils.fitDatePlace(text3, node.getAttr('birthdate'), node.getAttr('birthplace'), 28);//290);


        var text4 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        firstG.appendChild(text4);
        var nameTextPath = document.createTextNode("");
        text4.appendChild(nameTextPath);
        //text4.setAttribute("x", "160");
        text4.setAttribute("y", "160");
        text4.setAttribute("font-size", "60px");
        text4.setAttribute("fill", box.getTextColor());
        text4.setAttribute("style", this.getFont());
        StringUtils.fitDatePlace(text4, node.getAttr('deathdate'), node.getAttr('deathplace'), 28);


        firstG.setAttribute('transform', 'translate(30,100)')
        secondG.setAttribute('transform', 'translate(30,100)')

        spousenode = node.getDisplaySpouse();


        var firstGGender = null;
        var secondGGender = null;

        if (spousenode.hasAttr('gender')) {
            secondGGender = spousenode.getAttr('gender')
            if (secondGGender == "Male") {
                firstG.setAttribute('transform', 'translate(800,100)')
            } else {
                secondG.setAttribute('transform', 'translate(800,100)')
            }
        } else if (node.hasAttr('gender')) {
            firstGGender = node.getAttr('gender')
            if (firstGGender == "Male") {
                secondG.setAttribute('transform', 'translate(800,100)')
            } else {
                firstG.setAttribute('transform', 'translate(800,100)')
            }
        } else {
            if (spousenode.isMainPerson()) {
                firstG.setAttribute('transform', 'translate(800,100)')
            } else {
                secondG.setAttribute('transform', 'translate(800,100)')
            }
        }


        //if(node.hasAttr('spousename')) {

        //console.log(spousenode)
        if (spousenode != null) {
            //console.log("apparently spousenode isn't null.....")
            var text6 = document.createElementNS("http://www.w3.org/2000/svg", "text");
            secondG.appendChild(text6);
            var nameTextPath = document.createTextNode('Spouse Name');
            text6.appendChild(nameTextPath);
            //text6.setAttribute("x", "160");
            text6.setAttribute("y", "18");
            text6.setAttribute("font-size", "100px");
            text6.setAttribute("fill", box.getTextColor());
            text6.setAttribute("style", this.getFont());
            if (spousenode.isMainPerson()) {
                text6.setAttribute("font-weight", "bold");
            }
            StringUtils.fitName(text6, spousenode.getAttr('name'), 14);


            //StringUtils.centerElement(text, 210, 290);
            //}

            var text7 = document.createElementNS("http://www.w3.org/2000/svg", "text");
            secondG.appendChild(text7);
            var nameTextPath = document.createTextNode("");
            text7.appendChild(nameTextPath);
            //text7.setAttribute("x", "160");
            text7.setAttribute("y", "100");//"45");
            text7.setAttribute("font-size", "60px");
            text7.setAttribute("fill", box.getTextColor());
            text7.setAttribute("style", this.getFont());
            StringUtils.fitDatePlace(text7, spousenode.getAttr('birthdate'), spousenode.getAttr('birthplace'), 28);
            //StringUtils.fitDate(text7, spousenode.getAttr('birthdate'), node.getAttr('deathdate'), 290);
            //StringUtils.centerElement(text3, 210, 290);

            var text8 = document.createElementNS("http://www.w3.org/2000/svg", "text");
            secondG.appendChild(text8);
            var nameTextPath = document.createTextNode("");
            text8.appendChild(nameTextPath);
            //text8.setAttribute("x", "160");
            text8.setAttribute("y", "160");
            text8.setAttribute("font-size", "60px");
            text8.setAttribute("fill", box.getTextColor());
            text8.setAttribute("style", this.getFont());
            StringUtils.fitDatePlace(text8, spousenode.getAttr('deathdate'), spousenode.getAttr('deathplace'), 28);

        }

        var text10 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        gt.appendChild(text10);
        //var date = new Date();
        var nameTextPath = document.createTextNode("M: " + StringUtils.standardDate(node.getAttr('marriagedate')));//date.toDateString()));
        text10.appendChild(nameTextPath);
        text10.setAttribute("x", "540");
        text10.setAttribute("y", "340");
        text10.setAttribute("font-size", "60px");
        text10.setAttribute("fill", box.getTextColor());
        text10.setAttribute("style", this.getFont());

        rect.setAttribute('fill', '#F9F4FF');

        if (node.hasAttr("baptism")) {
            var baptism = node.getAttr("baptism");
            //console.log(baptism);
            var bDate = baptism.date;
            bDate = new Date(bDate);
            // console.log(bDate);
            var deathDate;
            if (node.hasAttr("deathdate")) {
                deathDate = new Date(node.getAttr("deathdate"));
                if (bDate < deathDate) {
                    //baptized before death
                    rect2.setAttribute('stroke', '#B0EB75')
                    rect.setAttribute('fill', '#F1FBE6');

                } else {
                    //baptized after death
                    rect2.setAttribute('stroke', '#E2C6FF')
                    rect.setAttribute('fill', '#F9F4FF');

                }
            }
        } else if(node.hasAttr("birthdate") && node.hasAttr("deathdate")){
            var birthdate = new Date(node.getAttr("birthdate"))
            var deathdate = new Date(node.getAttr("deathdate"))
            var birthyear = birthdate.getFullYear();
            var deathyear = deathdate.getFullYear();
            if(deathyear - birthyear <= 8 ){
                rect2.setAttribute('stroke','#FFFF66')
                rect.setAttribute('fill','#FFFFE0');
            }else{
                //no baptism
                rect2.setAttribute('stroke','#FF9999')
                rect.setAttribute('fill','#F6E3E3');
            }
        }else{
            //no baptism
            rect2.setAttribute('stroke','#FF9999')
            rect.setAttribute('fill','#F6E3E3');
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
        return "JSMassiveSpouseRotBox";
    }
    getHeight(): number {
        return 1600;
    }
    getWidth(): number {
        return 400;//214;
    }
    requiresLoad(): boolean {
        return false;
    }
}