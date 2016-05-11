///<reference path="../../model/IBox.ts"/>
///<reference path="../ColorManager.ts"/>
///<reference path="../../util/StringUtils.ts"/>
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
    static renderBox(box :IBox, rootElement :Element) :Element {

        //~~~ SETUP ~~~

        var g:Element = document.createElementNS("http://www.w3.org/2000/svg", "g"); // The overall element
        var gt:Element = document.createElementNS("http://www.w3.org/2000/svg", "g"); // The text container element

        var ris = box.getRenderInstructions();
        var big_font = ris.getDefTextSize();
        var small_font = ris.getAltTextSize();

        if (rootElement) {
            rootElement.appendChild(g);
        }

        // build in a quick anti-nullbox case to prevent it from really rendering.
        if(ris.getFlavorKey() === NullBoxStyle.NULL){
            console.log("Null Box Being Rendered.");
            g.setAttribute("transform","translate("+box.getX()+", "+box.getY()+")");
            return g;
        }

        // Create some default text sizes if they have not been previously set.
        if (big_font === null || big_font == undefined) {
            big_font = 12;
        }
        if (small_font === null || small_font == undefined) {
            small_font = big_font * .75;
        }

        //~~~ RECTANGLE SETUP ~~~
        var rect:Element = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        g.appendChild(rect);
        var node = box.getNode();
        gt.setAttribute("style", "font-family: 'Roboto Slab' ");

        rect.setAttribute('width', String(box.getWidth()));
        var h = box.getHeight() - 6 - box.getSpace();
        h = (h > 0)? h : 0;
        if(h === 0){console.log("Bad DIM: " + box.getWidth() + "," + box.getHeight() + " : " + ris.getFlavorKey());}
        rect.setAttribute('height', String(h));

        // set up the rounding on the boxes based on the RIS, defaulting to 5% of the longer of the two sides.
        var rounding = ris.getCornerRounding();
        var edge_curve :string;

        if (rounding == null || rounding == undefined) {
            var longest = (box.getWidth() > h) ? box.getWidth() : h;
            edge_curve = (longest / 20).toString();
        }
        else{
            edge_curve = rounding.toString();
        }

        rect.setAttribute('rx', edge_curve);
        rect.setAttribute('ry', edge_curve);

        //~~~ BORDERED BOX SETUP ~~~

        var border = ris.getBorderWidth();
        border = (border != null)? border : 4;

        // if there should be an automatic pastel colored border, draw the box accordingly.
        if(ris.isColoredBorder()){ // 0 or it has a dimension
            rect.setAttribute('stroke-width', (border).toString());
            rect.setAttribute('stroke', box.getColor());
            rect.setAttribute('fill', ColorManager.lighten(box.getColor(),32));
        }
        else{
            rect.setAttribute('stroke-width', border.toString());
            rect.setAttribute('stroke', 'black');
            rect.setAttribute('fill', box.getColor());
        }

        // if the RIS specifies a border color, this border color can trump all others.
        var imposedBorderColor = ris.getBorderColor();
        if(imposedBorderColor){
            rect.setAttribute('stroke', imposedBorderColor);
        }

        // set up the text color based on the box and defaulting to black.
        var text_color :string;
        if(box.getTextColor()!=null){
            text_color = box.getTextColor();
        }
        else{
            text_color = ColorManager.black();
            console.log("No specified text color for [" + node.getAttr("name") + "]");
        }

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
            Renderer.renderPicture(box, node,g);
        }

        //~~~ NAME SETUP ~~~

        //console.log("\t@NAME_SETUP: " + node.getAttr('name') + ris.toString());
        var name_p = ris.getNameInstruction();
        //console.log(name_x,name_y);
        var name = node.getAttr('name');
        if(name_p != null && name_p != undefined && name){ // Check for non-null result
            gt.appendChild(Renderer.renderName(name, name_p.getX(), name_p.getY(), big_font, text_color, name_p.getL(), ris.isRotated(), node.isMainPerson()));
        }
        else{
            if(name_p == null) {
                // if for some reason there was some failure in obtaining the name rendering information, restylize and queue a recursive re-rendering.
                // this will, of course, break if there is actually no name rendering information in the box style.
                //console.log("No Name Instructions for [" + name + "]");
                //StyleManager.stylize(box, box.getRenderInstructions().getFlavorKey());
                //return Renderer.renderBox(box, rootElement);
                console.log("null name instruction on [" + node.getAttr("name") + "]" + ris.toString());
            }
            if(name_p == undefined){
                console.log("undef name instruction on [" + node.getAttr("name") + "]");
            }
            //console.log("name instruction on [" + node.getAttr("name") + "] = [" + name_p + "]");
            //console.log("FLAVOR_KEY() on [" + node.getAttr("name") + "] = [" + ris.getFlavorKey() + "]");
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
            var marr_date = Renderer.renderDate(m_date, m_date_p.getX(), m_date_p.getY(), small_font, text_color, m_date_p.getL(), ris.isRotated());
            marr_date.textContent = "M: " + marr_date.textContent;
            gt.appendChild(marr_date);
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
        else{
            console.log("Movement failed with box " + box + " and " + graphic);
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
        var text = Renderer.generateTextElement("", x, y, font_size, font_color);
        if(date && date != '') {
            StringUtils.fitDatePlace(text, date, "", allowed_len);
        }
        return text;
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
        var text = Renderer.generateTextElement("", x, y, font_size, font_color);
        if(place && place != '') {
            StringUtils.fitPlaceJS(text, place, allowed_len);
        }
        return text;
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
    private static renderPicture(box : IBox, node :INode, g :Element) :Element{
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

            var longer = (pic_w > pic_h) ? pic_w : pic_h;
            var cornerRounding = (longer/5).toString();

            var clippath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
            clippath.setAttribute('id', 'clip-'+node.getId());
            g.appendChild(clippath);
            var cliprect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            cliprect.setAttribute('width', pic_w.toString());
            cliprect.setAttribute('height', pic_h.toString());
            cliprect.setAttribute('rx', cornerRounding);
            cliprect.setAttribute('ry', cornerRounding);
            cliprect.setAttribute('x', pic_x.toString());
            cliprect.setAttribute('y', pic_y.toString());

            clippath.appendChild(cliprect);

            if(box.getRenderInstructions().getHasPicture()) { // node.hasAttr('profilePicturePromise')
                var svgimg = document.createElementNS('http://www.w3.org/2000/svg','image');
                cliprect.setAttribute('width', pic_w.toString());
                cliprect.setAttribute('height', pic_h.toString());
                svgimg.setAttributeNS('http://www.w3.org/1999/xlink','href','images/loading.svg');
                cliprect.setAttribute('x', pic_x.toString());
                cliprect.setAttribute('y', pic_y.toString());
                svgimg.setAttribute('clip-path', 'url(#clip-'+node.getId()+')');
                g.appendChild(svgimg);

                node.getAttr('profilePicturePromise').then(function(response) {
                    if(!response) {
                        g.removeChild(svgimg);
                        box.getRenderInstructions().setHasPicture(false);
                        if(box.getRenderInstructions().getFlavorKey() == null){
                            console.log("key null in pic renderer(@1) for " + node.getAttr('name'));
                        }
                        StyleManager.stylize(box,box.getRenderInstructions().getFlavorKey());
                        return;
                    }

                    //console.log("Rendering picture...");

                    var svgimg2 = document.createElementNS('http://www.w3.org/2000/svg','image');
                    svgimg2.setAttribute('width', pic_w.toString());
                    svgimg2.setAttribute('height', pic_h.toString());
                    svgimg2.setAttribute('x', pic_x.toString());
                    svgimg2.setAttribute('y', pic_y.toString());
                    svgimg2.setAttribute('clip-path', 'url(#clip-'+node.getId()+')');

                    function listener() {
                        g.removeChild(svgimg);
                        svgimg2.removeEventListener('load', listener);
                    }
                    svgimg2.addEventListener('load', listener);
                    svgimg2.setAttributeNS('http://www.w3.org/1999/xlink','href',response);
                    g.appendChild(svgimg2);

                    //console.log("Picture Manager: " + PictureManager.toString());

                    if(box.getRenderInstructions().isRotated()){
                        svgimg2.setAttribute("transform","translate(0, "+ (box.getHeight()-2)+") rotate(-90 0,0)");
                    }

                }, function() {
                    g.removeChild(svgimg);
                    box.getRenderInstructions().setHasPicture(false);
                    if(box.getRenderInstructions().getFlavorKey() == null){
                        console.log("key null in pic renderer(@2) for " + node.getAttr('name'));
                    }
                    StyleManager.stylize(box,box.getRenderInstructions().getFlavorKey());
                });
            }

        }
        return null;
    }

    /**
     * Renders an svg portrait of an individual at the specified size.
     * @param node the person whose portrait you want to render
     * @param width the portrait's intended width
     * @param height the portrait's intended height
     * @param g the Element to which the portrait ought to be appended as a child element
     */
    public static renderPortrait(node :INode, width :number, height :number, g :Element) :void{
        if(width && height) {

            var longer = (width > height) ? width : height;
            var cornerRounding = (longer/5).toString();

            var clippath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
            clippath.setAttribute('id', 'clip-portrait-'+node.getId());
            g.appendChild(clippath);
            var cliprect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            cliprect.setAttribute('width',width.toString());
            cliprect.setAttribute('height', height.toString());
            cliprect.setAttribute('rx', cornerRounding);
            cliprect.setAttribute('ry', cornerRounding);
            cliprect.setAttribute('x', '0');
            cliprect.setAttribute('y', '0');

            clippath.appendChild(cliprect);

            if(node.hasAttr('profilePicturePromise')) { // node.hasAttr('profilePicturePromise')
                var svgimg = document.createElementNS('http://www.w3.org/2000/svg','image');
                cliprect.setAttribute('width', width.toString());
                cliprect.setAttribute('height', height.toString());
                svgimg.setAttributeNS('http://www.w3.org/1999/xlink','href','images/loading.svg');
                cliprect.setAttribute('x', '0');
                cliprect.setAttribute('y', '0');
                svgimg.setAttribute('clip-path', 'url(#clip-portrait-'+node.getId()+')');
                g.appendChild(svgimg);

                node.getAttr('profilePicturePromise').then(function(response) {
                    if(!response) {
                        g.removeChild(svgimg);
                        return;
                    }

                    //console.log("Rendering portrait...");

                    var border = longer/30;

                    var svgimg2 = document.createElementNS('http://www.w3.org/2000/svg','image');
                    svgimg2.setAttribute('width', width.toString());
                    svgimg2.setAttribute('height', height.toString());
                    svgimg2.setAttribute('x', '0');
                    svgimg2.setAttribute('y', '0');
                    svgimg2.setAttribute('clip-path', 'url(#clip-portrait-'+node.getId()+')');


                    var b_rect :Element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                    b_rect.setAttribute('stroke-width', border.toString());
                    b_rect.setAttribute('stroke', 'black');
                    b_rect.setAttribute('fill', 'none');

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

        }
    }
}