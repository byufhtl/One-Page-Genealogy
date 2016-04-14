///<reference path="../../model/IBox.ts"/>
///<reference path="../ColorManager.ts"/>
/**
 * Created by calvinmcm on 4/14/16.
 */

class Renderer{

    static renderBox(box :IBox, rootElement :Element) :Element{
        // Basically, You just need to get the box's dimensions and then run with the RIS information.

        // NEUTERED SETUP (MANDATORY - REQUIRED ON ALL RIS CONFIGURATIONS)
        var g:Element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        if(rootElement) {
            rootElement.appendChild(g);
        }
        var rect:Element = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        g.appendChild(rect);
        var node = box.getNode();

        rect.setAttribute('width', String(box.getWidth()));
        rect.setAttribute('height', String(box.getHeight()-2-box.getSpace()));
        rect.setAttribute('rx', "40");
        rect.setAttribute('ry', "40");

        var ris = box.getRenderInstructions();

        var border = ris.getInstruction(RenderInstructionSchedule.BORDER_WIDTH);
        if(border){ // 0 or it has a dimension
            rect.setAttribute('fill',ColorManager.lighten(box.getColor(),32));

            var borderRect :Element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            borderRect.setAttribute('stroke-width',border);
            borderRect.setAttribute('stroke',box.getColor());
            borderRect.setAttribute('x','5');
            borderRect.setAttribute('y','5');
            borderRect.setAttribute('fill-opacity','.001');
            borderRect.setAttribute('width', String(box.getWidth()-border/2));
            borderRect.setAttribute('height', String(box.getHeight()-2-box.getSpace()-border/2));
            g.appendChild(borderRect);
        }
        else{
            rect.setAttribute('stroke-width', '6');
            rect.setAttribute('stroke', 'black');
            rect.setAttribute('fill',box.getColor());
        }



        return null;
    }

    static move(box :IBox, g :Element, root :Element) :void{}


}