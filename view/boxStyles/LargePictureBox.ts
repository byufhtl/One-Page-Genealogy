///<reference path="../IBoxRender.ts"/>
///<reference path="../../util/DateFormat.ts"/>
///<reference path="../../util/StringUtils.ts"/>
///<reference path="../IBoxData.ts"/>
/**
 * Created by curtis on 3/16/15.
 */
class LargePictureBox extends IBoxData {
    render(box:IBox, rootElement): any {

        // SETUP =================================================================================

        var g:Element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        if(rootElement) {
            rootElement.appendChild(g);
        }
        var rect:Element = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        g.appendChild(rect);
        var node = box.getNode();

        // BOX CONFIG ============================================================================

        rect.setAttribute('width', String(this.getWidth()));
        rect.setAttribute('height', String(box.getHeight()-2-box.getSpace()));

        if(isNaN(box.getY())) {
            console.log(box);
        }

        g.setAttribute("transform","translate("+box.getX()+", "+box.getY()+")");

        rect.setAttribute('rx', "20");
        rect.setAttribute('ry', "20");
        rect.setAttribute('stroke-width', '2');
        rect.setAttribute('stroke', 'black');

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

        // TEXT CONFIG ===========================================================================

        // Name
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        var text2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text);
        g.appendChild(text2);
        if (node.hasAttr('givenname') && node.hasAttr('surname')) {
            if (node.hasAttr('givenname') || node.hasAttr('given')) {
                var nameTextPath = document.createTextNode(box.getNode().getAttr('givenname'));
                text.appendChild(nameTextPath);
                text.setAttribute("x", "15");
                text.setAttribute("y", "300");
                text.setAttribute("font-size", "30px");
                if(box.getTextColor() != null) {
                    text.setAttribute("fill", box.getTextColor());
                }
                text.setAttribute("style", this.getFont());
                StringUtils.fitName(text, node.getAttr('givenname'), 30);
            }
            g.appendChild(text2);
            if (node.hasAttr('surname')) {
                var nameTextPath = document.createTextNode(box.getNode().getAttr('surname'));
                text2.appendChild(nameTextPath);
                text2.setAttribute("x", "15");
                text2.setAttribute("y", "345");
                text2.setAttribute("font-size", "40px");
                if(box.getTextColor() != null) {
                    text2.setAttribute("fill", box.getTextColor());
                }
                text2.setAttribute("style", this.getFont() );
                StringUtils.fitName(text2, node.getAttr('surname'), 30);
            }
        }
        else if (node.hasAttr('name')) {
            var fullname = (box.getNode().getAttr('name'));
            var splitName = fullname.split(" ");
            var firstName = "";
            if (splitName.length == 2) {
                firstName = splitName[0];
            }
            else if (splitName.length > 2) {
                firstName = splitName[0] + " " + splitName[1];
            }
            var nameTextPath = document.createTextNode(firstName);
            text.appendChild(nameTextPath);
            text.setAttribute("x", "15");
            text.setAttribute("y", "300");
            text.setAttribute("font-size", "30px");
            if(box.getTextColor() != null) {
                text.setAttribute("fill", box.getTextColor());
            }
            text.setAttribute("style", this.getFont() );
            StringUtils.fitName(text, firstName, 30);
            var nameTextPath2 = document.createTextNode(splitName[splitName.length - 1]);
            text2.appendChild(nameTextPath2);
            text2.setAttribute("x", "15");
            text2.setAttribute("y", "345");
            text2.setAttribute("font-size", "40px");
            if(box.getTextColor() != null) {
                text2.setAttribute("fill", box.getTextColor());
            }
            text2.setAttribute("style", this.getFont() );
            StringUtils.fitName(text2, node.getAttr('surname'), 30);
            //StringUtils.centerElement(text2, 0, 260);
        }

        // Dates
        var text3 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text3);
        var nameTextPath = document.createTextNode("");
        text3.appendChild(nameTextPath);
        text3.setAttribute("x", "10");
        text3.setAttribute("y", "375");
        text3.setAttribute("font-size", "20px");
        if(box.getTextColor() != null) {
            text3.setAttribute("fill", box.getTextColor());
        }
        text3.setAttribute("style", this.getFont() );
        StringUtils.fitDate(text3, node.getAttr('birthdate'), node.getAttr('deathdate'), 250);

        // Picture
        var clippath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        clippath.setAttribute('id', 'clip-'+node.getId());
        g.appendChild(clippath);
        var cliprect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        cliprect.setAttribute('width', '250');
        cliprect.setAttribute('height', '250');
        cliprect.setAttribute('rx', '20');
        cliprect.setAttribute('ry', '20');
        cliprect.setAttribute('x', '5');
        cliprect.setAttribute('y', '5');

        clippath.appendChild(cliprect);

        if(node.hasAttr('profilePicturePromise')) {
            var svgimg = document.createElementNS('http://www.w3.org/2000/svg','image');
            svgimg.setAttribute('height','250');
            svgimg.setAttribute('width','250');
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
                svgimg2.setAttribute('height','250');
                svgimg2.setAttribute('width','250');
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
                text.setAttribute('y','115');
                text2.setAttribute('y','160');
                text3.setAttribute('y','190');
            });
        }

        return g;
    }

    // TRANSLATION ===============================================================================

    move(box:IBox, graphic: any): any {
        graphic.setAttribute("transform","translate("+(box.getX()+2)+", "+
            (box.getY()+1+Math.round(box.getSpace()/2))+")");
    }

    // TYPE ======================================================================================

    getType(): string {
        return "largePictureBox";
    }

    // DIMENSIONS ================================================================================

    getHeight(): number {
        return 437;
    }
    getWidth(): number {
        return 260;
    }

    // LOADING ===================================================================================

    requiresLoad(): boolean {
        return true;
    }
}