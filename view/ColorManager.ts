/**
 * Created by calvin on 1/29/2016
 */
class ColorManager {

    /**
     * The array containing the standard hex-encoded box colors for the OPG system.
     * Other colors may be selected, but the built-in OPG styles reference these values.
     * @type {string[]} The hex-encoded string colors.
     */
    private static boxColors: string[] = [
                        //____COLOR_____OLD_VALUE____
            "#D9ABFF"   // 0) Purple    "#D9ABFF"
        ,   "#ABE4FF"   // 1) Blue      "#ABE4FF"
        ,   "#9DED9F"   // 2) Green     "#DEFFB7"
        ,   "#FFFFAF"   // 3) Yellow    "#FFFFAF"
        ,   "#FDDCAF"   // 4) Orange
        ,   "#FFB8AF"   // 5) Red       "#FFB8AF"
        ,   "#ffccff"   // 6) Pink
        ,   "#E5E5E5"   // 7) Light Gray
        ,   "#C89A8A"   // 8) Light Brown
        ,   "#A597A1"   // 9) Dark Brown
        ,   "#2C3E50"   // 10) OPG Blue
        ,   "#FFFFFF"   // 11) White
        ,   "#000000"   // 12) Black
        ,   "#BABABA"   // 13) Medium Gray
        ,   "#636363"   // 14) Dark Gray
    ];

    /**
     * @returns {string} a hex-encoded color value for the standard OPG purple
     */
    static purple() : string{
        return this.boxColors[0];
    }

    /**
     * @returns {string} a hex-encoded color value for the standard OPG blue
     */
    static blue() : string {
        return this.boxColors[1];
    }

    /**
     * @returns {string} a hex-encoded color value for the standard OPG green
     */
    static green() : string{
        return this.boxColors[2];
    }

    /**
     * @returns {string} a hex-encoded color value for the standard OPG yellow
     */
    static yellow() : string{
        return this.boxColors[3];
    }

    /**
     * @returns {string} a hex-encoded color value for the standard OPG orange
     */
    static orange() : string{
        return this.boxColors[4];
    }

    /**
     * @returns {string} a hex-encoded color value for the standard OPG red
     */
    static red() : string{
        return this.boxColors[5];
    }

    /**
     * @returns {string} a hex-encoded color value for the standard OPG pink
     */
    static pink() : string{
        return this.boxColors[6];
    }

    /**
     * @returns {string} a hex-encoded color value for the standard OPG female pink
     */
    static femalePink() : string{
        return this.boxColors[6];
    }

    /**
     * @returns {string} a hex-encoded color value for the standard OPG lightgray
     */
    static lightgray() : string{
        return this.boxColors[7];
    }

    /**
     * @returns {string} a hex-encoded color value for the standard OPG light brown
     */
    static lightbrown() : string{
        return this.boxColors[8];
    }

    /**
     * @returns {string} a hex-encoded color value for the standard OPG dark brown
     */
    static darkbrown() : string{
        return this.boxColors[9];
    }

    /**
     * @returns {string} a hex-encoded color value for the standard OPG theme blue.
     */
    static OPGblue() : string{
        return this.boxColors[10];
    }

    /**
     * @returns {string} a hex-encoded color value for the standard OPG white.
     */
    static white() : string{
        return this.boxColors[11];
    }

    /**
     * @returns {string} a hex-encoded color value for the standard OPG black.
     */
    static black() : string{
        return this.boxColors[12];
    }

    /**
     * @returns {string} a hex-encoded color value for the standard OPG medium lightgray
     */
    static mediumgray() : string{
        return this.boxColors[13];
    }

    /**
     * @returns {string} a hex-encoded color value for the standard OPG dark lightgray
     */
    static darkgray() : string{
        return this.boxColors[14];
    }

    /**
     * Grabs a hex-encoded color value via a numeric index over the color spectrum, proceeding in the following order:
     *      0) Purple     3) Yellow
     *      1) Blue       4) Orange
     *      2) Green      5) Red
     * If the index passed in is not within the acceptable range, the colors wrap around, guaranteeing a returned value.
     *
     * @param index the index of the color being selected.
     *
     * @returns {string} a hex-encoded color value.
     */
    static getColorByIndex(index:number) : string{
        while(index > 5){
            index -= 5;
        }
        while(index < 0){
            index += 5;
        }
        return this.boxColors[index];
    }

    /**
     * Converts a string representation of a hex color (#000000) into an integer equivalent (0x000000).
     * @param hex the string to convert
     * @returns {number} The converted hex value
     */
    static stringToInt_hex(hex :string) :number{
        var symbols = hex.split('#');
        return parseInt(symbols[1],16);
    }

    /**
     * Converts a hex number (0x000000) into a string representation of the same number (#000000).
     * @param hex the integer to convert.
     * @returns {string} The converted hex color string.
     */
    static intToString_hex(hex :number) :string{
        if(!hex){return null};
        return ("#" + hex.toString(16));
    }

    /**
     * Lightens a 6 or 8(alpha) digit hex color code, passing it back out. If the code is missing a leading '#',
     * the result also omits the '#'.
     * The lightening is capped at the maximum RBG values, or #ffffff
     *
     * @param hex the hex code to lighten
     * @param amount the amount to lighten it by.
     * @returns {string|any} The new hex code.
     */
    static lighten(hex:string, amount:number=16) : string{
        if(!hex){return null};
        var incolor = hex;
        var alpha = "";
        if(hex.length !== 6 && hex.length !== 7){
            if (hex.length == 8) {
                alpha = hex[0] + hex[1];
                hex = hex.substr(2,hex.length);
            }
            else if(hex.length == 9){

                alpha = hex[1] + hex[2];
                hex = hex[0] + hex.substr(3,hex.length);
            }
            else {
                return hex;
            }
        }
        var prepended = false;
        if(hex[0] === '#'){
            hex = hex.substr(1,hex.length);
            prepended = true;
        }

        var num = parseInt(hex,16);
        var r = ((num >> 16) + amount); // shift, add.
        r = (r > 0x0000FF) ? 0x0000FF : r; // cap.
        var b = (((num >> 8) & 0x00FF) + amount);
        b = (b > 0x0000FF) ? 0x0000FF : b;
        var g = ((num & 0x0000FF) + amount);
        g = (g > 0x0000FF) ? 0x0000FF : g;

        var newColor = g | (b << 8) | (r << 16);

        var out = "";
        if(prepended){
            out = '#'
        }
        console.log("\tLightening from " + incolor + " to " + out + + alpha + newColor.toString(16));
        return out + alpha + newColor.toString(16);
    }



    /**
     * Pastel - a soft and delicate shade of a color.
     * @returns {string} A hex string representation of a color.
     */
    static generateRandomPastel() :string{
        var r = (Math.round(Math.random()* 127) + 127).toString(16);
        var g = (Math.round(Math.random()* 127) + 127).toString(16);
        var b = (Math.round(Math.random()* 127) + 127).toString(16);

        return '#' + r + g + b;
    }
}