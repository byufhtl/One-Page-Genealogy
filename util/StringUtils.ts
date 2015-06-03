/**
 * Created by curtis on 5/12/15.
 */
class StringUtils {
    public static fitDate(textObj, birthDateStr, deathDateStr, width) {
        var longDate = '( '+StringUtils.standardDate(birthDateStr)+" - "+StringUtils.standardDate(deathDateStr)+" )";
        textObj.textContent = longDate;
        if(textObj.getSubStringLength(0, longDate.length)<width) {
            return;
        }
        var medDate = '('+StringUtils.standardDate(birthDateStr)+"-"+StringUtils.standardDate(deathDateStr)+")";
        textObj.textContent = medDate;
        if(textObj.getSubStringLength(0, medDate.length)<width) {
            return;
        }
        var smDate = '('+new Date(birthDateStr).getFullYear()+"-"+new Date(deathDateStr).getFullYear()+")";
        textObj.textContent = smDate;
        if(textObj.getSubStringLength(0, smDate.length)<width) {
            return;
        }
        var xsDate = '('+new Date(birthDateStr).getFullYear()+"-"+(new Date(deathDateStr).getFullYear()+"").substring(2, 4);+")";
        textObj.textContent = xsDate;
        if(textObj.getSubStringLength(0, xsDate.length)<width) {
            return;
        }
    }
    private static months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    public static standardDate(dateString): string {
        if(!dateString) {
            return '';
        }

        if(dateString.length <= 4) {
            return dateString;
        }

        var date = new Date(dateString);
        var ret = [date.getDate(), StringUtils.months[date.getMonth()], date.getFullYear()].join(' ');
        return ret;
    }
    public static centerElement(element, x, width) {
        var bbox = element.getBBox();
        var dw = width - bbox.width;
        element.setAttribute('x', x + dw/2);
    }
}