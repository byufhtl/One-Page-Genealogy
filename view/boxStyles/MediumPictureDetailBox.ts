///<reference path="../IBoxRender.ts"/>
///<reference path="../../util/DateFormat.ts"/>
///<reference path="../../util/StringUtils.ts"/>
/**
 * Created by renae on 6/18/15.
 */
class MediumPictureDetailBox implements IBoxRender {
    render(box:IBox, rootElement): any {
        var g:Element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        if(rootElement) {
            rootElement.appendChild(g);
        }
        var rect:Element = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        g.appendChild(rect);

        rect.setAttribute('width', String(this.getWidth()-4));
        rect.setAttribute('height', String(this.getHeight()-6));

        if(isNaN(box.getY())) {
            console.log(box);
        }

        g.setAttribute("transform","translate("+box.getX()+", "+box.getY()+")");


        rect.setAttribute('rx', "10");
        rect.setAttribute('ry', "10");
        rect.setAttribute('stroke-width', '2');


        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text);

        var node: INode = box.getNode();
        if(node.hasAttr('name')) {
            var nameTextPath = document.createTextNode(box.getNode().getAttr('name'));
            text.appendChild(nameTextPath);
            text.setAttribute("x", "110");
            text.setAttribute("y", "25");
            text.setAttribute("font-size", "24px");
//            StringUtils.centerElement(text, 40, 240);
            StringUtils.fitName(text,node.getAttr('name'),30);
        }

        var text3 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text3);
        var nameTextPath = document.createTextNode("");
        text3.appendChild(nameTextPath);
        text3.setAttribute("x", "110");
        text3.setAttribute("y", "45");
        text3.setAttribute("font-size", "15px");

        StringUtils.fitDate(text3, node.getAttr('birthdate'), node.getAttr('deathdate'), 240);
//        StringUtils.centerElement(text3, 40, 240);

        var text4 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text4);
        var nameTextPath = document.createTextNode("");
        text4.appendChild(nameTextPath);
        text4.setAttribute("x", "110");
        text4.setAttribute("y", "62");
        text4.setAttribute("font-size", "15px");
//        StringUtils.centerElement(text4, 40, 240);
        StringUtils.fitPlace(text4, node.getAttr('birthplace'), 40);
        text4.textContent = 'B: '+text4.textContent;

        var text5 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text5);
        var nameTextPath = document.createTextNode("");
        text5.appendChild(nameTextPath);
        text5.setAttribute("x", "110");
        text5.setAttribute("y", "82");
        text5.setAttribute("font-size", "15px");
//        StringUtils.centerElement(text5, 40, 240);
        StringUtils.fitPlace(text5, node.getAttr('deathplace'), 40);
        text5.textContent = 'D: '+text5.textContent;

        var text6 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text6);
        var nameTextPath = document.createTextNode("M: marriage place (year)");
        text6.appendChild(nameTextPath);
        text6.setAttribute("x", "110");
        text6.setAttribute("y", "102");
        text6.setAttribute("font-size", "15px");
//        StringUtils.centerElement(text6, 40, 240);

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
            rect.setAttribute('fill','#CFCFC4');
            rect.setAttribute('stroke', 'black');
        }

        var clippath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        clippath.setAttribute('id', 'clip-'+node.getId());
        g.appendChild(clippath);
        var cliprect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        cliprect.setAttribute('width', '100');
        cliprect.setAttribute('height', '100');
        cliprect.setAttribute('rx', '10');
        cliprect.setAttribute('ry', '10');
        cliprect.setAttribute('x', '5');
        cliprect.setAttribute('y', '5');

        clippath.appendChild(cliprect);


        if(node.hasAttr('profilePicturePromise')) {
            var svgimg = document.createElementNS('http://www.w3.org/2000/svg','image');
            svgimg.setAttribute('height','100');
            svgimg.setAttribute('width','100');
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
                svgimg2.setAttribute('height','100');
                svgimg2.setAttribute('width','100');
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
        graphic.setAttribute("transform","translate("+(box.getX()+2)+", "+(box.getY()+4)+")");
    }
    getType(): string {
        return "mediumPictureDetailBox";
    }
    getHeight(): number {
        return 114;
    }
    getWidth(): number {
        return 450;
    }
    requiresLoad(): boolean {
        return true;
    }
}