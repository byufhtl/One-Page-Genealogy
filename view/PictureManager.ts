///<reference path="../model/IBox.ts"/>
///<reference path="boxRenderers/StyleManager.ts"/>

/**
 * Created by calvinmcm on 5/2/16.
 */

class PictureManager{
    static map : {[key:string] :string} = {};
    static UPDATE :boolean;

    static loadPictures(box :IBox, node :INode) :void{
        if(!(PictureManager.map[node.getId()] == null) && !(PictureManager.map[node.getId()]) && node.hasAttr('profilePicturePromise')){
            node.getAttr('profilePicturePromise').then(function(response) {
                if(!response) {
                    PictureManager.map[node.getId()] = null;
                    return;
                }
                else{
                    PictureManager.map[node.getId()] = response;
                    console.log("Picture for [" + node.getAttr("name") + "] has been loaded.");
                }

                PictureManager.UPDATE = true;

                // save the picture to the map
                PictureManager.map[node.getId()] = response;

                // If an RIS already exists on the box, restylize now that the picture has loaded.
                var ris = box.getRenderInstructions();
                if(ris){
                    if(box.getNode().getId() === node.getId()){
                        console.log("Primary Node Picture Uploaded");
                        StyleManager.stylize(box, ris.getFlavorKey());
                    }
                    else{
                        if(ris.isSpouseBox()){ // Redo on spouse only if it is indeed a spouse box.
                            StyleManager.stylize(box, ris.getFlavorKey());
                        }
                    }
                }

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

    static getPicture(pid :string, pic_x :string, pic_y :string, pic_w :string, pic_h :string) :Element{
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