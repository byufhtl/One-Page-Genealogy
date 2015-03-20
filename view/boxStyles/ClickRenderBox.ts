///<reference path="../IBoxRender.ts"/>
/**
 * Created by curtis on 3/10/15.
 */
class ClickRenderBox implements IBoxRender {
    render(box:IBox): any {
        var g:Element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        var rect:Element = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        g.appendChild(rect);

        rect.setAttribute('width', '150');
        rect.setAttribute('height', '50');

        if(isNaN(box.getY())) {
            console.log(box);
        }

        g.setAttribute("transform","translate("+box.getX()+", "+box.getY()+")");


        rect.setAttribute('rx', "5");
        rect.setAttribute('ry', "5");
        rect.setAttribute('stroke-width', '2');
        rect.setAttribute('stroke', 'black');
        rect.setAttribute('fill','red');

        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text);

        var nameTextPath = document.createTextNode(box.getNode().getId());
        text.appendChild(nameTextPath);
        text.setAttribute("x", "5");
        text.setAttribute("y", "15");


        return g;
    }
    move(box:IBox, graphic: any): any {
        graphic.setAttribute("transform","translate("+box.getX()+", "+box.getY()+")");
    }

    getType(): string {
        return "clicked";
    }
    getHeight(): number {
        return 50;
    }
    getWidth(): number {
        return 150;
    }
}