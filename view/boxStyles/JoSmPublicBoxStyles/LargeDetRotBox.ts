///<reference path="../../IBoxRender.ts"/>
///<reference path="../../../util/StringUtils.ts"/>
///<reference path="../../IBoxData.ts"/>
///<reference path="../../ColorManager.ts"/>
/**
 * Created by renae on 10/2/15.
 */
class JSLargeDetRotPubBox extends IBoxData {
    render(box:IBox, rootElement): any {
        var g:Element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        var gt:Element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        if(rootElement) {
            rootElement.appendChild(g);
        }
        var rect:Element = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        g.appendChild(rect);
        //g.appendChild(gt);

        rect.setAttribute('width', String(this.getWidth()-4));
        rect.setAttribute('height', String(box.getHeight()-2-box.getSpace()));

        if(isNaN(box.getY())) {
            console.log(box);
        }

        g.setAttribute("transform","translate("+box.getX()+", "+box.getY()+")");


        rect.setAttribute('rx', "30");
        rect.setAttribute('ry', "30");
        rect.setAttribute('stroke-width', '5');

        rect.setAttribute('stroke','black');

        var rect2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect2.setAttribute('rx','15');
        rect2.setAttribute('ry','15');
        rect2.setAttribute('stroke-width','15');
        rect2.setAttribute('stroke',ColorManager.yellow());
        rect2.setAttribute('width', String(this.getWidth()-33));
        rect2.setAttribute('height', String(box.getHeight()-30-box.getSpace()));
        //rect2.setAttribute('height', String(box.getHeight()-10));
        g.appendChild(rect2);
        rect2.setAttribute('x','15');
        rect2.setAttribute('y','14');
        rect2.setAttribute('fill-opacity','.001');

        g.appendChild(gt);


        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        var text2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        gt.appendChild(text);
        gt.appendChild(text2);
        var node = box.getNode();

        var nameTextpath = document.createTextNode("");
        var nameString = "";

        if(node.hasAttr('name')) {
            nameString = box.getNode().getAttr('name');
            nameTextPath = document.createTextNode(nameString);
        }else if (node.hasAttr('givenname') && node.hasAttr('surname')) {
            nameString = box.getNode().getAttr('givenname') + " " + box.getNode().getAttr('surname');
            nameTextpath = document.createTextNode(nameString);
        }
        text.appendChild(nameTextPath);
        text.setAttribute('font-size', '40px');
        text.setAttribute("style", this.getFont() );
        StringUtils.fitName(text, nameString, 19);
        StringUtils.centerElement(text, 65, 300);
        text.setAttribute('y','70');
        text.setAttribute("font-weight", "bold");

        var text3 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        gt.appendChild(text3);
        var nameTextPath = document.createTextNode("");
        text3.appendChild(nameTextPath);
        text3.setAttribute("x", "25");
        text3.setAttribute("y", "105");
        text3.setAttribute("font-size", "20px");
        text3.setAttribute("style", this.getFont());

        StringUtils.fitDatePlace2(text3,node.getAttr('birthdate'),node.getAttr('birthplace'),41);
        //StringUtils.fitDate(text3, node.getAttr('birthdate'), node.getAttr('deathdate'), 290);
        //StringUtils.centerElement(text3, 210, 290);
        StringUtils.centerElement(text3, 65, 300);

        var text4 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        gt.appendChild(text4);
        var nameTextPath = document.createTextNode("");
        text4.appendChild(nameTextPath);
        text4.setAttribute("x", "25");
        text4.setAttribute("y", "135");
        text4.setAttribute("font-size", "20px");
        text4.setAttribute("style", this.getFont() );
        //StringUtils.centerElement(text4, 210, 290);
        StringUtils.fitDatePlace2(text4,node.getAttr('deathdate'),node.getAttr('deathplace'),45);
        //StringUtils.fitPlace(text4, node.getAttr('birthplace'), 25);
        //text4.textContent = 'B: '+text4.textContent;
        StringUtils.centerElement(text4, 65, 300);


        var gender = 'none';
        if(node.hasAttr('gender')) {
            gender = node.getAttr('gender');
        }
        if(box.getColor()!= null){
            rect.setAttribute('fill', 'white');
            rect2.setAttribute('stroke',box.getColor());
            rect2.setAttribute('fill',box.getColor());
        }
        else if(gender === 'Male') {
            rect.setAttribute('fill',ColorManager.blue());

        }
        else if(gender === 'Female') {
            rect.setAttribute('fill',ColorManager.pink());
        }
        else {
            rect.setAttribute('fill',ColorManager.lightgray());
        }

        gt.setAttribute("transform","translate(0, "+ (this.getHeight()-2)+") rotate(-90 0,0)");

        return g;
    }
    move(box:IBox, graphic: any): any {
        //graphic.setAttribute("transform","translate("+(box.getX()+2)+", "+(box.getY()+4)+")");
        graphic.setAttribute("transform","translate("+(box.getX()+2)+", "+
            (box.getY()+1+Math.round(box.getSpace()/2))+")");
    }
    getType(): string {
        return "JSLargeDetRotPubBox";
    }
    getHeight(): number {
        return 440;
    }
    getWidth(): number {
        return 169+2+3;//214;
    }
    requiresLoad(): boolean {
        return false;
    }
}