///<reference path="../IBoxRender.ts"/>
///<reference path="../../util/DateFormat.ts"/>
///<reference path="../../util/StringUtils.ts"/>
/**
 * Created by renae on 6/4/15.
 */
class SmallestNameBox implements IBoxRender {
    render(box:IBox, rootElement): any {
        var g:Element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        if(rootElement) {
            rootElement.appendChild(g);
        }
        var rect:Element = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        g.appendChild(rect);

        rect.setAttribute('width', String(this.getWidth()-1));//-stroke width
        //box.setSpace(.5);
        rect.setAttribute('height', String(box.getHeight()-1-box.getSpace()));//-stroke width-spsz

        if(isNaN(box.getY())) {
            console.log(box);
        }

        //g.setAttribute("transform","translate("+box.getX()+", "+box.getY()+")");
        this.move(box,g);


        rect.setAttribute('rx', "5");
        rect.setAttribute('ry', "5");
        rect.setAttribute('stroke-width', '1');


        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text);

        var node: INode = box.getNode();
        if(node.hasAttr('name')) {
            var nameTextPath = document.createTextNode(box.getNode().getAttr('name'));
            text.appendChild(nameTextPath);
            text.setAttribute("x", "5");
            text.setAttribute("y", "7");
            text.setAttribute("font-size", "9px");
            text.setAttribute("style", "font-family:tahoma, sans-serif");
 //           StringUtils.centerElement(text, 0, 140);
            StringUtils.fitName(text,node.getAttr('name'),15);
        }

        var text3 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text3);
        var nameTextPath = document.createTextNode("");
        text3.appendChild(nameTextPath);
        text3.setAttribute("x", "85");
        text3.setAttribute("y", "7");
        text3.setAttribute("font-size", "9px");
        text3.setAttribute("style", "font-family:tahoma, sans-serif");
        StringUtils.fitDate(text3, node.getAttr('birthdate'), node.getAttr('deathdate'), 12);

        var gender = 'none';
        var grayScale = box.isGray();
        if(node.hasAttr('gender')) {
            gender = node.getAttr('gender');
        }
        if(box.getColor()!= null && !grayScale){
            rect.setAttribute('fill', box.getColor());
            rect.setAttribute('stroke','black');
        }
        else if(gender === 'Male' && !grayScale) {
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

        return g;
    }
    move(box:IBox, graphic: any): any {
        //console.log(box.getY()+1/2+Math.round(box.getSpace()/2))
        graphic.setAttribute("transform","translate("+(box.getX()+1)+", "+
            (box.getY()+1/2+Math.round(box.getSpace()/2))+")");//+stroke width+1/2space size
    }
    getType(): string {
        return "smallestNameBox";
    }
    getHeight(): number {
        return 9 +1;//9+stroke size+space size
    }
    getWidth(): number {
        return 142;
    }
    requiresLoad(): boolean {
        return false;
    }
}