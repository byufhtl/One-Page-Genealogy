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
        ,   "#D9ABFF"   // 1) Indigo
        ,   "#ABE4FF"   // 2) Blue
        ,   "#DEFFB7"   // 3) Green
        ,   "#FFFFAF"   // 4) Yellow
        ,   "#FDDCAF"   // 5) Orange
        ,   "#FFB8AF"   // 6) Red
        ,   "#FFABAB"   // 7) Pink
        ,   "#E5E5E5"   // 8) Gray
        ,   "#ffccff"   // 9) FemalePink
        ,   "#2C3E50"   // 10) OPG Blue
    ];

    /**
     * @returns {string} a hex-encoded color value for the standard OPG purple
     */
    static purple() : string{
        return this.boxColors[0];
    }

    /**
     * @returns {string} a hex-encoded color value for the standard OPG indigo
     */
    static indigo() : string{
        return this.boxColors[1];
    }

    /**
     * @returns {string} a hex-encoded color value for the standard OPG blue
     */
    static blue() : string {
        return this.boxColors[2];
    }

    /**
     * @returns {string} a hex-encoded color value for the standard OPG green
     */
    static green() : string{
        return this.boxColors[3];
    }

    /**
     * @returns {string} a hex-encoded color value for the standard OPG yellow
     */
    static yellow() : string{
        return this.boxColors[4];
    }

    /**
     * @returns {string} a hex-encoded color value for the standard OPG orange
     */
    static orange() : string{
        return this.boxColors[5];
    }

    /**
     * @returns {string} a hex-encoded color value for the standard OPG red
     */
    static red() : string{
        return this.boxColors[6];
    }

    /**
     * @returns {string} a hex-encoded color value for the standard OPG pink
     */
    static pink() : string{
        return this.boxColors[7];
    }

    /**
     * @returns {string} a hex-encoded color value for the standard OPG gray
     */
    static gray() : string{
        return this.boxColors[8];
    }

    /**
     * @returns {string} a hex-encoded color value for the standard OPG female pink
     */
    static femalePink() : string{
        return this.boxColors[9];
    }

    /**
     * @returns {string} a hex-encoded color value for the standard OPG theme blue.
     */
    static OPGblue() : string{
        return this.boxColors[10];
    }

    /**
     * Grabs a hex-encoded color value via a numeric index over the color spectrum, proceeding in the following order:
     *      0) Purple       3) Green        6) Red
     *      1) Indigo       4) Yellow       7) Pink
     *      2) Blue         5) Orange       8) Gray
     * If the index passed in is not within the acceptable range, the colors wrap around, guaranteeing a returned value.
     *
     * @param index the index of the color being selected.
     *
     * @returns {string} a hex-encoded color value.
     */
    static getColorByIndex(index:number) : string{
        while(index > 8){
            index -= 8;
        }
        while(index < 0){
            index += 8
        }
        return this.boxColors[index];
    }
}