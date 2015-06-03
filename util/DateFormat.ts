/**
 * Created by curtis on 5/12/15.
 */
class DateFormat {
    private static months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    public static standardDate(dateString): string {
        var date = new Date(dateString);
        var ret = [date.getDate(), DateFormat.months[date.getMonth()], date.getFullYear()].join(' ');
        return ret;
    }
}