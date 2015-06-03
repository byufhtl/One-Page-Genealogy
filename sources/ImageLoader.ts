///<reference path="../js/jsDeclarations.ts"/>

/**
 * Created by curtis on 5/11/15.
 */

class ImageLoader {
    public static loadImageString(imageUrl: string) {
        var defer = $.Deferred();

        var xmlHTTP = new XMLHttpRequest();
        xmlHTTP.open('GET',imageUrl,true);
        xmlHTTP.responseType = 'arraybuffer';
        xmlHTTP.onload = function(e)
        {
            if(this.status === 200) {
                var arr = new Uint8Array(this.response);
                var raw = String.fromCharCode.apply(null, arr);
                var b64 = btoa(raw);
                var dataURL = "data:image/jpeg;base64," + b64;
                defer.resolve(dataURL);
            }
            else {
                defer.resolve('');
            }
        };
        xmlHTTP.onerror = function(e) {
            defer.resolve();
        };

        xmlHTTP.send();

        return defer.promise();
    }
}