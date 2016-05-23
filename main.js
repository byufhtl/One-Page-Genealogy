/**
 * Created by Jared on 1/11/16.
 */

var numGenerations;
var c = null;
var optionManager = null;
var token;
if (window.location.href.indexOf("fstoken") > -1) {
    var url = window.location.href;
    var a = $('<a>', {href: url})[0];
    var jwt = a.search.slice(a.search.indexOf('=') + 1, -1);
    token = JSON.parse(atob(jwt.split('.')[1]));
    var accessToken = token['fs_access_token'];
}

FamilySearch.init({

    app_key: "NQ3Q-PBD8-LL9N-RCLZ-MZCZ-X7P8-7SMX-RD6N", //<-rf product key //"a02j000000AiDyvAAF",//
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

    $("[name='edit-spacing-switch']").bootstrapSwitch();

    $('#downloadModal').modal({
        backdrop: 'static',
        keyboard: false
    });

    if (localStorage.getItem("numGenerations") && FamilySearch.hasAccessToken()) {
        fsHideFirstModal();
    } else if (localStorage.getItem("numGenerations")) {
        localStorage.removeItem("numGenerations");
        localStorage.removeItem("rootPID");
        localStorage.removeItem("direction");
    }

    //$("#fsModal").show();
    //window.location = 'login';
    /*$("#fsbutton").click(function(){
        $('#relative-tree-downloader').hide();
        familySearchDownload();
    });*/
    $('#download-modal-close').hide();
    $("#redownload").click(function(){
        $('#downloadModal').show();
        $('#download-modal-close').show();
    });
    $("#tofsbutton-user").click(fsHideFirstModalUser);
    $("#tofsbutton").click(fsHideFirstModalOther);
    $("#togedbutton").click(function(){
        $('#myInput').click();
        $('#downloadModal').hide();
    });
    $('#myTreeCard').click(fsHideFirstModalUser);
    $('#otherTreeCard').click(fsHideFirstModalOther);
    $('#gedcomCard').click(function(){
        $('#myInput').click();
        $('#downloadModal').hide();
    });
    //$("#logoutbutton").click(logout)
    $("#download-modal-help").click(function(){
       window.open('help.html');
    });
    $("#download-modal-fhtl").click(function(){
        window.open('https://fhtl.byu.edu');
    });

    $("#box-color-picker").spectrum({});
    $("#box-text-color-picker").spectrum({});

//Stuff for draggable sidebar
    var dragging = false;
    $('#dragbar').mousedown(function(e){
        e.preventDefault();
        dragging = true;
        var main = $('#opg-chart');
        var ghostbar = $('<div>',
            {id:'ghostbar',
                css: {
                    height: main.outerHeight(),
                    top: main.offset().top,
                    left: main.offset().left
                }
            }).appendTo('body');

        $(document).mousemove(function(e){
            ghostbar.css("left",e.pageX+2);
        });

    });

    $(document).mouseup(function(e){
        if (dragging)
        {
            var percentage = (e.pageX / window.innerWidth) * 100;
            var mainPercentage = 100-percentage;

            $('#country-legend').animate({"width": percentage + "%"}, "fast");
            //$('#opg-chart').css("width",mainPercentage + "%");
            $('#ghostbar').remove();
            $(document).unbind('mousemove');
            dragging = false;
        }
    });

});

function fsHideFirstModal() {
    $('#downloadModal').hide();
    $('#fsModal').modal('show');
    familySearchDownload();
}

function fsHideFirstModalUser() {
    $('#relative-tree-downloader').hide();
    $('#pid-search-input').val("");
    fsHideFirstModal();
}

function fsHideFirstModalOther(){
    $('#relative-tree-downloader').show();
    fsHideFirstModal();
}

function isExpired(){
    if(token) {
        console.log("Token expires in " + ((token['exp'] - Date.now() / 1000) / 60).toFixed(2) + " min");
        return token['exp'] < (Date.now() / 1000);
    }else{
        return true;
    }
}

function familySearchDownload() {
    //var numGenerations;
    var rootPID;
    var direction;

    if (localStorage.getItem("numGenerations")) {
        numGenerations = localStorage.getItem("numGenerations");
        rootPID = localStorage.getItem("rootPID");
        direction = localStorage.getItem("direction");
        localStorage.removeItem("numGenerations");
        localStorage.removeItem("rootPID");
        localStorage.removeItem("direction");
        download();
    } else {
        $('#fsModal').modal({
            backdrop: 'static',
            keyboard: false
        });

        $('#fsDwldBack').click(function(){
            $('#fsModal').modal('hide');
            $('#downloadModal').modal('show');
        });

        if (FamilySearch.hasAccessToken && !isExpired()) {
            $('#fsSave').html("Submit");
        } else {
            $('#fsSave').html("Login with FamilySearch");
        }


        $('#fsSave').click(function () {
            rootPID = document.getElementById("pid-search-input").value;
            numGenerations = $("option:selected", ('#fsGenerationsSelect'))[0].value;
            direction = $('input[name=FSascOrDsc]:checked').val();
            download();
        });
    }

    function download() {
        var isValidPid = false;
        if (rootPID === '')
            isValidPid = true;
        else {
            rootPID = rootPID.toUpperCase();
            //console.log(rootPID);
            //var regexp = new RegExp(/([A-Z]|[0-9]){4}-([A-Z]|[0-9]){3}/);
            isValidPid = /([A-Z]|[0-9]){4}-([A-Z]|[0-9]){3}/.test(rootPID);//regexp.test(pid);
        }

        if (isValidPid) {
            //$('#fsModal').hide();

            if (!FamilySearch.hasAccessToken() || isExpired()) {
                localStorage.setItem("numGenerations", $("option:selected", ('#fsGenerationsSelect'))[0].value);
                localStorage.setItem("rootPID", rootPID);
                localStorage.setItem("direction", $('input[name=FSascOrDsc]:checked').val());
                window.location = 'https://fhtl.byu.edu/auth?redirect=' + encodeURIComponent(document.location.origin);
            } else {
                continueExecution();
            }
        }
        else {
            alert("Invalid PID.")
        }
    }

    function resetOptions(){
        document.getElementById('opg-show-empty').innerHTML = "Show Empty Boxes";
        document.getElementById('opg-edit-spacing').innerHTML = "Edit Spacing";
        $('#edit-spacing-switch').css("display", "none");
        $('.BSswitch').bootstrapSwitch('state', true);
        $('#country-legend').css('display', 'none');
        $('#ruler-height').val("");
        $('#country-legend').animate({"width": "0%"}, "fast");
        $('#opg-chart').css("width", "100%");
    }

    function continueExecution() {
        FamilySearch.getAccessToken().then(function (response) {

            FamilySearch.getCurrentUser().then(function (response) {
                localStorage.setItem("chartType", "FamilySearch");
                var old_element = document.getElementById("opg-chart");
                var new_element = old_element.cloneNode(true);
                old_element.parentNode.replaceChild(new_element, old_element);
                while (new_element.lastChild) {
                    new_element.removeChild(new_element.lastChild);
                }

                resetOptions();

                //var pid = document.getElementById("pid-search-input").value;
                //var generations = $("option:selected", ('#fsGenerationsSelect'))[0].value;
                //var dscOrAsc = $('input[name=FSascOrDsc]:checked').val();
                var user = response.getUser();
                if (rootPID === '')
                    rootPID = user.personId;

                //we need to turn off old listeners before we create a new c.
                //---------------------------------------------------------------------------------------
                // Why??? it seems to be throwing some things off... such as:
                // once the opg-download click handler is off, you can't download a chart.
                // Since I see no good reason to turn off this click handler, I'm commenting out the following line
                // ~ Jared C. (March 7, 2016)
                // ps. This code may have become obsolete since we're not creating a new options handler each time.
                //      It should only be created once. Thus, only one set of handlers.
                //      Thus, we shouldn't be turning them off.
                // pps. If there actually still exists a good reason for turning it off, please correct me.
                // ppps. Please delete this comment block after a reasonable amount of time if everything seems fine.
                //---------------------------------------------------------------------------------------
                //$('#opg-download').off('click');
                $('#fsSave').off('click');
                $('#fsGenerationsSelect').off('click');
                $('fsgenerationsRadio').off('click');

                if(optionManager === null){
                    optionManager = new OptionManager();
                }
                optionManager.setDirection(direction);
                c = new C({
                    rootId: rootPID,
                    generations: numGenerations,
                    dscOrAsc: direction,
                    optionManager: optionManager
                });
                localStorage.setItem("rootPID", rootPID);
                $('#fsModal').modal("hide");
            })
        })
    }
}

function handleHeight(height){
    var ratio = $('#ruler-ratio').val();
    $('#ruler-width').val((height*ratio).toFixed(1));
}

function handleWidth(width){
    var ratio = $('#ruler-ratio').val();
    $('#ruler-height').val((width/ratio).toFixed(1));
}

