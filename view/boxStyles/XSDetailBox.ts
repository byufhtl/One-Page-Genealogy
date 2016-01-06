///<reference path="../IBoxRender.ts"/>
///<reference path="../../util/DateFormat.ts"/>
///<reference path="../../util/StringUtils.ts"/>
///<reference path="../IBoxData.ts"/>
/**
 * Created by renae on 6/5/15.
 */
class XSDetailBox extends IBoxData {
    render(box:IBox, rootElement): any {
        var g:Element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        if(rootElement) {
            rootElement.appendChild(g);
        }
        var rect:Element = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        g.appendChild(rect);

        rect.setAttribute('width', String(this.getWidth()-1));
        rect.setAttribute('height', String(box.getHeight()-1-box.getSpace()));

        if(isNaN(box.getY())) {
            console.log(box);
        }

        //g.setAttribute("transform","translate("+box.getX()+", "+box.getY()+")");
        this.move(box,g);


        rect.setAttribute('rx', "5");
        rect.setAttribute('ry', "5");
        rect.setAttribute('stroke-width', '1');
        rect.setAttribute('stroke', 'black');


        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text);

        var node: INode = box.getNode();
        if(node.hasAttr('name')) {
            var nameTextPath = document.createTextNode(box.getNode().getAttr('name'));
            text.appendChild(nameTextPath);
            text.setAttribute("x", "10");
            text.setAttribute("y", "8");
            text.setAttribute("font-size", "9px");
            text.setAttribute("style", this.getFont() );
//            StringUtils.centerElement(text, 0, 160);
            StringUtils.fitName(text,node.getAttr('name'),19);

        }

        //StringUtils.fitName(text,node.getAttr('name'),20);
        
        var text3 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text3);
        var nameTextPath = document.createTextNode("");
        text3.appendChild(nameTextPath);
        text3.setAttribute("x", "110");
        text3.setAttribute("y", "8");
        text3.setAttribute("font-size", "8px");
        text3.setAttribute("style", this.getFont() );
        StringUtils.fitDate(text3, node.getAttr('birthdate'), node.getAttr('deathdate'), 12);
//        StringUtils.centerElement(text3, 0, 160);

        var text4 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text4);
        var nameTextPath = document.createTextNode("");
        text4.appendChild(nameTextPath);
        text4.setAttribute("x", "10");
        text4.setAttribute("y", "17");
        text4.setAttribute("font-size", "8px");
        text4.setAttribute("style", this.getFont() );
//        StringUtils.centerElement(text4, 0, 190);
        StringUtils.fit2Places(text4, node.getAttr('birthplace'),node.getAttr('deathplace'), 38);

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

        return g;
    }
    move(box:IBox, graphic: any): any {
        //graphic.setAttribute("transform","translate("+(box.getX()+1)+", "+(box.getY()+2)+")");
        graphic.setAttribute("transform","translate("+(box.getX()+1)+", "+
            (box.getY()+1/2+Math.round(box.getSpace()/2))+")");
    }
    getType(): string {
        return "xsDetailBox";
    }
    getHeight(): number {
        return 19+1;
    }
    getWidth(): number {
        return 162;
    }
    requiresLoad(): boolean {
        return false;
    }
}