///<reference path="../IBoxRender.ts"/>
///<reference path="../../util/DateFormat.ts"/>
///<reference path="../../util/StringUtils.ts"/>
///<reference path="../IBoxData.ts"/>
/**
 * Created by renae on 6/4/15.
 */
class SmallestNameBox extends IBoxData {
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

        rect.setAttribute('width', String(this.getWidth()-1));
        rect.setAttribute('height', String(box.getHeight()-1-box.getSpace()));

        if(isNaN(box.getY())) {
            console.log(box);
        }

        this.move(box,g);

        rect.setAttribute('rx', "5");
        rect.setAttribute('ry', "5");
        rect.setAttribute('stroke-width', '1');
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
            rect.setAttribute('fill','#8DEEEE'); // Baby Blue
        }
        else if(gender === 'Female') {
            rect.setAttribute('fill','#FFD1DC'); // Baby Pink
        }
        else {
            rect.setAttribute('fill','#E5E5E5'); // Ambiguous Grey
        }

        // TEXT CONFIG ===========================================================================

        // Name
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text);
        if(node.hasAttr('name')) {
            var nameTextPath = document.createTextNode(box.getNode().getAttr('name'));
            text.appendChild(nameTextPath);
            text.setAttribute("x", "5");
            text.setAttribute("y", "7");
            text.setAttribute("font-size", "8px");
            text.setAttribute("fill", box.getTextColor());
            text.setAttribute("style", this.getFont() );
            StringUtils.fitName(text,node.getAttr('name'),15);
        }

        // Dates
        var text3 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text3);
        var nameTextPath = document.createTextNode("");
        text3.appendChild(nameTextPath);
        text3.setAttribute("x", "85");
        text3.setAttribute("y", "7");
        text3.setAttribute("font-size", "8px");
        text3.setAttribute("fill", box.getTextColor());
        text3.setAttribute("style", this.getFont() );
        StringUtils.fitDate(text3, node.getAttr('birthdate'), node.getAttr('deathdate'), 12);

        return g;
    }

    // TRANSLATION ===============================================================================
    move(box:IBox, graphic: any): any {
        graphic.setAttribute("transform","translate("+(box.getX()+1)+", "+
            (box.getY()+1/2+Math.round(box.getSpace()/2))+")");
    }

    // TYPE ======================================================================================
    getType(): string {
        return "smallestNameBox";
    }

    // DIMENSIONS ================================================================================
    getHeight(): number {
        return 10;
    }
    getWidth(): number {
        return 142;
    }

    // LOADING ===================================================================================
    requiresLoad(): boolean {
        return false;
    }
}