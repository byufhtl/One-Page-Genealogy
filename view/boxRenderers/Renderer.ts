///<reference path="../../model/IBox.ts"/>
///<reference path="../ColorManager.ts"/>
///<reference path="../../util/StringUtils.ts"/>
///<reference path="../PictureManager.ts"/>
///<reference path="StyleManager.ts"/>
/**
 * Created by calvinmcm on 4/14/16.
 * The Renderer handles box rendering for all box styles. The IBox passed in as the first parameter to renderBox() will
 * be processed for rendering and the created svg components will be appended as children to the root Element passed in
 * as the second parameter to said function.
 * Certain details such as the box's height, width, and color are stored directly on the box (See Abstract Box). Most of
 * the text and other element placing is controlled by the RIS(RenderInstructionSchedule) attached to the box. For exact
 * details, please review the functionality contained in the RIS.
 * Picture rendering is dependent upon the functionality of the PictureManager. The images will not be inserted until
 * the pictures have been duly loaded.
 * Several private helper functions are used to render common elements such as names, dates, places, and pictures.
 * This class has been generated as a static class, as there is no real need for instantiation, allowing for a more
 * streamlined call for rendering from anywhere within the OPG framework.
 */

class Renderer{

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[]||[]>
//[o]=[o]==[o]=[o]=[o]=[o][o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o][]||[]>
//==================================================================== RENDER PRIMARY FUNCTIONS =================================================[]()[]>
//[o]=[o]==[o]=[o]=[o]=[o][o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o]=[o][]||[]>
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[]||[]>

    /**
     * The main rendering function. Outline:
     *  1) Setup
     *      a) Create the containers (g & gt)
     *      b) Do preliminary error checking
     *  2) Generate the rectangles
     *      a) Generate the main rectangle
     *      b) If bordered, mute the first rectangle a bit and generate a second rectangle
     *  3) Render the first person
     *      a) picture
     *      b) name
     *      c) birth date/place
     *      d) death date/place
     *  4) Render the spouse
     *      a) picture (not yet implemented)
     *      b) name
     *      c) birth date/place
     *      d) death date/place
     *  5) Render the marriage date/place
     *  6) Rotation
     *
     * @param box the box whose svg representation is being created
     * @param rootElement the element that will ultimately need to contain that svg element set
     * @returns {Element} The element being created
     */
    static renderBox(box :IBox, rootElement :Element) :Element{

        //~~~ SETUP (MANDATORY - REQUIRED ON ALL RIS CONFIGURATIONS) ~~~

        var g:Element = document.createElementNS("http://www.w3.org/2000/svg", "g"); // The overall element
        var gt :Element = document.createElementNS("http://www.w3.org/2000/svg", "g"); // The text container element

        var ris = box.getRenderInstructions();
        var big_font = ris.getInstruction(RenderInstructionSchedule.DEF_FONT_SIZE);
        var small_font = ris.getInstruction(RenderInstructionSchedule.ALT_FONT_SIZE);

        if(rootElement) {
            rootElement.appendChild(g);
        }

        if(box.isCollapsed()){
            return null;
        }

        //~~~ RECTANGLE SETUP ~~~
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

        var text_color = box.getTextColor();
        if(!text_color){
            text_color = "#000000";
        }

        g.appendChild(gt);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]
        //==================================== MAIN PERSON INFORMATION =================================================
        //[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //~~~ PICTURE SETUP (PICTURE_X, PICTURE_Y, PICTURES_DIM_X, PICTURES_DIM_Y) ~~~

        var pic_x = ris.getInstruction(RenderInstructionSchedule.PICTURE_X);
        var pic_y = ris.getInstruction(RenderInstructionSchedule.PICTURE_Y);
        if(pic_x && pic_y) {
            var pic_loaded = Renderer.renderPicture(box, ris, pic_x, pic_y, node, g);
            if(pic_loaded){
                g.appendChild(pic_loaded);
            }
        }

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
        var b_date = 'B: ' + node.getAttr('birthdate');
        if(b_date_x && b_date_y && b_date){ // Check for non-null result
            var rotated = ris.getInstruction(RenderInstructionSchedule.ROTATED);
            gt.appendChild(Renderer.renderDate(b_date, b_date_x, b_date_y, small_font, text_color, allowed_d, <boolean>rotated));
        }

        //~~~ BIRTH PLACE SETUP (B_PLACE_X, B_PLACE_Y, DEF_FONT_SIZE, ROTATED) ~~~

        var b_place_x = ris.getInstruction(RenderInstructionSchedule.B_PLACE_X);
        var b_place_y = ris.getInstruction(RenderInstructionSchedule.B_PLACE_Y);
        var b_place = node.getAttr('birthplace');
        b_place = !(b_date_x && b_date_y && b_date) ? 'B: ' + b_place : b_place;
        if(b_place_x && b_place_y && b_place){ // Check for non-null result
            var rotated = ris.getInstruction(RenderInstructionSchedule.ROTATED);
            gt.appendChild(Renderer.renderPlace(b_place, b_place_x, b_place_y, small_font, text_color, allowed_p, <boolean>rotated));
        }

        //~~~ DEATH DATE SETUP (D_DATE_X, D_DATE_Y, DEF_FONT_SIZE, ROTATED) ~~~

        var d_date_x = ris.getInstruction(RenderInstructionSchedule.D_DATE_X);
        var d_date_y = ris.getInstruction(RenderInstructionSchedule.D_DATE_Y);
        var d_date = 'D: ' + node.getAttr('deathdate');
        if(d_date_x && d_date_y && d_date){ // Check for non-null result
            var rotated = ris.getInstruction(RenderInstructionSchedule.ROTATED);
            gt.appendChild(Renderer.renderDate(d_date, d_date_x, d_date_y, small_font, text_color, allowed_d, <boolean>rotated));
        }

        //~~~ DEATH PLACE SETUP (D_PLACE_X, D_PLACE_Y, DEF_FONT_SIZE, ROTATED) ~~~

        var d_place_x = ris.getInstruction(RenderInstructionSchedule.D_PLACE_X);
        var d_place_y = ris.getInstruction(RenderInstructionSchedule.D_PLACE_Y);
        var d_place = node.getAttr('deathplace');
        d_place = !(d_date_x && d_date_y && d_date) ? "D: " + d_place : d_place;
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

            //~~~ PICTURE SETUP (PICTURE_X, PICTURE_Y, PICTURES_DIM_X, PICTURES_DIM_Y) ~~~

            //~~~ NAME SETUP (S_NAME_X, S_NAME_Y, DEF_FONT_SIZE, ROTATED) ~~~

            var s_name_x = ris.getInstruction(RenderInstructionSchedule.S_NAME_X);
            var s_name_y = ris.getInstruction(RenderInstructionSchedule.S_NAME_Y);
            var s_name = s_node.getAttr('name');
            if (s_name_x && s_name_y && s_name) { // Check for non-null result


                //~~~ NAME SETUP (S_NAME_X, S_NAME_Y, DEF_FONT_SIZE, ROTATED) ~~~

                var rotated = ris.getInstruction(RenderInstructionSchedule.ROTATED);
                var allowed = ris.getInstruction(RenderInstructionSchedule.NAME_L);
                gt.appendChild(Renderer.renderName(s_name, s_name_x, s_name_y, big_font, text_color, allowed, <boolean>rotated, s_node.isMainPerson()));


                //~~~ BIRTH DATE SETUP (S_B_DATE_X, S_B_DATE_Y, DEF_FONT_SIZE, ROTATED) ~~~

                var s_b_date_x = ris.getInstruction(RenderInstructionSchedule.S_B_DATE_X);
                var s_b_date_y = ris.getInstruction(RenderInstructionSchedule.S_B_DATE_Y);
                var s_b_date = 'B: ' + s_node.getAttr('birthdate');
                if (s_b_date_x && s_b_date_y && s_b_date) { // Check for non-null result
                    var rotated = ris.getInstruction(RenderInstructionSchedule.ROTATED);
                    gt.appendChild(Renderer.renderDate(s_b_date, s_b_date_x, s_b_date_y, small_font, text_color, allowed_d, <boolean>rotated));
                }

                //~~~ BIRTH PLACE SETUP (S_B_PLACE_X, S_B_PLACE_Y, DEF_FONT_SIZE, ROTATED) ~~~

                var s_b_place_x = ris.getInstruction(RenderInstructionSchedule.S_B_PLACE_X);
                var s_b_place_y = ris.getInstruction(RenderInstructionSchedule.S_B_PLACE_Y);
                var s_b_place = s_node.getAttr('birthplace');
                s_b_place = !(s_b_date_x && s_b_date_y && s_b_date) ? 'B: ' + s_b_place : s_b_place;
                if (s_b_place_x && s_b_place_y && s_b_place) { // Check for non-null result
                    var rotated = ris.getInstruction(RenderInstructionSchedule.ROTATED);
                    gt.appendChild(Renderer.renderPlace(s_b_place, s_b_place_x, s_b_place_y, small_font, text_color, allowed_p, <boolean>rotated));
                }

                //~~~ DEATH DATE SETUP (S_D_DATE_X, S_D_DATE_Y, DEF_FONT_SIZE, ROTATED) ~~~

                var s_d_date_x = ris.getInstruction(RenderInstructionSchedule.S_D_DATE_X);
                var s_d_date_y = ris.getInstruction(RenderInstructionSchedule.S_D_DATE_Y);
                var s_d_date = 'D: ' + s_node.getAttr('deathdate');
                if (s_d_date_x && s_d_date_y && s_d_date) { // Check for non-null result
                    var rotated = ris.getInstruction(RenderInstructionSchedule.ROTATED);
                    gt.appendChild(Renderer.renderDate(s_d_date, s_d_date_x, s_d_date_y, small_font, text_color, allowed_d, <boolean>rotated));
                }

                //~~~ DEATH PLACE SETUP (S_D_PLACE_X, S_D_PLACE_Y, DEF_FONT_SIZE, ROTATED) ~~~

                var s_d_place_x = ris.getInstruction(RenderInstructionSchedule.S_D_PLACE_X);
                var s_d_place_y = ris.getInstruction(RenderInstructionSchedule.S_D_PLACE_Y);
                var s_d_place = s_node.getAttr('deathplace');
                s_d_place = !(s_d_date_x && s_d_date_y && s_d_date) ? 'D: ' + s_d_place : s_d_place;
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
        var m_date = 'M: ' + node.getAttr('marriagedate');
        if(m_date_x && m_date_y && m_date){ // Check for non-null result
            var rotated = ris.getInstruction(RenderInstructionSchedule.ROTATED);
            gt.appendChild(Renderer.renderDate(m_date, m_date_x, m_date_y, small_font, text_color, allowed_d, <boolean>rotated));
        }

        //~~~ MARRIAGE PLACE SETUP (M_PLACE_X, M_PLACE_Y, DEF_FONT_SIZE, ROTATED) ~~~

        var m_place_x = ris.getInstruction(RenderInstructionSchedule.M_PLACE_X);
        var m_place_y = ris.getInstruction(RenderInstructionSchedule.M_PLACE_Y);
        var m_place = !(m_date_x && m_date_y && m_date) ? 'M: ' + node.getAttr('marriageplace') : node.getAttr('marriageplace');
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

    /**
     * Moves the rendering on-screen
     * @param box the box whose svg is being moved
     * @param graphic the graphic element which contains the rendering
     * @param root the graphic element containing all sister elements (deprecated)
     */
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

    /**
     * Generates a generic text element
     * @param path the path name
     * @param x the x coordinate for the text
     * @param y the y coordinate for the text
     * @param font_size the size of font to use
     * @param font_color the color of the font
     * @returns {Element} the created text element
     */
    private static generateTextElement(path :string, x :number, y :number, font_size :number, font_color :string) :Element{
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        var TextPath = document.createTextNode(path);
        text.appendChild(TextPath);
        text.setAttribute("x", x.toString());
        text.setAttribute("y", y.toString());
        text.setAttribute("font-size", font_size.toString());
        text.setAttribute("fill", font_color);
        return text;
    }

    /**
     * Creates a text element containing a name.
     * @param name the name to render
     * @param x the x coordinate for the text
     * @param y the y coordinate for the text
     * @param font_size the size of font to use
     * @param font_color the color of the font
     * @param allowed_len how many characters of name ought to be rendered (using the StringUtils functionalities)
     * @param rotated whether or not the element ought to be rotated (deprecated)
     * @param bold whether or not the name should be rendered in bold.
     * @returns {Element}
     */
    private static renderName(name :string, x :number, y :number, font_size :number, font_color :string, allowed_len :number, rotated :boolean, bold :boolean) :Element{
        if(name && name != '') {
            var text = Renderer.generateTextElement(name, x, y, font_size, font_color);
            if (bold) {
                text.setAttribute("font-weight", "bold");
            }
            StringUtils.fitName(text, name, allowed_len);

            return text;
        }
    }

    /**
     * Creates a text element containing a date. Makes use of the StringUtils functions to truncate dates.
     * @param date the date to render
     * @param x the x coordinate for the text
     * @param y the y coordinate for the text
     * @param font_size the size of font to use
     * @param font_color the color of the font
     * @param allowed_len how many characters of name ought to be rendered (using the StringUtils functionalities)
     * @param rotated whether or not the element ought to be rotated (deprecated)
     * @returns {Element}
     */
    private static renderDate(date :string, x :number, y :number, font_size :number, font_color :string, allowed_len :number, rotated :boolean) :Element{
        if(date && date != '') {
            var text = Renderer.generateTextElement("", x, y, font_size, font_color);
            StringUtils.fitDatePlace(text, date, "", allowed_len);
            return text;
        }
    }

    /**
     * Creates a text element containing a place name. Uses the StringUtils functions to truncate place names.
     * @param place the place name to render
     * @param x the x coordinate for the text
     * @param y the y coordinate for the text
     * @param font_size the size of font to use
     * @param font_color the color of the font
     * @param allowed_len how many characters of name ought to be rendered (using the StringUtils functionalities)
     * @param rotated whether or not the element ought to be rotated (deprecated)
     * @returns {Element}
     */
    private static renderPlace(place :string, x :number, y :number, font_size :number, font_color :string, allowed_len :number, rotated :boolean) :Element{
        if(place && place != '') {
            var text = Renderer.generateTextElement("", x, y, font_size, font_color);
            StringUtils.fitPlaceJS(text, place, allowed_len);
            return text;
        }
    }

    /**
     * Renders a picture. The clip path is appended to the g element passed in (maybe not the best idea, since it
     * doesn't match the other rendering protocols, but you can fix that later), then the PictureManager is queried to
     * see if the picture for this person (pid matched) is ready to go yet. If it is, it edits the box RIS, then renders
     * the picture and passes the created svg element back. Otherwise returns null.
     * @param box the box whose picture is being sought out and rendered
     * @param ris the RIS for the box being rendered
     * @param pic_x the x coordinate of the picture
     * @param pic_y the y coordinate of the picture
     * @param node the node being rendered
     * @param g the g element that should contain all of this picture information.
     * @returns {Element} the svg picture element (null if no picture exists or has been loaded into the PictureManager)
     */
    private static renderPicture(box : IBox, ris : RenderInstructionSchedule, pic_x :string, pic_y :string, node :INode, g :Element) :Element{
        var pic_w = ris.getInstruction(RenderInstructionSchedule.PICTURES_DIM_X);
        var pic_h = ris.getInstruction(RenderInstructionSchedule.PICTURES_DIM_Y);
        if(pic_w && pic_h) {
            var edge_curve = (box.getWidth() / 20).toString();

            var clippath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
            clippath.setAttribute('id', 'clip-' + node.getId());
            g.appendChild(clippath);
            var cliprect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            cliprect.setAttribute('height', pic_h);
            cliprect.setAttribute('width', pic_w);
            cliprect.setAttribute('rx', edge_curve);
            cliprect.setAttribute('ry', edge_curve);
            cliprect.setAttribute('x', pic_x);
            cliprect.setAttribute('y', pic_y);

            clippath.appendChild(cliprect);

            if (PictureManager.hasPicture(node.getId()) && pic_x && pic_y && pic_w && pic_h) {

                if(!<boolean>ris.getInstruction(RenderInstructionSchedule.PICTURE_STATUS)) {
                    var showMarriage = <boolean>ris.getInstruction(RenderInstructionSchedule.S_NAME);
                    StyleManager.stylize(box, showMarriage);
                    ris.addInstruction(RenderInstructionSchedule.PICTURE_STATUS,1);
                }

                var svgimg = PictureManager.getPicture(node.getId(), pic_x, pic_y, pic_w, pic_h);
                if(svgimg) {
                    return svgimg;
                }
            }
        }
        return null;
    }
}