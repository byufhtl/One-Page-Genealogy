/**
 * Created by Jared on 1/11/16.
 */

// Global pollutants.
var numGenerations;
var c = null;
var optionManager = null; // May be removable.
var token;
var type = "";


function checkDevice() {
    var device = (/.*(android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini).*/i.test(navigator.userAgent.toLowerCase()));

    if (device) {
        console.log("Mobile Device Detected! Type: " + device);
        var header = $('<div style="margin: auto;" id="mobile-warning-header"></div>');
        header.append('<hr>');
        header.append('<h4 class="label label-danger" style="display: block; padding: 0; margin:0;">One Page Genealogy has detected that you may be using a mobile device.</h4>');
        header.append('<h4 class="label label-danger" style="display: block; padding: 0; margin:0;">Mobile devices are not fully supported for this app.</h4>');
        header.append('<h4 class="label label-danger" style="display: block; padding: 0; margin:0;">If you continue, be warned that certain features may not work properly.</h4>');
	$('#mobile-warning').append(header);
        /*
         <h4 style="margin: auto">
         <hr>
         <p class="label label-danger">One Page Genealogy has detected that you may be using a mobile device.</p>
         <p class="label label-danger"> Mobile devices may not be fully supported for this app.</p>
         <p class="label label-danger">For full support, we recommend non-mobile devices.</p>
         </h4>
         */
    }
    console.log("Device Type:", navigator.userAgent.toLowerCase());
}

if (window.location.href.indexOf("fstoken") > -1) {
    var url = window.location.href;
    var a = $('<a>', {href: url})[0];
    var jwt = a.search.slice(a.search.indexOf('=') + 1, -1);
    token = JSON.parse(atob(jwt.split('.')[1]));
    var accessToken = token['fs_access_token'];
}

FamilySearch.init({

    app_key: "TDBN-XQ3H-Y6VQ-WQLS-YWZN-QFP1-B9FP-4H96", //<-opg product key //"a02j000000AiDyvAAF",//
    environment: 'production', //'sandbox',//
    auth_callback: 'http://localhost:8000/auth/login/return/',
    http_function: $.ajax,
    deferred_function: $.Deferred,
    access_token: accessToken,
    auto_signin: true,    //<-put these back in when we get our own production key
    save_access_token: true,
    auto_expire: true
});

$(document).ready(function () {

    // A quick check for mobile devices, since this code is not necessarily mobile-compatible.
    checkDevice();

    /*
     * The OptionManager is in charge of the buttons.
     * As all further actions are button-driven, it serves as the entry point for the program.
     */
    optionManager = new OptionManager();
    optionManager.init();

});

function handleHeight(height){
    var ratio = $('#ruler-ratio').val();
    $('#ruler-width').val((height*ratio).toFixed(1));
}

function handleWidth(width){
    var ratio = $('#ruler-ratio').val();
    $('#ruler-height').val((width/ratio).toFixed(1));
}
