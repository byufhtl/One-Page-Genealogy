///<reference path="../IBoxRender.ts"/>
///<reference path="../../util/DateFormat.ts"/>
///<reference path="../../util/StringUtils.ts"/>
///<reference path="../IBoxData.ts"/>
/**
 * Created by renae on 8/20/15.
 */
class LrgPicDetRotSpBox extends IBoxData {
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

        g.setAttribute("transform","translate("+box.getX()+", "+box.getY()+")");


        rect.setAttribute('rx', "20");
        rect.setAttribute('ry', "20");
        rect.setAttribute('stroke-width', '2');
        rect.setAttribute('stroke', 'black');




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
            //text.setAttribute("y", "35");
            text.setAttribute("font-size", "30px");
            text.setAttribute("style", this.getFont() );
            if(node.isMainPerson())
                text.setAttribute("font-weight", "bold");
            StringUtils.fitName(text,node.getAttr('name'),28);
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
         text2.setAttribute("style", this.getFont() );
         StringUtils.fitName(text2,node.getAttr('surname'),30);
         //StringUtils.centerElement(text2, 210, 290);
         }*/

        var text3 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        firstG.appendChild(text3);
        var nameTextPath = document.createTextNode("");
        text3.appendChild(nameTextPath);
        //text3.setAttribute("x", "160");
        text3.setAttribute("y", "40");
        text3.setAttribute("font-size", "20px");
        text3.setAttribute("style", this.getFont() );

        StringUtils.fitDate(text3, node.getAttr('birthdate'), node.getAttr('deathdate'), 290);
        //StringUtils.centerElement(text3, 210, 290);

        var text4 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        firstG.appendChild(text4);
        var nameTextPath = document.createTextNode("");
        text4.appendChild(nameTextPath);
        //text4.setAttribute("x", "160");
        text4.setAttribute("y", "70");
        text4.setAttribute("font-size", "20px");
        text4.setAttribute("style", this.getFont() );
        //StringUtils.centerElement(text4, 210, 290);
        StringUtils.fitPlace(text4, node.getAttr('birthplace'), 28);
        text4.textContent = 'B: '+text4.textContent;

        var text5 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        firstG.appendChild(text5);
        var nameTextPath = document.createTextNode("");
        text5.appendChild(nameTextPath);
        //text5.setAttribute("x", "160");
        text5.setAttribute("y", "95");
        text5.setAttribute("font-size", "20px");
        text5.setAttribute("style", this.getFont() );
        //StringUtils.centerElement(text5, 210, 290);
        StringUtils.fitPlace(text5, node.getAttr('deathplace'), 28);
        text5.textContent = 'D: '+text5.textContent;

        firstG.setAttribute('transform','translate(160,35)')
        secondG.setAttribute('transform','translate(160,35)')

        spousenode = node.getDisplaySpouse();


        var firstGGender = null;
        var secondGGender = null;

        if(spousenode.hasAttr('gender')){
            secondGGender = spousenode.getAttr('gender')
            if(secondGGender== "Male"){
                firstG.setAttribute('transform','translate(160,170)')
            }else{
                secondG.setAttribute('transform','translate(160,170)')
            }
        }else if(node.hasAttr('gender')){
            firstGGender = node.getAttr('gender')
            if(firstGGender == "Male"){
                secondG.setAttribute('transform','translate(160,170)')
            }else{
                firstG.setAttribute('transform','translate(160,170)')
            }
        }else{
            if(spousenode.isMainPerson()){
                firstG.setAttribute('transform','translate(160,170)')
            }else {
                secondG.setAttribute('transform','translate(160,170)')
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
            //text6.setAttribute("y", "175");
            text6.setAttribute("font-size", "30px");
            text6.setAttribute("style", this.getFont() );
            if (spousenode.isMainPerson())
                text6.setAttribute("font-weight", "bold");

            StringUtils.fitName(text6, spousenode.getAttr('name'), 28);


            //StringUtils.centerElement(text, 210, 290);
            //}

            var text7 = document.createElementNS("http://www.w3.org/2000/svg", "text");
            secondG.appendChild(text7);
            var nameTextPath = document.createTextNode("");
            text7.appendChild(nameTextPath);
            //text7.setAttribute("x", "160");
            text7.setAttribute("y", "40");
            text7.setAttribute("font-size", "20px");
            text7.setAttribute("style", this.getFont() );

            StringUtils.fitDate(text7, spousenode.getAttr('birthdate'), node.getAttr('deathdate'), 290);
            //StringUtils.centerElement(text3, 210, 290);

            var text8 = document.createElementNS("http://www.w3.org/2000/svg", "text");
            secondG.appendChild(text8);
            var nameTextPath = document.createTextNode("");
            text8.appendChild(nameTextPath);
            //text8.setAttribute("x", "160");
            text8.setAttribute("y", "70");
            text8.setAttribute("font-size", "20px");
            text8.setAttribute("style", this.getFont() );
            //StringUtils.centerElement(text4, 210, 290);
            StringUtils.fitPlace(text8, spousenode.getAttr('birthplace'), 28);
            text8.textContent = 'B: ' + text8.textContent;

            var text9 = document.createElementNS("http://www.w3.org/2000/svg", "text");
            secondG.appendChild(text9);
            var nameTextPath = document.createTextNode("");
            text9.appendChild(nameTextPath);
            //text9.setAttribute("x", "160");
            text9.setAttribute("y", "95");
            text9.setAttribute("font-size", "20px");
            text9.setAttribute("style", this.getFont() );
            //StringUtils.centerElement(text5, 210, 290);
            StringUtils.fitPlace(text9, spousenode.getAttr('deathplace'), 28);
            text9.textContent = 'D: ' + text9.textContent;
        }

        var text10 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        gt.appendChild(text10);
        //var date = new Date();
        var nameTextPath = document.createTextNode("M: "+StringUtils.standardDate(node.getAttr('marriagedate')));//date.toDateString()));
        text10.appendChild(nameTextPath);
        //var nameTextPath = document.createTextNode("M: "+StringUtils.standardDate(date.toDateString()));
        //text10.appendChild(nameTextPath);
        text10.setAttribute("x", "160");
        text10.setAttribute("y", "310");
        text10.setAttribute("font-size", "20px");
        text10.setAttribute("style", this.getFont() );


        if(box.getColor()!= null){
            rect.setAttribute('fill', box.getColor());
        }
        else {
            rect.setAttribute('fill','#E2C6FF');//'#CC99FF');
        }

        var clippath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        clippath.setAttribute('id', 'clip-'+node.getId());
        firstG.appendChild(clippath);
        var cliprect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        cliprect.setAttribute('width', '135');
        cliprect.setAttribute('height', '135');
        cliprect.setAttribute('rx', '20');
        cliprect.setAttribute('ry', '20');
        cliprect.setAttribute('x', '-145');
        cliprect.setAttribute('y', '-25');

        clippath.appendChild(cliprect);


        if(node.hasAttr('profilePicturePromise')) {
            var svgimg = document.createElementNS('http://www.w3.org/2000/svg','image');
            svgimg.setAttribute('height','135');
            svgimg.setAttribute('width','135');
            svgimg.setAttributeNS('http://www.w3.org/1999/xlink','href','images/loading.svg');
            svgimg.setAttribute('x', '-145');
            svgimg.setAttribute('y', '-25');
            svgimg.setAttribute('clip-path', 'url(#clip-'+node.getId()+')');
            firstG.appendChild(svgimg);
            node.getAttr('profilePicturePromise').then(function(response) {
                if(!response) {
                    firstG.removeChild(svgimg);
                    return;
                }
                var svgimg2 = document.createElementNS('http://www.w3.org/2000/svg','image');
                svgimg2.setAttribute('height','135');
                svgimg2.setAttribute('width','135');
                svgimg2.setAttribute('x', '-145');
                svgimg2.setAttribute('y', '-25');
                svgimg2.setAttribute('clip-path', 'url(#clip-'+node.getId()+')');

                function listener() {
                    firstG.removeChild(svgimg);
                    svgimg2.removeEventListener('load', listener);
                }
                svgimg2.addEventListener('load', listener);
                svgimg2.setAttributeNS('http://www.w3.org/1999/xlink','href',response);
                firstG.appendChild(svgimg2);


            }, function() {
                firstG.removeChild(svgimg);
            });
        }

        if(spousenode != null) {

            //spouse pic
            var clippath2 = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
            clippath2.setAttribute('id', 'clip-' + spousenode.getId());
            secondG.appendChild(clippath2);
            var cliprect2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            cliprect2.setAttribute('width', '135');
            cliprect2.setAttribute('height', '135');
            cliprect2.setAttribute('rx', '20');
            cliprect2.setAttribute('ry', '20');
            cliprect2.setAttribute('x', '-145');
            cliprect2.setAttribute('y', '-25');

            clippath2.appendChild(cliprect2);


            if (spousenode.hasAttr('profilePicturePromise')) {
                var svgimg3 = document.createElementNS('http://www.w3.org/2000/svg', 'image');
                svgimg3.setAttribute('height', '135');
                svgimg3.setAttribute('width', '135');
                svgimg3.setAttributeNS('http://www.w3.org/1999/xlink', 'href', 'images/loading.svg');
                svgimg3.setAttribute('x', '-145');
                svgimg3.setAttribute('y', '-25');
                svgimg3.setAttribute('clip-path', 'url(#clip-' + spousenode.getId() + ')');
                secondG.appendChild(svgimg3);
                spousenode.getAttr('profilePicturePromise').then(function (response) {
                    if (!response) {
                        secondG.removeChild(svgimg3);
                        return;
                    }
                    var svgimg4 = document.createElementNS('http://www.w3.org/2000/svg', 'image');
                    svgimg4.setAttribute('height', '135');
                    svgimg4.setAttribute('width', '135');
                    svgimg4.setAttribute('x', '-145');
                    svgimg4.setAttribute('y', '-25');
                    svgimg4.setAttribute('clip-path', 'url(#clip-' + spousenode.getId() + ')');

                    function listener() {
                        secondG.removeChild(svgimg3);
                        svgimg4.removeEventListener('load', listener);
                    }

                    svgimg4.addEventListener('load', listener);
                    svgimg4.setAttributeNS('http://www.w3.org/1999/xlink', 'href', response);
                    secondG.appendChild(svgimg4);


                }, function () {
                    secondG.removeChild(svgimg3);
                });
            }
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
        return "lrgPicDetRotSpBox";
    }
    getHeight(): number {
        return 500;
    }
    getWidth(): number {
        return 319+2+3;//214;
    }
    requiresLoad(): boolean {
        return true;
    }
}