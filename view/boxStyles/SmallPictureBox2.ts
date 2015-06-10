///<reference path="../IBoxRender.ts"/>
///<reference path="../../util/DateFormat.ts"/>
///<reference path="../../util/StringUtils.ts"/>
/**
 * Created by renae on 6/5/15.
 */
class SmallPictureBox2 implements IBoxRender {
    render(box:IBox, rootElement): any {
        var g:Element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        if(rootElement) {
            rootElement.appendChild(g);
        }
        var rect:Element = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        g.appendChild(rect);

        rect.setAttribute('width', String(this.getWidth()));
        rect.setAttribute('height', String(this.getHeight()));

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
            text.setAttribute("x", "0");
            text.setAttribute("y", "150");
            text.setAttribute("font-size", "20px");
            StringUtils.centerElement(text, 0, 160);
        }

        var text2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text2);
        if(node.hasAttr('surname')) {
            var nameTextPath = document.createTextNode(box.getNode().getAttr('surname'));
            text2.appendChild(nameTextPath);
            text2.setAttribute("x", "0");
            text2.setAttribute("y", "175");
            text2.setAttribute("font-size", "20px");
            StringUtils.centerElement(text2, 0, 160);
        }

        var text3 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text3);
        var nameTextPath = document.createTextNode("");
        text3.appendChild(nameTextPath);
        text3.setAttribute("x", "0");
        text3.setAttribute("y", "205");
        text3.setAttribute("font-size", "15px");


        StringUtils.fitDate(text3, node.getAttr('birthdate'), node.getAttr('deathdate'), 150);
        StringUtils.centerElement(text3, 0, 160);

        var text4 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text4);
        var nameTextPath = document.createTextNode("B: birth place");
        text4.appendChild(nameTextPath);
        text4.setAttribute("x", "0");
        text4.setAttribute("y", "225");
        text4.setAttribute("font-size", "15px");
        StringUtils.centerElement(text4, 0, 160);

        var text5 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text5);
        var nameTextPath = document.createTextNode("D: death place");
        text5.appendChild(nameTextPath);
        text5.setAttribute("x", "0");
        text5.setAttribute("y", "245");
        text5.setAttribute("font-size", "15px");
        StringUtils.centerElement(text5, 0, 160);

        var text6 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text6);
        var nameTextPath = document.createTextNode("M: marriage place");
        text6.appendChild(nameTextPath);
        text6.setAttribute("x", "0");
        text6.setAttribute("y", "265");
        text6.setAttribute("font-size", "15px");
        StringUtils.centerElement(text6, 0, 160);

        var text7 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text7);
        var nameTextPath = document.createTextNode("(marriage date)");
        text7.appendChild(nameTextPath);
        text7.setAttribute("x", "0");
        text7.setAttribute("y", "285");
        text7.setAttribute("font-size", "15px");
        StringUtils.centerElement(text7, 0, 160);



        var gender = 'none';
        if(node.hasAttr('gender')) {
            gender = node.getAttr('gender');
        }
        if(gender === 'Male') {
            rect.setAttribute('fill','#8DEEEE');
            rect.setAttribute('stroke', '#2ee0e0');

        }
        else if(gender === 'Female') {
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
        cliprect.setAttribute('width', '150');
        cliprect.setAttribute('height', '150');
        cliprect.setAttribute('rx', '20');
        cliprect.setAttribute('ry', '20');
        cliprect.setAttribute('x', '5');
        cliprect.setAttribute('y', '5');

        clippath.appendChild(cliprect);


        if(node.hasAttr('profilePicturePromise')) {
            var svgimg = document.createElementNS('http://www.w3.org/2000/svg','image');
            svgimg.setAttribute('height','150');
            svgimg.setAttribute('width','150');
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
                svgimg2.setAttribute('height','150');
                svgimg2.setAttribute('width','150');
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
        graphic.setAttribute("transform","translate("+box.getX()+", "+box.getY()+")");
    }
    getType(): string {
        return "smallPictureBox2";
    }
    getHeight(): number {
        return 300;
    }
    getWidth(): number {
        return 150;
    }
    requiresLoad(): boolean {
        return true;
    }
}