///<reference path="../model/INode.ts"/>

/**
 * Created by calvinmcm on 5/2/16.
 */

class PictureManager{
    static map : {[key:string] :string} = {};
    static UPDATE :boolean;

    static loadPictures(node :INode) :void{
        if(node.hasAttr('profilePicturePromise')) {
            node.getAttr('profilePicturePromise').then(function(response) {
                if(!response) {
                    PictureManager.map[node.getId()] = null;
                    return;
                }
                else{
                    PictureManager.map[node.getId()] = response;
                }

                PictureManager.UPDATE = true;

                // save the picture to the map
                PictureManager.map[node.getId()] = response;

            }, function() {
                PictureManager.map[node.getId()] = null;
            });
        }
    }

    static hasPicture(pid :string) :boolean{
        var map = PictureManager.map;
        for(var key in map){
            if(key === pid){
                return true;
            }
        }
        return false;
    }

    static getPicture(pid :string, pic_x :string, pic_y :string, pic_w :string, pic_h) :Element{
        var map = PictureManager.map;
        for(var key in map){
            if(key === pid){
                // generate the image
                var svgimg = document.createElementNS('http://www.w3.org/2000/svg','image');
                svgimg.setAttribute('clip-path', 'url(#clip-'+pid+')');

                function listener() {
                    svgimg.removeEventListener('load', listener);
                }

                // append the new image
                svgimg.addEventListener('load', listener);
                svgimg.setAttributeNS('http://www.w3.org/1999/xlink','href',PictureManager.map[pid]);
                svgimg.setAttribute('height', pic_h);
                svgimg.setAttribute('width', pic_w);
                svgimg.setAttribute('x', pic_x);
                svgimg.setAttribute('y', pic_y);

                return svgimg;
            }
        }
        return null;
    }

    static clear(){
        PictureManager.map = {};
    }
}