///<reference path="../IBoxRender.ts"/>
/**
 * Created by curtis on 3/10/15.
 */
class BasicSVGBox implements IBoxRender {
    render(box:IBox): any {
        var g:Element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        var rect:Element = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        g.appendChild(rect);

        rect.setAttribute('width', '100');
        rect.setAttribute('height', '30');

        if(isNaN(box.getY())) {
            console.log(box);
        }

        g.setAttribute("transform","translate("+box.getX()+", "+box.getY()+")");


        rect.setAttribute('rx', "5");
        rect.setAttribute('ry', "5");
        rect.setAttribute('stroke-width', '2');
        rect.setAttribute('stroke', 'black');
        rect.setAttribute('fill','cyan');

        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text);

        var nameTextPath = document.createTextNode(box.getNode().getId());
        text.appendChild(nameTextPath);
        text.setAttribute("x", "5");
        text.setAttribute("y", "15");


        return g;
    }
    getType(): string {
        return "basic";
    }
    getHeight(): number {
        return 30;
    }
    getWidth(): number {
        return 100;
    }
}