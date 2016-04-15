///<reference path="../../model/IBox.ts"/>
///<reference path="../ColorManager.ts"/>
///<reference path="../../util/StringUtils.ts"/>
/**
 * Created by calvinmcm on 4/14/16.
 */

class Renderer{

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[]||[]>
//[o]=[o]==[o]=[o]=[o]=[o][o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o][]||[]>
//==================================================================== RENDER PRIMARY FUNCTIONS =================================================[]()[]>
//[o]=[o]==[o]=[o]=[o]=[o][o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o][]||[]>
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[]||[]>

    static renderBox(box :IBox, rootElement :Element) :Element{
        // Basically, You just need to get the box's dimensions and then run with the RIS information.

        //~~~ NEUTERED SETUP (MANDATORY - REQUIRED ON ALL RIS CONFIGURATIONS) ~~~

        var g:Element = document.createElementNS("http://www.w3.org/2000/svg", "g"); // The overall element
        var gt :Element = document.createElementNS("http://www.w3.org/2000/svg", "g"); // The text container element

        var ris = box.getRenderInstructions();
        var big_font = ris.getInstruction(RenderInstructionSchedule.DEF_FONT_SIZE);
        var small_font = ris.getInstruction(RenderInstructionSchedule.ALT_FONT_SIZE);

        if(rootElement) {
            rootElement.appendChild(g);
        }

        //if(!ris || !ris.getInstruction(RenderInstructionSchedule.NAME_X) || !ris.getInstruction(RenderInstructionSchedule.NAME_Y)){
        //    box.setCollapsed(true);
        //}

        if(box.isCollapsed()){
            return null;
        }

        var rect:Element = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        g.appendChild(rect);
        var node = box.getNode();
        gt.setAttribute("style","font-family: 'Roboto Slab' ");

        rect.setAttribute('width', String(box.getWidth()));
        rect.setAttribute('height', String(box.getHeight()-8-box.getSpace()));

        var edge_curve = (box.getWidth()/20).toString();

        rect.setAttribute('rx', edge_curve);
        rect.setAttribute('ry', edge_curve);

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
            text_color = "#000000";
        }

        g.appendChild(gt);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]
        //==================================== MAIN PERSON INFORMATION =================================================
        //[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //~~~ NAME SETUP (NAME_X,NAME_Y,DEF_FONT_SIZE,ROTATED) ~~~

        console.log("\t@NAME_SETUP: " + node.getAttr('name') + ris.toString());
        var name_x = ris.getInstruction(RenderInstructionSchedule.NAME_X);
        var name_y = ris.getInstruction(RenderInstructionSchedule.NAME_Y);
        console.log(name_x,name_y);
        var name = node.getAttr('name');
        if(name_x && name_y && name){ // Check for non-null result
            var rotated = ris.getInstruction(RenderInstructionSchedule.ROTATED);
            var allowed = ris.getInstruction(RenderInstructionSchedule.NAME_L);
            console.log(name_x,name_y,rotated,allowed);
            gt.appendChild(Renderer.renderName(name, name_x, name_y, big_font, text_color, allowed, <boolean>rotated, node.isMainPerson()));
        }


        var allowed_d = ris.getInstruction(RenderInstructionSchedule.DATE_L);
        var allowed_p = ris.getInstruction(RenderInstructionSchedule.PLACE_L);

        //~~~ BIRTH DATE SETUP (B_DATE_X, B_DATE_Y, DEF_FONT_SIZE, ROTATED) ~~~

        var b_date_x = ris.getInstruction(RenderInstructionSchedule.B_DATE_X);
        var b_date_y = ris.getInstruction(RenderInstructionSchedule.B_DATE_Y);
        var b_date = node.getAttr('birthdate');
        if(b_date_x && b_date_y && b_date){ // Check for non-null result
            var rotated = ris.getInstruction(RenderInstructionSchedule.ROTATED);
            gt.appendChild(Renderer.renderDate(b_date, b_date_x, b_date_y, small_font, text_color, allowed_d, <boolean>rotated));
        }

        //~~~ BIRTH PLACE SETUP (B_PLACE_X, B_PLACE_Y, DEF_FONT_SIZE, ROTATED) ~~~

        var b_place_x = ris.getInstruction(RenderInstructionSchedule.B_PLACE_X);
        var b_place_y = ris.getInstruction(RenderInstructionSchedule.B_PLACE_Y);
        var b_place = node.getAttr('birthplace');
        if(b_place_x && b_place_y && b_place){ // Check for non-null result
            var rotated = ris.getInstruction(RenderInstructionSchedule.ROTATED);
            gt.appendChild(Renderer.renderPlace(b_place, b_place_x, b_place_y, small_font, text_color, allowed_p, <boolean>rotated));
        }

        //~~~ DEATH DATE SETUP (D_DATE_X, D_DATE_Y, DEF_FONT_SIZE, ROTATED) ~~~

        var d_date_x = ris.getInstruction(RenderInstructionSchedule.D_DATE_X);
        var d_date_y = ris.getInstruction(RenderInstructionSchedule.D_DATE_Y);
        var d_date = node.getAttr('deathdate');
        if(d_date_x && d_date_y && d_date){ // Check for non-null result
            var rotated = ris.getInstruction(RenderInstructionSchedule.ROTATED);
            gt.appendChild(Renderer.renderDate(d_date, d_date_x, d_date_y, small_font, text_color, allowed_d, <boolean>rotated));
        }

        //~~~ DEATH PLACE SETUP (D_PLACE_X, D_PLACE_Y, DEF_FONT_SIZE, ROTATED) ~~~

        var d_place_x = ris.getInstruction(RenderInstructionSchedule.D_PLACE_X);
        var d_place_y = ris.getInstruction(RenderInstructionSchedule.D_PLACE_Y);
        var d_place = node.getAttr('deathplace');
        if(d_place_x && d_place_y && d_place){ // Check for non-null result
            var rotated = ris.getInstruction(RenderInstructionSchedule.ROTATED);
            gt.appendChild(Renderer.renderPlace(d_place, d_place_x, d_place_y, small_font, text_color, allowed_p, <boolean>rotated));
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]
        //==================================== SPOUSE INFORMATION ======================================================
        //[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        var s_node = node.getDisplaySpouse();
        if(s_node) {

            //~~~ NAME SETUP (NAME_X,NAME_Y,DEF_FONT_SIZE,ROTATED) ~~~

            var s_name_x = ris.getInstruction(RenderInstructionSchedule.S_NAME_X);
            var s_name_y = ris.getInstruction(RenderInstructionSchedule.S_NAME_Y);
            var s_name = s_node.getAttr('name');
            if (s_name_x && s_name_y && s_name) { // Check for non-null result


                //~~~ NAME SETUP (NAME_X,NAME_Y,DEF_FONT_SIZE,ROTATED) ~~~

                var rotated = ris.getInstruction(RenderInstructionSchedule.ROTATED);
                var allowed = ris.getInstruction(RenderInstructionSchedule.NAME_L);
                gt.appendChild(Renderer.renderName(s_name, s_name_x, s_name_y, big_font, text_color, allowed, <boolean>rotated, s_node.isMainPerson()));


                //~~~ BIRTH DATE SETUP (B_DATE_X, B_DATE_Y, DEF_FONT_SIZE, ROTATED) ~~~

                var s_b_date_x = ris.getInstruction(RenderInstructionSchedule.S_B_DATE_X);
                var s_b_date_y = ris.getInstruction(RenderInstructionSchedule.S_B_DATE_Y);
                var s_b_date = s_node.getAttr('birthdate');
                if (s_b_date_x && s_b_date_y && s_b_date) { // Check for non-null result
                    var rotated = ris.getInstruction(RenderInstructionSchedule.ROTATED);
                    gt.appendChild(Renderer.renderDate(s_b_date, s_b_date_x, s_b_date_y, small_font, text_color, allowed_d, <boolean>rotated));
                }

                //~~~ BIRTH PLACE SETUP (B_PLACE_X, B_PLACE_Y, DEF_FONT_SIZE, ROTATED) ~~~

                var s_b_place_x = ris.getInstruction(RenderInstructionSchedule.S_B_PLACE_X);
                var s_b_place_y = ris.getInstruction(RenderInstructionSchedule.S_B_PLACE_Y);
                var s_b_place = s_node.getAttr('birthplace');
                if (s_b_place_x && s_b_place_y && s_b_place) { // Check for non-null result
                    var rotated = ris.getInstruction(RenderInstructionSchedule.ROTATED);
                    gt.appendChild(Renderer.renderPlace(s_b_place, s_b_place_x, s_b_place_y, small_font, text_color, allowed_p, <boolean>rotated));
                }

                //~~~ DEATH DATE SETUP (D_DATE_X, D_DATE_Y, DEF_FONT_SIZE, ROTATED) ~~~

                var s_d_date_x = ris.getInstruction(RenderInstructionSchedule.S_D_DATE_X);
                var s_d_date_y = ris.getInstruction(RenderInstructionSchedule.S_D_DATE_Y);
                var s_d_date = s_node.getAttr('deathdate');
                if (s_d_date_x && s_d_date_y && s_d_date) { // Check for non-null result
                    var rotated = ris.getInstruction(RenderInstructionSchedule.ROTATED);
                    gt.appendChild(Renderer.renderDate(s_d_date, s_d_date_x, s_d_date_y, small_font, text_color, allowed_d, <boolean>rotated));
                }

                //~~~ DEATH PLACE SETUP (D_PLACE_X, D_PLACE_Y, DEF_FONT_SIZE, ROTATED) ~~~

                var s_d_place_x = ris.getInstruction(RenderInstructionSchedule.S_D_PLACE_X);
                var s_d_place_y = ris.getInstruction(RenderInstructionSchedule.S_D_PLACE_Y);
                var s_d_place = s_node.getAttr('deathplace');
                if (s_d_place_x && s_d_place_y && s_d_place) { // Check for non-null result
                    var rotated = ris.getInstruction(RenderInstructionSchedule.ROTATED);
                    gt.appendChild(Renderer.renderPlace(s_d_place, s_d_place_x, s_d_place_y, small_font, text_color, allowed_p, <boolean>rotated));
                }
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
        var m_date = node.getAttr('marriagedate');
        if(m_date_x && m_date_y && m_date){ // Check for non-null result
            var rotated = ris.getInstruction(RenderInstructionSchedule.ROTATED);
            gt.appendChild(Renderer.renderDate(m_date, m_date_x, m_date_y, small_font, text_color, allowed_d, <boolean>rotated));
        }

        //~~~ MARRIAGE PLACE SETUP (M_PLACE_X, M_PLACE_Y, DEF_FONT_SIZE, ROTATED) ~~~

        var m_place_x = ris.getInstruction(RenderInstructionSchedule.M_PLACE_X);
        var m_place_y = ris.getInstruction(RenderInstructionSchedule.M_PLACE_Y);
        var m_place = node.getAttr('marriageplace');
        if(m_place_x && m_place_y && m_place){ // Check for non-null result
            var rotated = ris.getInstruction(RenderInstructionSchedule.ROTATED);
            gt.appendChild(Renderer.renderPlace(m_place, m_place_x, m_place_y, small_font, text_color, allowed_p, <boolean>rotated));
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]
        //==================================== ROTATION ================================================================
        //[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        var rotated = ris.getInstruction(RenderInstructionSchedule.ROTATED);
        if(rotated){
            gt.setAttribute("transform","translate(0, "+ (box.getHeight()-2)+") rotate(-90 0,0)");
        }

        return g;
    }

    static move(box :IBox, graphic :Element, root :Element) :void{
        if(graphic && box) {
            graphic.setAttribute("transform", "translate(" + (box.getX() + 2) + ", " +
                (box.getY() + 1 + Math.round(box.getSpace() / 2)) + ")");
        }
    }

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[]||[]>
//[o]=[o]==[o]=[o]=[o]=[o][o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o][]||[]>
//==================================================================== RENDER SUB-FUNCTIONS =====================================================[]()[]>
//[o]=[o]==[o]=[o]=[o]=[o][o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o][]||[]>
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[]||[]>

    private static renderName(name :string, x :number, y :number, font_size :number, font_color :string, allowed_len :number, rotated :boolean, bold :boolean) :Element{
        if(name && name != '') {
            var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            var nameTextPath = document.createTextNode(name);
            text.appendChild(nameTextPath);
            text.setAttribute("x", x.toString());
            text.setAttribute("y", y.toString());
            text.setAttribute("font-size", font_size.toString());
            text.setAttribute("fill", font_color);
            if (bold) {
                text.setAttribute("font-weight", "bold");
            }
            StringUtils.fitName(text, name, allowed_len);

            return text;
        }
    }


    private static renderDate(date :string, x :number, y :number, font_size :number, font_color :string, allowed_len :number, rotated :boolean) :Element{
        if(date && date != '') {
            var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            var dateTextPath = document.createTextNode("");
            text.appendChild(dateTextPath);
            text.setAttribute("x", x.toString());
            text.setAttribute("y", y.toString());
            text.setAttribute("font-size", font_size.toString());
            text.setAttribute("fill", font_color);

            StringUtils.fitDatePlace(text, date, "", allowed_len);

            return text;
        }
    }


    private static renderPlace(place :string, x :number, y :number, font_size :number, font_color :string, allowed_len :number, rotated :boolean) :Element{
        if(place && place != '') {
            var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            var dateTextPath = document.createTextNode("");
            text.appendChild(dateTextPath);
            text.setAttribute("x", x.toString());
            text.setAttribute("y", y.toString());
            text.setAttribute("font-size", font_size.toString());
            text.setAttribute("fill", font_color);

            StringUtils.fitPlaceJS(text, place, allowed_len);

            return text;
        }
    }
}