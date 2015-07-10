///<reference path="../IBoxRender.ts"/>
/**
 * Created by phobos2390 on 3/18/15.
 */
class HorizontalNameLifeBox implements IBoxRender {
    render(box:IBox, rootElement): any {
        var g:Element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        var rect:Element = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        g.appendChild(rect);

        rect.setAttribute('width', String(this.getWidth()));
        rect.setAttribute('height', String(this.getHeight()));

        if(isNaN(box.getY())) {
            console.log(box);
        }

        g.setAttribute("transform","translate("+box.getX()+", "+box.getY()+")");


        rect.setAttribute('rx', "5");
        rect.setAttribute('ry', "5");
        rect.setAttribute('stroke-width', '2');
        rect.setAttribute('stroke', 'black');


        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text);

        var node: INode = box.getNode();
        if(node.hasAttr('name')) {
            var nameTextPath = document.createTextNode(box.getNode().getAttr('name'));
            text.appendChild(nameTextPath);
            text.setAttribute("x", "5");
            text.setAttribute("y", "15");
        }

        var text2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text2);
        if(node.hasAttr('lifespan')) {
            var nameTextPath = document.createTextNode(box.getNode().getAttr('lifespan'));
            text2.appendChild(nameTextPath);
            text2.setAttribute("x", "205");
            text2.setAttribute("y", "15");
        }

        var gender = 'none';
        var grayScale = box.isGray();
        if(node.hasAttr('gender')) {
            gender = node.getAttr('gender');
        }
        if(gender === 'Male' && !grayScale) {
            rect.setAttribute('fill','#8DEEEE');
        }
        else if(gender === 'Female' && !grayScale) {
            rect.setAttribute('fill','#FFD1DC');
        }
        else {
            rect.setAttribute('fill','#E5E5E5');
        }

        return g;
    }
    move(box:IBox, graphic: any): any {
        graphic.setAttribute("transform","translate("+box.getX()+", "+box.getY()+")");
    }
    getType(): string {
        return "horizontalNameLifeBox";
    }
    getHeight(): number {
        return 20;
    }
    getWidth(): number {
        return 400;
    }
    requiresLoad(): boolean {
        return false;
    }
}