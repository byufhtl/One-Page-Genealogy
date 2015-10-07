///<reference path="../../IBoxRender.ts"/>
///<reference path="../../../util/StringUtils.ts"/>
/**
 * Created by renae on 10/2/15.
 */
class JSMedDetRotSpPubBox implements IBoxRender {
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


        rect.setAttribute('rx', "10");
        rect.setAttribute('ry', "10");
        rect.setAttribute('stroke-width', '5');

        rect.setAttribute('stroke', 'black')
        var rect2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect2.setAttribute('rx','5')
        rect2.setAttribute('ry','5')
        rect2.setAttribute('stroke-width','15')
        rect2.setAttribute('stroke','#E2C6FF')
        rect2.setAttribute('width', String(this.getWidth()-33));
        rect2.setAttribute('height', String(box.getHeight()-30-box.getSpace()));
        //rect2.setAttribute('height', String(box.getHeight()-10));
        g.appendChild(rect2)
        rect2.setAttribute('x','15')
        rect2.setAttribute('y','14')
        rect2.setAttribute('fill-opacity','.001')


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
            //text.setAttribute("y", "110");
            text.setAttribute("font-size", "21px");
            text.setAttribute("style", "font-family:tahoma, sans-serif");
            if(node.isMainPerson())
                text.setAttribute("font-weight", "bold");
            StringUtils.fitName(text,node.getAttr('name'),20);
            //StringUtils.centerElement(text, 210, 290);
        }

        var text3 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        firstG.appendChild(text3);
        var nameTextPath = document.createTextNode("");
        text3.appendChild(nameTextPath);
        //text3.setAttribute("x", "10");
        text3.setAttribute("y", "20");
        text3.setAttribute("font-size", "17px");
        text3.setAttribute("style", "font-family:tahoma, sans-serif");

        StringUtils.fitDatePlace2(text3,node.getAttr('birthdate'),node.getAttr('birthplace'),40);
        //StringUtils.fitDate(text3, node.getAttr('birthdate'), node.getAttr('deathdate'), 240);
        //StringUtils.centerElement(text3, 210, 290);

        var text4 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        firstG.appendChild(text4);
        var nameTextPath = document.createTextNode("");
        text4.appendChild(nameTextPath);
        //text4.setAttribute("x", "10");
        text4.setAttribute("y", "40");
        text4.setAttribute("font-size", "16px");
        text4.setAttribute("style", "font-family:sans-serif");
        StringUtils.fitDatePlace2(text4,node.getAttr('deathdate'),node.getAttr('deathplace'),40);


        firstG.setAttribute('transform','translate(10,110)')
        secondG.setAttribute('transform','translate(10,110)')

        spousenode = node.getDisplaySpouse();


        var firstGGender = null;
        var secondGGender = null;

        if(spousenode.hasAttr('gender')){
            secondGGender = spousenode.getAttr('gender')
            if(secondGGender== "Male"){
                firstG.setAttribute('transform','translate(10,202)')
            }else{
                secondG.setAttribute('transform','translate(10,202)')
            }
        }else if(node.hasAttr('gender')){
            firstGGender = node.getAttr('gender')
            if(firstGGender == "Male"){
                secondG.setAttribute('transform','translate(10,202)')
            }else{
                firstG.setAttribute('transform','translate(10,202)')
            }
        }else{
            if(spousenode.isMainPerson()){
                firstG.setAttribute('transform','translate(10,202)')
            }else {
                secondG.setAttribute('transform','translate(10,202)')
            }
        }

        //console.log(spousenode)
        if(spousenode != null) {
            var text6 = document.createElementNS("http://www.w3.org/2000/svg", "text");
            secondG.appendChild(text6);
            var nameTextPath = document.createTextNode('Spouse Name');
            text6.appendChild(nameTextPath);
            text6.setAttribute("font-size", "21px");
            text6.setAttribute("style", "font-family:tahoma, sans-serif");
            if (spousenode.isMainPerson())
                text6.setAttribute("font-weight", "bold");

            StringUtils.fitName(text6, spousenode.getAttr('name'), 20);

            var text7 = document.createElementNS("http://www.w3.org/2000/svg", "text");
            secondG.appendChild(text7);
            var nameTextPath = document.createTextNode("");
            text7.appendChild(nameTextPath);
            //text7.setAttribute("x", "10");
            text7.setAttribute("y", "20");
            text7.setAttribute("font-size", "17px");
            text7.setAttribute("style", "font-family:tahoma, sans-serif");
            StringUtils.fitDatePlace2(text7,node.getAttr('birthdate'),node.getAttr('birthplace'),40);
            //StringUtils.fitDate(text7, spousenode.getAttr('birthdate'), node.getAttr('deathdate'), 290);
            //StringUtils.centerElement(text3, 210, 290);

            var text8 = document.createElementNS("http://www.w3.org/2000/svg", "text");
            secondG.appendChild(text8);
            var nameTextPath = document.createTextNode("");
            text8.appendChild(nameTextPath);
            //text8.setAttribute("x", "10");
            text8.setAttribute("y", "40");
            text8.setAttribute("font-size", "16px");
            text8.setAttribute("style", "font-family:sans-serif");
            StringUtils.fitDatePlace2(text8,node.getAttr('deathdate'),node.getAttr('deathplace'),40);
         }

        var text10 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        gt.appendChild(text10);
        //var date = new Date();
        var nameTextPath = document.createTextNode("M: "+StringUtils.standardDate(node.getAttr('marriagedate')));//date.toDateString()));
        text10.appendChild(nameTextPath);
        //var nameTextPath = document.createTextNode("M: "+StringUtils.standardDate(date.toDateString()));
        //text10.appendChild(nameTextPath);
        text10.setAttribute("x", "10");
        text10.setAttribute("y", "290");
        text10.setAttribute("font-size", "17px");
        text10.setAttribute("style", "font-family:tahoma, sans-serif");
        //StringUtils.centerElement(text10, 100, 290)

        var nodeMale = false;
        if (node.hasAttr('gender')){
            if(node.getAttr('gender') == "Male"){
                nodeMale = true;
            }
        }




        var clippath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        clippath.setAttribute('id', 'clip-'+node.getId());
        gt.appendChild(clippath);
        var cliprect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        cliprect.setAttribute('width', '84');
        cliprect.setAttribute('height', '84');
        cliprect.setAttribute('rx', '10');
        cliprect.setAttribute('ry', '10');
        if(nodeMale){
            cliprect.setAttribute('x', '25');
        }else{
            cliprect.setAttribute('x', '140');
        }
        cliprect.setAttribute('y', '7');

        clippath.appendChild(cliprect);


        if(node.hasAttr('profilePicturePromise')) {
            var svgimg = document.createElementNS('http://www.w3.org/2000/svg','image');
            svgimg.setAttribute('height','84');
            svgimg.setAttribute('width','84');
            svgimg.setAttributeNS('http://www.w3.org/1999/xlink','href','images/loading.svg');
            if(nodeMale){
                svgimg.setAttribute('x', '25');
            }else{
                svgimg.setAttribute('x', '140');
            }            svgimg.setAttribute('y','7');
            svgimg.setAttribute('clip-path', 'url(#clip-'+node.getId()+')');
            gt.appendChild(svgimg);
            node.getAttr('profilePicturePromise').then(function(response) {
                if(!response) {
                    gt.removeChild(svgimg);
                    return;
                }
                var svgimg2 = document.createElementNS('http://www.w3.org/2000/svg','image');
                svgimg2.setAttribute('height','85');
                svgimg2.setAttribute('width','85');
                if(nodeMale){
                    svgimg2.setAttribute('x', '25');
                }else{
                    svgimg2.setAttribute('x', '140');
                }                svgimg2.setAttribute('y','7');
                svgimg2.setAttribute('clip-path', 'url(#clip-'+node.getId()+')');

                function listener() {
                    gt.removeChild(svgimg);
                    svgimg2.removeEventListener('load', listener);
                }
                svgimg2.addEventListener('load', listener);
                svgimg2.setAttributeNS('http://www.w3.org/1999/xlink','href',response);
                gt.appendChild(svgimg2);


            }, function() {
                gt.removeChild(svgimg);
            });
        }

        if(spousenode != null) {

            var spouseMale = false
            if(spousenode.hasAttr('gender')){
                if(spousenode.getAttr('gender') == "Male"){
                    spouseMale = true;
                }
            }

            //spouse pic
            var clippath2 = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
            clippath2.setAttribute('id', 'clip-'+spousenode.getId());
            gt.appendChild(clippath2);
            var cliprect2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            cliprect2.setAttribute('width', '84');
            cliprect2.setAttribute('height', '84');
            cliprect2.setAttribute('rx', '10');
            cliprect2.setAttribute('ry', '10');
            if(spouseMale){
                cliprect2.setAttribute('x','25')
            }else{
                cliprect2.setAttribute('x', '140');
            }
            cliprect2.setAttribute('y', '7');

            clippath2.appendChild(cliprect2);


            if (spousenode.hasAttr('profilePicturePromise')) {
                var svgimg3 = document.createElementNS('http://www.w3.org/2000/svg', 'image');
                svgimg3.setAttribute('height', '85');
                svgimg3.setAttribute('width', '85');
                svgimg3.setAttributeNS('http://www.w3.org/1999/xlink', 'href', 'images/loading.svg');
                if(spouseMale){
                    svgimg3.setAttribute('x','25')
                }else{
                    svgimg3.setAttribute('x', '140');
                }                svgimg3.setAttribute('y', '7');
                svgimg3.setAttribute('clip-path', 'url(#clip-' + spousenode.getId() + ')');
                gt.appendChild(svgimg3);
                spousenode.getAttr('profilePicturePromise').then(function (response) {
                    if (!response) {
                        gt.removeChild(svgimg3);
                        return;
                    }
                    var svgimg4 = document.createElementNS('http://www.w3.org/2000/svg', 'image');
                    svgimg4.setAttribute('height', '85');
                    svgimg4.setAttribute('width', '85');
                    if(spouseMale){
                        svgimg4.setAttribute('x','25')
                    }else{
                        svgimg4.setAttribute('x', '140');
                    }                    svgimg4.setAttribute('y', '7');
                    svgimg4.setAttribute('clip-path', 'url(#clip-' + spousenode.getId() + ')');

                    function listener() {
                        gt.removeChild(svgimg3);
                        svgimg4.removeEventListener('load', listener);
                    }

                    svgimg4.addEventListener('load', listener);
                    svgimg4.setAttributeNS('http://www.w3.org/1999/xlink', 'href', response);
                    gt.appendChild(svgimg4);


                }, function () {
                    gt.removeChild(svgimg3);
                });
            }
        }

        if(box.getColor()!= null){
            rect.setAttribute('fill', 'white');
            rect2.setAttribute('stroke',box.getColor());
            rect2.setAttribute('fill',box.getColor());
        }
        else {
            rect.setAttribute('fill','#F9F4FF');//'#CC99FF');
        }


        gt.setAttribute("transform","translate(0, "+ (this.getHeight()-2)+") rotate(-90 0,0)");
        //gt.setAttribute("transform","translate(0, "+ (this.getHeight()-2)+")");

        return g;
    }
    move(box:IBox, graphic: any): any {
        //graphic.setAttribute("transform","translate("+(box.getX()+2)+", "+(box.getY()+4)+")");
        graphic.setAttribute("transform","translate("+(box.getX()+2)+", "+
            (box.getY()+1+Math.round(box.getSpace()/2))+")");
    }
    getType(): string {
        return "JSmedDetRotSpPubBox";
    }
    getHeight(): number {
        return 250;
    }
    getWidth(): number {
        return 312;
    }
    requiresLoad(): boolean {
        return true;
    }
}