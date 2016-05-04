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

        //~~~ SETUP ~~~

        var g:Element = document.createElementNS("http://www.w3.org/2000/svg", "g"); // The overall element
        var gt :Element = document.createElementNS("http://www.w3.org/2000/svg", "g"); // The text container element

        var ris = box.getRenderInstructions();
        var big_font = ris.getDefTextSize();
        var small_font = ris.getAltTextSize();

        if(rootElement) {
            rootElement.appendChild(g);
        }

        // Reject if collapsed
        if(box.isCollapsed()){
            return null;
        }

        // Create some default text sizes if they have not been previously set.

        if(big_font === null || big_font == undefined){
            big_font = 12;
        }
        if(small_font === null || small_font == undefined){
            small_font = big_font * .75;
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

        //~~~ BORDERED BOX SETUP ~~~

        var border = ris.getBorderWidth();
        border = (border != null)? border : 4;

        // if there is a colored border, draw the box accordingly.
        if(ris.isColoredBorder()){ // 0 or it has a dimension
            rect.setAttribute('stroke-width',(border).toString());
            rect.setAttribute('stroke',box.getColor());
            rect.setAttribute('fill',ColorManager.lighten(box.getColor(),32));
        }
        else{
            rect.setAttribute('stroke-width', border.toString());
            rect.setAttribute('stroke', 'black');
            rect.setAttribute('fill',box.getColor());
        }

        var text_color = box.getTextColor()!=null ? box.getTextColor() : ColorManager.black();

        g.appendChild(gt);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]
        //==================================== MAIN PERSON INFORMATION =================================================
        //[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //~~~ PICTURE SETUP ~~~

        var pic_p = ris.getPicturePlaceInstruction();
        var pic_d = ris.getPictureDimInstruction();
        if(pic_p != null && pic_d != null) {
            var pic_loaded = Renderer.renderPicture(box, node);
            if(pic_loaded){
                g.appendChild(pic_loaded);
            }
        }

        //~~~ NAME SETUP ~~~

        //console.log("\t@NAME_SETUP: " + node.getAttr('name') + ris.toString());
        var name_p = ris.getNameInstruction();
        //console.log(name_x,name_y);
        var name = node.getAttr('name');
        if(name_p != null && name){ // Check for non-null result
            gt.appendChild(Renderer.renderName(name, name_p.getX(), name_p.getY(), big_font, text_color, name_p.getL(), ris.isRotated(), node.isMainPerson()));
        }

        //~~~ BIRTH DATE SETUP ~~~

        var b_date_p = ris.getBDateInstruction();
        var b_date = node.getAttr('birthdate');
        if(b_date_p != null && b_date){ // Check for non-null result
            gt.appendChild(Renderer.renderDate(b_date, b_date_p.getX(), b_date_p.getY(), small_font, text_color, b_date_p.getL(), ris.isRotated()));
        }

        //~~~ BIRTH PLACE SETUP ~~~

        var b_place_p = ris.getBPlaceInstruction();
        var b_place = node.getAttr('birthplace');
        if(b_place_p != null && b_place){ // Check for non-null result
            gt.appendChild(Renderer.renderPlace(b_place, b_place_p.getX(), b_place_p.getY(), small_font, text_color, b_place_p.getL(), ris.isRotated()));
        }

        //~~~ DEATH DATE SETUP ~~~

        var d_date_p = ris.getDDateInstruction();
        var d_date = node.getAttr('deathdate');
        if(d_date_p != null && d_date != null && d_date != ""){ // Check for non-null result
            gt.appendChild(Renderer.renderDate(d_date, d_date_p.getX(), d_date_p.getY(), small_font, text_color, d_date_p.getL(), ris.isRotated()));
        }

        //~~~ DEATH PLACE SETUP ~~~

        var d_place_p = ris.getDPlaceInstruction();
        var d_place = node.getAttr('deathplace');
        if(d_place_p != null && d_place != null && d_place != ""){ // Check for non-null result
            gt.appendChild(Renderer.renderPlace(d_place, d_place_p.getX(), d_place_p.getY(), small_font, text_color, d_place_p.getL(), ris.isRotated()));
        }

        //~~~ LIFE SPAN SETUP ~~~
        var life_span_p = ris.getSpanInstruction();
        if(life_span_p !== null) {
            var life_span = Renderer.generateTextElement("", life_span_p.getX(), life_span_p.getY(), small_font, text_color);
            StringUtils.fitDate(life_span, b_date, d_date, 14);
            gt.appendChild(life_span);
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]
        //==================================== SPOUSE INFORMATION ======================================================
        //[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        var s_node = node.getDisplaySpouse();
        if(s_node) {

            //~~~ PICTURE SETUP ~~~

            //~~~ NAME SETUP ~~~

            var s_name_p = ris.getSpouseNameInstruction();
            var s_name = s_node.getAttr('name');
            if (s_name_p != null && s_name) { // Check for non-null result


                //~~~ NAME SETUP ~~~

                gt.appendChild(Renderer.renderName(s_name, s_name_p.getX(), s_name_p.getY(), big_font, text_color, s_name_p.getL(), ris.isRotated(), s_node.isMainPerson()));


                //~~~ BIRTH DATE SETUP ~~~

                var s_b_date_p = ris.getSpouseBDateInstruction();
                var s_b_date = s_node.getAttr('birthdate');
                if (s_b_date_p != null && s_b_date) { // Check for non-null result
                    gt.appendChild(Renderer.renderDate(s_b_date, s_b_date_p.getX(), s_b_date_p.getY(), small_font, text_color, s_b_date_p.getL(), ris.isRotated()));
                }

                //~~~ BIRTH PLACE SETUP ~~~

                var s_b_place_p = ris.getSpouseBPlaceInstruction();
                var s_b_place = s_node.getAttr('birthplace');
                if (s_b_place_p != null && s_b_place) { // Check for non-null result
                    gt.appendChild(Renderer.renderPlace(s_b_place, s_b_place_p.getX(), s_b_place_p.getY(), small_font, text_color, s_b_place_p.getL(), ris.isRotated()));
                }

                //~~~ DEATH DATE SETUP ~~~

                var s_d_date_p = ris.getSpouseDDateInstruction();
                var s_d_date = s_node.getAttr('deathdate');
                if (s_d_date_p != null && s_d_date) { // Check for non-null result
                    gt.appendChild(Renderer.renderDate(s_d_date, s_d_date_p.getX(), s_d_date_p.getY(), small_font, text_color, s_d_date_p.getL(), ris.isRotated()));
                }

                //~~~ DEATH PLACE SETUP ~~~

                var s_d_place_p = ris.getSpouseDPlaceInstruction();
                var s_d_place = s_node.getAttr('deathplace');
                var s_d_place_valid = (s_d_date_p != null && s_d_date);
                if (s_d_place_valid) { // Check for non-null result
                    gt.appendChild(Renderer.renderPlace(s_d_place, s_d_place_p.getX(), s_d_place_p.getY(), small_font, text_color, s_d_place_p.getL(), ris.isRotated()));
                }
            }
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]
        //==================================== MARRIAGE INFORMATION ====================================================
        //[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //~~~ MARRIAGE DATE SETUP ~~~

        var m_date_p = ris.getMDateInstruction();
        var m_date = node.getAttr('marriagedate');
        if(m_date_p != null && m_date){ // Check for non-null result
            gt.appendChild(Renderer.renderDate(m_date, m_date_p.getX(), m_date_p.getY(), small_font, text_color, m_date_p.getL(), ris.isRotated()));
        }

        //~~~ MARRIAGE PLACE SETUP ~~~

        var m_place_p = ris.getMPlaceInstruction();
        var m_place = node.getAttr('marriageplace');
        if(m_place_p != null && m_place){ // Check for non-null result
            gt.appendChild(Renderer.renderPlace(m_place, m_place_p.getX(), m_place_p.getY(), small_font, text_color, m_place_p.getL(), ris.isRotated()));
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]
        //==================================== ROTATION ================================================================
        //[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]=[]
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        if(ris.isRotated()){
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
     * @param node the node being rendered
     * @returns {Element} the svg picture element (null if no picture exists or has been loaded into the PictureManager)
     */
    private static renderPicture(box : IBox, node :INode) :Element{
        var ris = box.getRenderInstructions();

        var pictureDim = ris.getPictureDimInstruction();
        var pic_w = pictureDim.getX();
        var pic_h = pictureDim.getY();
        var pic_x :number;
        var pic_y :number;

        // This will desperately need to get revamped for multi-spouse views...
        if(node.getId() === box.getNode().getId()){
            pic_x = ris.getPicturePlaceInstruction().getX();
            pic_y = ris.getPicturePlaceInstruction().getY();
        }
        else{
            pic_x = ris.getSpousePicturePlaceInstruction().getX();
            pic_y = ris.getSpousePicturePlaceInstruction().getY();
        }
        if(pic_w && pic_h) {

            var svgimg = PictureManager.getPicture(node.getId(), pic_x.toString(), pic_y.toString(), pic_w.toString(), pic_h.toString());
            if(svgimg) {
                if(<boolean>ris.isRotated()){
                    svgimg.setAttribute("transform","translate(0, "+ (box.getHeight()-2)+") rotate(-90 0,0)");
                }
                return svgimg;
            }

        }
        return null;
    }
}