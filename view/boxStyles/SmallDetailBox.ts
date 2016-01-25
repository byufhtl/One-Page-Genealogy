///<reference path="../IBoxRender.ts"/>
///<reference path="../../util/DateFormat.ts"/>
///<reference path="../../util/StringUtils.ts"/>
///<reference path="../IBoxData.ts"/>
/**
 * Created by renae on 6/5/15.
 */
class SmallDetailBox extends IBoxData {

    render(box:IBox, rootElement): any {

        // GRAPHICS/SETUP ========================================================================


        var g:Element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        if(rootElement) {
            rootElement.appendChild(g);
        }
        var rect:Element = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        g.appendChild(rect);
        var node: INode = box.getNode();

        // BOX CONFIG ============================================================================

        rect.setAttribute('width', String(this.getWidth()-4));
        rect.setAttribute('height', String(box.getHeight()-2-box.getSpace()));

        if(isNaN(box.getY())) {
            console.log(box);
        }

        this.move(box, g);

        rect.setAttribute('rx', "10");
        rect.setAttribute('ry', "10");
        rect.setAttribute('stroke-width', '2');
        rect.setAttribute('stroke', 'black');

        // Color Schemes
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


        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text);

        // Name
        if(node.hasAttr('name')) {
            var nameTextPath = document.createTextNode(box.getNode().getAttr('name'));
            text.appendChild(nameTextPath);
            text.setAttribute("x", "10");
            text.setAttribute("y", "11");
            text.setAttribute("font-size", "12px");
            text.setAttribute("style", this.getFont() );
            StringUtils.fitName(text,node.getAttr('name'),20);
        }

        // Date
        var text3 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text3);
        var nameTextPath = document.createTextNode("");
        text3.appendChild(nameTextPath);
        text3.setAttribute("x", "140");
        text3.setAttribute("y", "10");
        text3.setAttribute("font-size", "8px");
        text3.setAttribute("style", this.getFont() );
        StringUtils.fitDate(text3, node.getAttr('birthdate'), node.getAttr('deathdate'), 12);

        // Birth Place
        var text4 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text4);
        var nameTextPath = document.createTextNode("");
        text4.appendChild(nameTextPath);
        text4.setAttribute("x", "10");
        text4.setAttribute("y", "20");
        text4.setAttribute("font-size", "8px");
        text4.setAttribute("style", this.getFont() );
        StringUtils.fitPlace(text4, node.getAttr('birthplace'), 40);
        text4.textContent = 'B: '+text4.textContent;

        // Death Place
        var text5 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text5);
        var nameTextPath = document.createTextNode("");
        text5.appendChild(nameTextPath);
        text5.setAttribute("x", "10");
        text5.setAttribute("y", "29");
        text5.setAttribute("font-size", "8px");
        text5.setAttribute("style", this.getFont() );
        StringUtils.fitPlace(text5, node.getAttr('deathplace'), 40);
        text5.textContent = 'D: '+text5.textContent;

        return g;
    }

    // TRANSLATION ===============================================================================

    move(box:IBox, graphic: any): any {
        graphic.setAttribute("transform","translate("+(box.getX()+2)+", "+
            (box.getY()+1/2+Math.round(box.getSpace()/2))+")");
    }

    // TYPE ======================================================================================

    getType(): string {
        return "smallDetailBox";
    }

    // DIMENSIONS ================================================================================

    getHeight(): number {
        return 32+2;//37//35;
    }
    getWidth(): number {
        return 194;
    }

    // LOADING ===================================================================================

    requiresLoad(): boolean {
        return false;
    }
}