/**
 * Created by jared on 1/11/16.
 */


var c = null;
var token;
if (window.location.href.indexOf("fstoken") > -1) {
    var url = window.location.href;
    var a = $('<a>', {href: url})[0];
    var jwt = a.search.slice(a.search.indexOf('=') + 1, -1);
    token = JSON.parse(atob(jwt.split('.')[1]))['fs_access_token'];
}
FamilySearch.init({

    app_key: "NQ3Q-PBD8-LL9N-RCLZ-MZCZ-X7P8-7SMX-RD6N", //<-rf product key //"a02j000000AiDyvAAF",//
    environment: 'production', //'sandbox',//
    auth_callback: 'http://localhost:8000/auth/login/return/',
    http_function: $.ajax,
    deferred_function: $.Deferred,
    access_token: token,
    auto_signin: true,    //<-put these back in when we get our own production key
    save_access_token: true,
    auto_expire: true
});

$(document).ready(function () {

    if (localStorage.getItem("numGenerations") && FamilySearch.hasAccessToken()) {
        fsHideFirstModal();
    } else if (localStorage.getItem("numGenerations")) {
        localStorage.removeItem("numGenerations");
        localStorage.removeItem("pid");
        localStorage.removeItem("direction");
    }

    //$("#fsModal").show();
    //window.location = 'login';
    $("#fsbutton").click(familySearchDownload)
    $("#tofsbutton").click(fsHideFirstModal)
    //$("#logoutbutton").click(logout)

});
function fsHideFirstModal() {
    $('#downloadModal').hide();
    familySearchDownload();
}

function familySearchDownload() {
    var numGenerations;
    var pid;
    var direction;

    if (localStorage.getItem("numGenerations")) {
        numGenerations = localStorage.getItem("numGenerations");
        pid = localStorage.getItem("pid");
        direction = localStorage.getItem("direction");
        localStorage.removeItem("numGenerations");
        localStorage.removeItem("pid");
        localStorage.removeItem("direction");
        download();
    } else {
        $('#fsModal').modal({
            backdrop: 'static',
            keyboard: false
        })
        $('#fsModal').show();
        $('#fsSave').click(function () {
            pid = document.getElementById("pid-search-input").value;
            numGenerations = $("option:selected", ('#fsGenerationsSelect'))[0].value;
            direction = $('input[name=FSascOrDsc]:checked').val();
            download();
        });
    }

    function download() {
        var isValidPid = false;
        if (pid === '')
            isValidPid = true;
        else {
            pid = pid.toUpperCase();
            //console.log(pid);
            //var regexp = new RegExp(/([A-Z]|[0-9]){4}-([A-Z]|[0-9]){3}/);
            isValidPid = /([A-Z]|[0-9]){4}-([A-Z]|[0-9]){3}/.test(pid);//regexp.test(pid);
        }

        if (isValidPid) {
            //$('#fsModal').hide();

            if (!FamilySearch.hasAccessToken()) {
                localStorage.setItem("numGenerations", $("option:selected", ('#fsGenerationsSelect'))[0].value);
                localStorage.setItem("pid", pid);
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

    function continueExecution() {
        FamilySearch.getAccessToken().then(function (response) {
            FamilySearch.getCurrentUser().then(function (response) {
                var old_element = document.getElementById("opg-chart")
                var new_element = old_element.cloneNode(true);
                old_element.parentNode.replaceChild(new_element, old_element)
                while (new_element.lastChild) {
                    new_element.removeChild(new_element.lastChild);
                }
                //var pid = document.getElementById("pid-search-input").value;
                //var generations = $("option:selected", ('#fsGenerationsSelect'))[0].value;
                //var dscOrAsc = $('input[name=FSascOrDsc]:checked').val();
                var user = response.getUser();
                if (pid === '')
                    pid = user.personId;
                //we need to turn off old listeners before we create a new c.
                $('#opg-download').off('click');
                $('#fsSave').off('click');
                $('#fsGenerationsSelect').off('click');
                $('fsgenerationsRadio').off('click');
                c = new C({
                    rootId: pid,
                    generations: numGenerations,
                    dscOrAsc: direction
                })
                $('#fsModal').hide();
            })
        })
    }
}

