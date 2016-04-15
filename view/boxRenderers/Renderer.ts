///<reference path="../../model/IBox.ts"/>
///<reference path="../ColorManager.ts"/>
///<reference path="../../util/StringUtils.ts"/>
/**
 * Created by calvinmcm on 4/14/16.
 */

class Renderer{

    static renderBox(box :IBox, rootElement :Element) :Element{
        // Basically, You just need to get the box's dimensions and then run with the RIS information.

        //~~~ NEUTERED SETUP (MANDATORY - REQUIRED ON ALL RIS CONFIGURATIONS) ~~~

        var g:Element = document.createElementNS("http://www.w3.org/2000/svg", "g"); // The overall element
        var gt :Element = document.createElementNS("http://www.w3.org/2000/svg", "g"); // The text container element

        if(rootElement) {
            rootElement.appendChild(g);
            g.appendChild(gt);
        }
        var rect:Element = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        g.appendChild(rect);
        var node = box.getNode();
        gt.setAttribute("style","font-family: 'Roboto Slab' ");

        rect.setAttribute('width', String(box.getWidth()));
        rect.setAttribute('height', String(box.getHeight()-2-box.getSpace()));

        var edge_curve = (box.getWidth()/20).toString();

        rect.setAttribute('rx', edge_curve);
        rect.setAttribute('ry', edge_curve);

        var ris = box.getRenderInstructions();
        var big_font = ris.getInstruction(RenderInstructionSchedule.DEF_FONT_SIZE);
        var small_font = ris.getInstruction(RenderInstructionSchedule.ALT_FONT_SIZE);

        //~~~ BORDERED BOX SETUP (BORDER_WIDTH) ~~~

        var border = ris.getInstruction(RenderInstructionSchedule.BORDER_WIDTH);
        border = (border != null)? border : 4;
        var color_border = ris.getInstruction(RenderInstructionSchedule.COLORED_BORDER);

        if(color_border){ // 0 or it has a dimension
            rect.setAttribute('fill',ColorManager.lighten(box.getColor(),32));
            rect.setAttribute('stroke-width',(color_border).toString());
            rect.setAttribute('stroke',box.getColor());
        }
        else{
            rect.setAttribute('stroke-width', border.toString());
            rect.setAttribute('stroke', 'black');
            rect.setAttribute('fill',box.getColor());
        }

        var text_color = ColorManager.intToString_hex(ris.getInstruction(RenderInstructionSchedule.TEXT_COLOR));
        if(!text_color){
            text_color = "#ffffff";
        }


        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]
        //==================================== MAIN PERSON INFORMATION =================================================
        //[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //~~~ NAME SETUP (NAME_X,NAME_Y,DEF_FONT_SIZE,ROTATED) ~~~

        var name_x = ris.getInstruction(RenderInstructionSchedule.NAME_X);
        var name_y = ris.getInstruction(RenderInstructionSchedule.NAME_Y);
        if(name_x && name_y){ // Check for non-null result
            var rotated = ris.getInstruction(RenderInstructionSchedule.ROTATED);
            var allowed = ris.getInstruction(RenderInstructionSchedule.NAME_L);
            Renderer.renderName(node.getAttr('name'), name_x, name_y, big_font, text_color, allowed, <boolean>rotated, node.isMainPerson(), gt);
        }


        var allowed_d = ris.getInstruction(RenderInstructionSchedule.DATE_L);
        var allowed_p = ris.getInstruction(RenderInstructionSchedule.PLACE_L);

        //~~~ BIRTH DATE SETUP (B_DATE_X, B_DATE_Y, DEF_FONT_SIZE, ROTATED) ~~~

        var b_date_x = ris.getInstruction(RenderInstructionSchedule.B_DATE_X);
        var b_date_y = ris.getInstruction(RenderInstructionSchedule.B_DATE_Y);
        if(b_date_x && b_date_y){ // Check for non-null result
            var rotated = ris.getInstruction(RenderInstructionSchedule.ROTATED);
            Renderer.renderDate(node.getAttr('birthdate'), b_date_x, b_date_y, small_font, text_color, allowed_d, <boolean>rotated, gt);
        }

        //~~~ BIRTH PLACE SETUP (B_PLACE_X, B_PLACE_Y, DEF_FONT_SIZE, ROTATED) ~~~

        var b_place_x = ris.getInstruction(RenderInstructionSchedule.B_PLACE_X);
        var b_place_y = ris.getInstruction(RenderInstructionSchedule.B_PLACE_Y);
        if(b_place_x && b_place_y){ // Check for non-null result
            var rotated = ris.getInstruction(RenderInstructionSchedule.ROTATED);
            Renderer.renderPlace(node.getAttr('birthplace'), b_place_x, b_place_y, small_font, text_color, allowed_p, <boolean>rotated, gt);
        }

        //~~~ DEATH DATE SETUP (D_DATE_X, D_DATE_Y, DEF_FONT_SIZE, ROTATED) ~~~

        var d_date_x = ris.getInstruction(RenderInstructionSchedule.D_DATE_X);
        var d_date_y = ris.getInstruction(RenderInstructionSchedule.D_DATE_Y);
        if(d_date_x && d_date_y){ // Check for non-null result
            var rotated = ris.getInstruction(RenderInstructionSchedule.ROTATED);
            Renderer.renderDate(node.getAttr('deathdate'), d_date_x, d_date_y, small_font, text_color, allowed_d, <boolean>rotated, gt);
        }

        //~~~ DEATH PLACE SETUP (D_PLACE_X, D_PLACE_Y, DEF_FONT_SIZE, ROTATED) ~~~

        var d_place_x = ris.getInstruction(RenderInstructionSchedule.D_PLACE_X);
        var d_place_y = ris.getInstruction(RenderInstructionSchedule.D_PLACE_Y);
        if(d_place_x && d_place_y){ // Check for non-null result
            var rotated = ris.getInstruction(RenderInstructionSchedule.ROTATED);
            Renderer.renderPlace(node.getAttr('deathplace'), d_place_x, d_place_y, small_font, text_color, allowed_p, <boolean>rotated, gt);
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]
        //==================================== SPOUSE INFORMATION ======================================================
        //[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //~~~ NAME SETUP (NAME_X,NAME_Y,DEF_FONT_SIZE,ROTATED) ~~~

        var s_name_x = ris.getInstruction(RenderInstructionSchedule.S_NAME_X);
        var s_name_y = ris.getInstruction(RenderInstructionSchedule.S_NAME_Y);
        if(s_name_x && s_name_y) { // Check for non-null result

            var s_node = node.getDisplaySpouse();

            //~~~ NAME SETUP (NAME_X,NAME_Y,DEF_FONT_SIZE,ROTATED) ~~~

            var rotated = ris.getInstruction(RenderInstructionSchedule.ROTATED);
            var allowed = ris.getInstruction(RenderInstructionSchedule.NAME_L);
            Renderer.renderName(s_node.getAttr('name'), s_name_x, s_name_y, big_font, text_color, allowed, <boolean>rotated, s_node.isMainPerson(), gt);


            //~~~ BIRTH DATE SETUP (B_DATE_X, B_DATE_Y, DEF_FONT_SIZE, ROTATED) ~~~

            var s_b_date_x = ris.getInstruction(RenderInstructionSchedule.S_B_DATE_X);
            var s_b_date_y = ris.getInstruction(RenderInstructionSchedule.S_B_DATE_Y);
            if (s_b_date_x && s_b_date_y) { // Check for non-null result
                var rotated = ris.getInstruction(RenderInstructionSchedule.ROTATED);
                Renderer.renderDate(s_node.getAttr('birthdate'), s_b_date_x, s_b_date_y, small_font, text_color, allowed_d, <boolean>rotated, gt);
            }

            //~~~ BIRTH PLACE SETUP (B_PLACE_X, B_PLACE_Y, DEF_FONT_SIZE, ROTATED) ~~~

            var s_b_place_x = ris.getInstruction(RenderInstructionSchedule.S_B_PLACE_X);
            var s_b_place_y = ris.getInstruction(RenderInstructionSchedule.S_B_PLACE_Y);
            if (s_b_place_x && s_b_place_y) { // Check for non-null result
                var rotated = ris.getInstruction(RenderInstructionSchedule.ROTATED);
                Renderer.renderPlace(s_node.getAttr('birthplace'), s_b_place_x, s_b_place_y, small_font, text_color, allowed_p, <boolean>rotated, gt);
            }

            //~~~ DEATH DATE SETUP (D_DATE_X, D_DATE_Y, DEF_FONT_SIZE, ROTATED) ~~~

            var s_d_date_x = ris.getInstruction(RenderInstructionSchedule.S_D_DATE_X);
            var s_d_date_y = ris.getInstruction(RenderInstructionSchedule.S_D_DATE_Y);
            if (s_d_date_x && s_d_date_y) { // Check for non-null result
                var rotated = ris.getInstruction(RenderInstructionSchedule.ROTATED);
                Renderer.renderDate(s_node.getAttr('deathdate'), s_d_date_x, s_d_date_y, small_font, text_color, allowed_d, <boolean>rotated, gt);
            }

            //~~~ DEATH PLACE SETUP (D_PLACE_X, D_PLACE_Y, DEF_FONT_SIZE, ROTATED) ~~~

            var s_d_place_x = ris.getInstruction(RenderInstructionSchedule.S_D_PLACE_X);
            var s_d_place_y = ris.getInstruction(RenderInstructionSchedule.S_D_PLACE_Y);
            if (s_d_place_x && s_d_place_y) { // Check for non-null result
                var rotated = ris.getInstruction(RenderInstructionSchedule.ROTATED);
                Renderer.renderPlace(s_node.getAttr('deathplace'), s_d_place_x, s_d_place_y, small_font, text_color, allowed_p, <boolean>rotated, gt);
            }
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]
        //==================================== MARRIAGE INFORMATION ====================================================
        //[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //~~~ MARRIAGE DATE SETUP (M_DATE_X, M_DATE_Y, DEF_FONT_SIZE, ROTATED) ~~~

        var m_date_x = ris.getInstruction(RenderInstructionSchedule.M_DATE_X);
        var m_date_y = ris.getInstruction(RenderInstructionSchedule.M_DATE_Y);
        if(m_date_x && m_date_y){ // Check for non-null result
            var rotated = ris.getInstruction(RenderInstructionSchedule.ROTATED);
            Renderer.renderDate(node.getAttr('marriagedate'), m_date_x, m_date_y, small_font, text_color, allowed_d, <boolean>rotated, gt);
        }

        //~~~ MARRIAGE PLACE SETUP (M_PLACE_X, M_PLACE_Y, DEF_FONT_SIZE, ROTATED) ~~~

        var m_place_x = ris.getInstruction(RenderInstructionSchedule.M_PLACE_X);
        var m_place_y = ris.getInstruction(RenderInstructionSchedule.M_PLACE_Y);
        if(m_place_x && m_place_y){ // Check for non-null result
            var rotated = ris.getInstruction(RenderInstructionSchedule.ROTATED);
            Renderer.renderPlace(node.getAttr('marriageplace'), m_place_x, m_place_y, small_font, text_color, allowed_p, <boolean>rotated, gt);
        }

        return g;
    }

    static move(box :IBox, graphic :Element, root :Element) :void{
        graphic.setAttribute("transform","translate("+(box.getX()+2)+", "+
            (box.getY()+1+Math.round(box.getSpace()/2))+")");
    }


    private static renderName(name :string, x :number, y :number, font_size :number, font_color :string, allowed_len :number, rotated :boolean, bold :boolean, gt :Element) :void{
        if(name && name != '') {
            var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            var nameTextPath = document.createTextNode(name);
            text.appendChild(nameTextPath);
            text.setAttribute("x", x.toString());
            text.setAttribute("y", y.toString());
            text.setAttribute("font-size", font_size.toString());
            text.setAttribute("fill", font_color);
            text.setAttribute("style", gt.getAttribute("Style"));
            if (bold) {
                text.setAttribute("font-weight", "bold");
            }
            StringUtils.fitName(text, name, allowed_len);

            gt.appendChild(text);
        }
    }


    private static renderDate(date :string, x :number, y :number, font_size :number, font_color :string, allowed_len :number, rotated :boolean, gt :Element) :void{
        if(date && date != '') {
            var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            var dateTextPath = document.createTextNode("");
            text.appendChild(dateTextPath);
            text.setAttribute("x", x.toString());
            text.setAttribute("y", y.toString());
            text.setAttribute("font-size", font_size.toString());
            text.setAttribute("fill", font_color);
            text.setAttribute("style", gt.getAttribute("Style"));

            StringUtils.fitDatePlace(text, date, "", allowed_len);

            gt.appendChild(text);
        }
    }


    private static renderPlace(place :string, x :number, y :number, font_size :number, font_color :string, allowed_len :number, rotated :boolean, gt :Element) :void{
        if(place && place != '') {
            var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            var dateTextPath = document.createTextNode("");
            text.appendChild(dateTextPath);
            text.setAttribute("x", x.toString());
            text.setAttribute("y", y.toString());
            text.setAttribute("font-size", font_size.toString());
            text.setAttribute("fill", font_color);
            text.setAttribute("style", gt.getAttribute("Style"));

            StringUtils.fitPlaceJS(text, place, allowed_len);

            gt.appendChild(text);
        }
    }
}