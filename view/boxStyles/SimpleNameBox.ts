///<reference path="../IBoxRender.ts"/>
/**
 * Created by curtis on 3/16/15.
 */
class SimpleNameBox implements IBoxRender {
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
            text.setAttribute("style", "font-family:tahoma, sans-serif");
        }

        var text2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(text2);
        if(node.hasAttr('lifespan')) {
            var nameTextPath = document.createTextNode(box.getNode().getAttr('lifespan'));
            text2.appendChild(nameTextPath);
            text2.setAttribute("x", "5");
            text2.setAttribute("y", "35");
            text2.setAttribute("style", "font-family:tahoma, sans-serif");
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

        if(node.hasAttr('profilePicturePromise')) {
            var svgimg = document.createElementNS('http://www.w3.org/2000/svg','image');
            svgimg.setAttribute('height','50');
            svgimg.setAttribute('width','50');
            svgimg.setAttributeNS('http://www.w3.org/1999/xlink','href','images/loading.svg');
            svgimg.setAttribute('x','3');
            svgimg.setAttribute('y','6');
            g.appendChild(svgimg);
            node.getAttr('profilePicturePromise').then(function(response) {
                if(!response) {
                    g.removeChild(svgimg);
                    return;
                }
                var svgimg2 = document.createElementNS('http://www.w3.org/2000/svg','image');
                svgimg2.setAttribute('height','50');
                svgimg2.setAttribute('width','50');
                svgimg2.setAttribute('x','3');
                svgimg2.setAttribute('y','6');

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
        return "simpleNameBox";
    }
    getHeight(): number {
        return 50;
    }
    getWidth(): number {
        return 200;
    }
    requiresLoad(): boolean {
        return true;
    }
}