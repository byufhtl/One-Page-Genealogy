///<reference path="../IBoxRender.ts"/>
///<reference path="../../util/DateFormat.ts"/>
///<reference path="../../util/StringUtils.ts"/>
/**
 * Created by renae on 6/10/15.
 */
class LargePictureDetailBox2 implements IBoxRender {
    render(box:IBox, rootElement): any {
        var g:Element = document.createElementNS("http://www.w3.org/2000/svg", "g");
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


        rect.setAttribute('rx', "20");
        rect.setAttribute('ry', "20");
        rect.setAttribute('stroke-width', '2');


        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text);

        var node: INode = box.getNode();
        if(node.hasAttr('givenname')) {
            var nameTextPath = document.createTextNode(box.getNode().getAttr('givenname'));
            text.appendChild(nameTextPath);
            text.setAttribute("x", "220");
            text.setAttribute("y", "35");
            text.setAttribute("font-size", "30px");
            //StringUtils.centerElement(text, 210, 290);
        }

        var text2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text2);
        if(node.hasAttr('surname')) {
            var nameTextPath = document.createTextNode(box.getNode().getAttr('surname'));
            text2.appendChild(nameTextPath);
            text2.setAttribute("x", "220");
            text2.setAttribute("y", "80");
            text2.setAttribute("font-size", "40px");
            //StringUtils.centerElement(text2, 210, 290);
        }

        var text3 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text3);
        var nameTextPath = document.createTextNode("");
        text3.appendChild(nameTextPath);
        text3.setAttribute("x", "220");
        text3.setAttribute("y", "120");
        text3.setAttribute("font-size", "20px");


        StringUtils.fitDate(text3, node.getAttr('birthdate'), node.getAttr('deathdate'), 290);
        //StringUtils.centerElement(text3, 210, 290);

        var text4 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text4);
        var nameTextPath = document.createTextNode("");
        text4.appendChild(nameTextPath);
        text4.setAttribute("x", "220");
        text4.setAttribute("y", "150");
        text4.setAttribute("font-size", "20px");
        //StringUtils.centerElement(text4, 210, 290);
        StringUtils.fitPlace(text4, node.getAttr('birthplace'), 25);
        text4.textContent = 'B: '+text4.textContent;

        var text5 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text5);
        var nameTextPath = document.createTextNode("");
        text5.appendChild(nameTextPath);
        text5.setAttribute("x", "220");
        text5.setAttribute("y", "175");
        text5.setAttribute("font-size", "20px");
        //StringUtils.centerElement(text5, 210, 290);
        StringUtils.fitPlace(text5, node.getAttr('deathplace'), 25);
        text5.textContent = 'D: '+text5.textContent;

        /*var text5 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text5);
        var nameTextPath = document.createTextNode("M: marriage place (year)");
        text5.appendChild(nameTextPath);
        text5.setAttribute("x", "225");
        text5.setAttribute("y", "200");
        text5.setAttribute("font-size", "20px");
        //StringUtils.centerElement(text5, 210, 290);*/


        var gender = 'none';
        var grayScale = box.isGray();
        if(node.hasAttr('gender')) {
            gender = node.getAttr('gender');
        }
        if(gender === 'Male' && !grayScale) {
            rect.setAttribute('fill','#8DEEEE');
            rect.setAttribute('stroke', '#2ee0e0');

        }
        else if(gender === 'Female' && !grayScale) {
            rect.setAttribute('fill','#FFD1DC');
            rect.setAttribute('stroke', '#ffa3b9');
        }
        else {
            rect.setAttribute('fill','#E5E5E5');
            rect.setAttribute('stroke', 'black');
        }

        var clippath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        clippath.setAttribute('id', 'clip-'+node.getId());
        g.appendChild(clippath);
        var cliprect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        cliprect.setAttribute('width', '190');
        cliprect.setAttribute('height', '190');
        cliprect.setAttribute('rx', '20');
        cliprect.setAttribute('ry', '20');
        cliprect.setAttribute('x', '5');
        cliprect.setAttribute('y', '5');

        clippath.appendChild(cliprect);


        if(node.hasAttr('profilePicturePromise')) {
            var svgimg = document.createElementNS('http://www.w3.org/2000/svg','image');
            svgimg.setAttribute('height','190');
            svgimg.setAttribute('width','190');
            svgimg.setAttributeNS('http://www.w3.org/1999/xlink','href','images/loading.svg');
            svgimg.setAttribute('x','5');
            svgimg.setAttribute('y','5');
            svgimg.setAttribute('clip-path', 'url(#clip-'+node.getId()+')');
            g.appendChild(svgimg);
            node.getAttr('profilePicturePromise').then(function(response) {
                if(!response) {
                    g.removeChild(svgimg);
                    return;
                }
                var svgimg2 = document.createElementNS('http://www.w3.org/2000/svg','image');
                svgimg2.setAttribute('height','190');
                svgimg2.setAttribute('width','190');
                svgimg2.setAttribute('x','5');
                svgimg2.setAttribute('y','5');
                svgimg2.setAttribute('clip-path', 'url(#clip-'+node.getId()+')');

                function listener() {
                    g.removeChild(svgimg);
                    svgimg2.removeEventListener('load', listener);
                }
                svgimg2.addEventListener('load', listener);
                svgimg2.setAttributeNS('http://www.w3.org/1999/xlink','href',response);
                g.appendChild(svgimg2);


            }, function() {
                g.removeChild(svgimg);
            });
        }

        return g;
    }
    move(box:IBox, graphic: any): any {
        //graphic.setAttribute("transform","translate("+(box.getX()+2)+", "+(box.getY()+4)+")");
        graphic.setAttribute("transform","translate("+(box.getX()+2)+", "+
            (box.getY()+1+Math.round(box.getSpace()/2))+")");
    }
    getType(): string {
        return "largePictureDetailBox2";
    }
    getHeight(): number {
        return 199+2;//214;
    }
    getWidth(): number {
        return 500;
    }
    requiresLoad(): boolean {
        return true;
    }
}