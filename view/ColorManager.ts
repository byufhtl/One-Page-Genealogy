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
            "#D9ABFF"   // 0) Purple
        ,   "#ABE4FF"   // 1) Blue
        ,   "#DEFFB7"   // 2) Green
        ,   "#FFFFAF"   // 3) Yellow
        ,   "#FDDCAF"   // 4) Orange
        ,   "#FFB8AF"   // 5) Red
        ,   "#ffccff"   // 6) Pink
        ,   "#E5E5E5"   // 7) Gray
        ,   "#2C3E50"   // 8) OPG Blue
        ,   "#FFFFFF"   // 9) White
        ,   "#000000"   // 10) Black
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
     * @returns {string} a hex-encoded color value for the standard OPG gray
     */
    static gray() : string{
        return this.boxColors[7];
    }

    /**
     * @returns {string} a hex-encoded color value for the standard OPG theme blue.
     */
    static OPGblue() : string{
        return this.boxColors[8];
    }

    /**
     * @returns {string} a hex-encoded color value for the standard OPG white.
     */
    static white() : string{
        return this.boxColors[9];
    }

    /**
     * @returns {string} a hex-encoded color value for the standard OPG black.
     */
    static black() : string{
        return this.boxColors[10];
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
     * Lightens a 6 digit hex color code, passing it back out. If the code is missing a leading '#',
     * the result also omits the '#'.
     * The lightening is capped at the maximum RBG values, or #ffffff
     *
     * @param hex the hex code to lighten
     * @param amount the amount to lighten it by.
     * @returns {string|any} The new hex code.
     */
    static lighten(hex:string, amount:number=16) : string{
        if(hex.length !== 6 && hex.length !== 7){
            return hex;
        }
        var hexed = false;
        if(hex[0] === '#'){
            hex = hex.substr(1,hex.length);
            hexed = true;
        }

        var num = parseInt(hex,16);
        var r = (num >> 16) + amount;
        var b = ((num >> 8) & 0x00FF) + amount;
        var g = (num & 0x0000FF) + amount;

        r = (r > 0xFF) ? 0xFF : r;
        g = (g > 0xFF) ? 0xFF : g;
        b = (b > 0xFF) ? 0xFF : b;

        var newColor = g | (b << 8) | (r << 16);

        var out = "";
        if(hexed){
            out = '#'
        }
        return out + newColor.toString(16);
    }

    static generateRandomColor() :string{
        /*
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        var color = '#' + Math.floor(Math.random() * 16777216).toString(16);
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
        */
        return('#' + Math.floor(Math.random() * 16777216).toString(16));
    }
}