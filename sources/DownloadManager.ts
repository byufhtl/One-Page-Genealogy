///<reference path="../js/jsDeclarations.ts"/>
///<reference path="../controller/IOptionManager.ts"/>
///<reference path="../controller/C.ts"/>
/**
 * Created by calvinmcm on 6/15/16.
 */

declare var token;
declare var numGenerations;
declare var c;

class DownloadManager{

    private static SINGLETON: DownloadManager = null;
    private token;
    private numGenerations: number;
    private optionManager: IOptionManager;
    private c: C = null;

    static inst(){
        if(!this.SINGLETON){
            this.SINGLETON = new DownloadManager();
        }
        return this.SINGLETON;
    }

    constructor(){

    }

    init(manager: IOptionManager){
        var rootPID;
        var direction;
        this.optionManager = manager;
        let self = this;

        if (localStorage.getItem("numGenerations")) {
            numGenerations = localStorage.getItem("numGenerations");
            rootPID = localStorage.getItem("rootPID");
            direction = localStorage.getItem("direction");
            localStorage.removeItem("numGenerations");
            localStorage.removeItem("rootPID");
            localStorage.removeItem("direction");
            if(this.isValidRootID(rootPID)){
                if (!FamilySearch.hasAccessToken() || self.isExpired()) {
                    console.log("Re-queueing for login...", FamilySearch.hasAccessToken(), self.isExpired());
                    self.sendToLogin(rootPID);
                } else {
                    self.download(rootPID, direction);
                }
            }
        } else {
            var fsModal = $('#fsModal');
            fsModal.modal({
                backdrop: 'static',
                keyboard: false
            });

            fsModal.show();

            var fsSave = $('#fsSave');

            if (FamilySearch.hasAccessToken && !this.isExpired()) {
                fsSave.html("Submit");
            } else {
                fsSave.html("Login with FamilySearch");
            }

            fsSave.click(() => {
                rootPID = $("#pid-search-input").val();
                numGenerations = $("option:selected", ('#fsGenerationsSelect'))[0].value;
                direction = $('input[name=FSascOrDsc]:checked').val();
                $('#fsSave').prop('disabled', true);
                if(self.isValidRootID(rootPID)){
                    if (!FamilySearch.hasAccessToken() || self.isExpired()) {
                        self.sendToLogin(rootPID);
                    } else {
                        self.download(rootPID, direction);
                    }
                }
            });
        }
    }

    private isValidRootID(rootPID): boolean{
        var isValidPid = false;
        if (rootPID === '') {
            isValidPid = true;
        }
        else {
            rootPID = rootPID.toUpperCase();
            isValidPid = /([A-Z]|[0-9]){4}-([A-Z]|[0-9]){3}/.test(rootPID);
        }
        if (!isValidPid) {
            alert("Invalid PID.")
        }
        return isValidPid;
    }

    private sendToLogin(rootPID){
        localStorage.setItem("numGenerations", $("option:selected", ('#fsGenerationsSelect'))[0].value);
        localStorage.setItem("rootPID", rootPID);
        localStorage.setItem("direction", $('input[name=FSascOrDsc]:checked').val());
        // This next line is what actually queues the Auth Service, contrary to what looks like is going on above (the independent way of queueing)
        window.location.href = 'https://fhtl.byu.edu/auth?redirect=' + encodeURIComponent(document.location.origin); //'https://fhtl.byu.edu/auth?site=opg&redirect='
    }

    private isExpired(): boolean{
        if(token) {
            console.log("Token expires in " + ((token['exp'] - Date.now() / 1000) / 60).toFixed(2) + " min");
            return token['exp'] < (Date.now() / 1000);
        }else{
            return true;
        }
    }

    private download(rootPID, direction){
        var self = this;

        FamilySearch.getAccessToken().then(function (response) {

            FamilySearch.getCurrentUser().then(function (response) {
                localStorage.setItem("chartType", "FamilySearch");
                var old_element = document.getElementById("opg-chart");
                var new_element = old_element.cloneNode(true);
                old_element.parentNode.replaceChild(new_element, old_element);
                while (new_element.lastChild) {
                    new_element.removeChild(new_element.lastChild);
                }

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


                self.optionManager.setDirection(direction);
                if(c){
                    c.destroy();
                }
                c = new C({
                    rootId: rootPID,
                    generations: numGenerations,
                    dscOrAsc: direction,
                    optionManager: self.optionManager
                });
                localStorage.setItem("rootPID", rootPID);
                $('#fsModal').hide();
                $('#fsSave').prop('disabled', false);
                //$('#navModal').show();
            })
        })
    }

}