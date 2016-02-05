///<reference path="../IBoxRender.ts"/>
///<reference path="../../util/DateFormat.ts"/>
///<reference path="../../util/StringUtils.ts"/>
///<reference path="../IBoxData.ts"/>
/**
 * Created by renae on 7/28/15.
 */
class MedSmPicDetRotBox extends IBoxData {
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


        rect.setAttribute('rx', "10");
        rect.setAttribute('ry', "10");
        rect.setAttribute('stroke-width', '2');
        rect.setAttribute('stroke', 'black');


        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        gt.appendChild(text);

        var node: INode = box.getNode();
        if(node.hasAttr('name')) {
            var nameTextPath = document.createTextNode(box.getNode().getAttr('name'));
            text.appendChild(nameTextPath);
            text.setAttribute("x", "95");
            text.setAttribute("y", "25");
            text.setAttribute("font-size", "19px");
            text.setAttribute("fill", box.getTextColor());
            text.setAttribute("style", this.getFont() );
            StringUtils.fitName(text,node.getAttr('name'),23);
        }

        var text3 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        gt.appendChild(text3);
        var nameTextPath = document.createTextNode("");
        text3.appendChild(nameTextPath);
        text3.setAttribute("x", "95");
        text3.setAttribute("y", "45");
        text3.setAttribute("font-size", "15px");
        text3.setAttribute("fill", box.getTextColor());
        text3.setAttribute("style", this.getFont() );

        StringUtils.fitDate(text3, node.getAttr('birthdate'), node.getAttr('deathdate'), 240);
//        StringUtils.centerElement(text3, 40, 240);

        var text4 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        gt.appendChild(text4);
        var nameTextPath = document.createTextNode("");
        text4.appendChild(nameTextPath);
        text4.setAttribute("x", "95");
        text4.setAttribute("y", "62");
        text4.setAttribute("font-size", "14px");
        text4.setAttribute("fill", box.getTextColor());
        text4.setAttribute("style", this.getFont() );
//        StringUtils.centerElement(text4, 40, 240);
        StringUtils.fitPlace(text4, node.getAttr('birthplace'), 25);
        text4.textContent = 'B: '+text4.textContent;

        var text5 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        gt.appendChild(text5);
        var nameTextPath = document.createTextNode("");
        text5.appendChild(nameTextPath);
        text5.setAttribute("x", "95");
        text5.setAttribute("y", "77");
        text5.setAttribute("font-size", "14px");
        text5.setAttribute("fill", box.getTextColor());
        text5.setAttribute("style", this.getFont() );
//        StringUtils.centerElement(text5, 40, 240);
        StringUtils.fitPlace(text5, node.getAttr('deathplace'), 25);
        text5.textContent = 'D: '+text5.textContent;

        /*var text6 = document.createElementNS("http://www.w3.org/2000/svg", "text");
         g.appendChild(text6);
         var nameTextPath = document.createTextNode("M: marriage place (year)");
         text6.appendChild(nameTextPath);
         text6.setAttribute("x", "100");
         text6.setAttribute("y", "92");
         text6.setAttribute("font-size", "12px");
         //        StringUtils.centerElement(text6, 40, 240);*/

        var gender = 'none';
        if(node.hasAttr('gender')) {
            gender = node.getAttr('gender');
        }
        if(box.getColor()!= null){
            rect.setAttribute('fill', box.getColor());
        }
        else if(gender === 'Male') {
            rect.setAttribute('fill','#8DEEEE');
        }
        else if(gender === 'Female') {
            rect.setAttribute('fill','#FFD1DC');
        }
        else {
            rect.setAttribute('fill','#E5E5E5');
        }

        var clippath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        clippath.setAttribute('id', 'clip-'+node.getId());
        gt.appendChild(clippath);
        var cliprect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        cliprect.setAttribute('width', '80');
        cliprect.setAttribute('height', '80');
        cliprect.setAttribute('rx', '10');
        cliprect.setAttribute('ry', '10');
        cliprect.setAttribute('x', '5');
        cliprect.setAttribute('y', '5');

        clippath.appendChild(cliprect);


        if(node.hasAttr('profilePicturePromise')) {
            var svgimg = document.createElementNS('http://www.w3.org/2000/svg','image');
            svgimg.setAttribute('height','80');
            svgimg.setAttribute('width','80');
            svgimg.setAttributeNS('http://www.w3.org/1999/xlink','href','images/loading.svg');
            svgimg.setAttribute('x','5');
            svgimg.setAttribute('y','5');
            svgimg.setAttribute('clip-path', 'url(#clip-'+node.getId()+')');
            gt.appendChild(svgimg);
            node.getAttr('profilePicturePromise').then(function(response) {
                if(!response) {
                    gt.removeChild(svgimg);
                    return;
                }
                var svgimg2 = document.createElementNS('http://www.w3.org/2000/svg','image');
                svgimg2.setAttribute('height','80');
                svgimg2.setAttribute('width','80');
                svgimg2.setAttribute('x','5');
                svgimg2.setAttribute('y','5');
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
                text.setAttribute('x','15');
                text3.setAttribute('x','15');
                text4.setAttribute('x','15');
                StringUtils.fitPlace(text4, node.getAttr('birthplace'), 40);
                text4.textContent = 'B: '+text4.textContent;
                text5.setAttribute('x','15');
                StringUtils.fitPlace(text5, node.getAttr('deathplace'), 40);
                text5.textContent = 'D: '+text5.textContent;
            });
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
        return "medSmPicDetRotBox";
    }
    getHeight(): number {
        return 312;
    }
    getWidth(): number {
        return 89+2+3//104;
    }
    requiresLoad(): boolean {
        return true;
    }
}