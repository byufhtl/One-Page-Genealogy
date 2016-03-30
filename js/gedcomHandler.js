/**
 * Created by justinrasband on 8/13/15.
 */
var c = null;
var optionManager = null;
var gedcom = new GEDCOM();
var indiMap = {};
var numGenerations;


$(document).ready(function() {
    $("#myInput").change(inputChange)
});

function inputChange(data) {
    //console.log(data.target.files[0])
    var gedInput = data.target.files[0];
    var reader = new FileReader();
    var gedString = "";

    function readFile(e){
        gedString = reader.result
        if (gedString.charCodeAt(0) == 65279) gedString = gedString.substring(1);
        var output = gedcom.parse(gedString);
        useData(output)

    }

    reader.onload = readFile;
    reader.readAsText(gedInput);
};

function useData(gedOutput){

    var jReader = new JSONREADER(gedOutput)
    indiMap = null
    indiMap = jReader.getIndividuals()

    $('#gedcomModal').on('show.bs.modal',setOptions);

    function setOptions(e){

        var gedSelect = $('#gedcomSelect')

        //make alphabetized array of individuals for display
        var indiArray = []
        for(var key in indiMap) {
            if(key != "latestIndi" && key != "oldestIndi"){
                if(indiMap[key].hasOwnProperty("dscBranchIds") || indiMap[key].hasOwnProperty("ascBranchIds")){
                    indiArray.push(indiMap[key])
                }
            }
        }

        indiArray.sort(function (a, b) {

            var aFirst = getFirstName(a);
            var aLast = getLastName(a);
            var bFirst = getFirstName(b);
            var bLast = getLastName(b);

            if(a.pid == indiMap["oldestIndi"] || a.pid == indiMap["latestIndi"]){
                return -1
            }else if(b.pid == indiMap["oldestIndi"] || b.pid == indiMap["latestIndi"]){
                return 1
            }

            if(aLast > bLast){
                return 1;
            }else if(aLast < bLast){
                return -1;
            }else if(aFirst > bFirst){
                return 1;
            }else if(aFirst < bFirst){
                return -1;
            }
            return 0;

        });


        //add each individual as an option to gedcomSelect element
        for(var k = 0; k < indiArray.length;k++){
            var key = indiArray[k].pid

            if(indiMap[key].hasOwnProperty('pid')) {

                var selectorString = String(key)
                var optionString = "";
                optionString = getDisplayName(indiMap[key].name)
                optionString = optionString + selectorString

                if(key == indiMap["latestIndi"]){
                    optionString = optionString + " MOST RECENT"
                }else if(key == indiMap["oldestIndi"]){
                    optionString = optionString + " OLDEST"
                }

                var optionNode = $("<option></option>").text(optionString).html();

                if(key == indiMap["latestIndi"]){
                    $('#gedcomSelect').append($('<option>', {
                        value: selectorString,
                        text: optionNode,
                        selected:true
                    }));
                }else{
                    $('#gedcomSelect').append($('<option>', {
                        value: selectorString,
                        text: optionNode
                    }));
                }

            }
        }

        //add 20 generations options to generationsSelect
        for(var j = 1; j <=20;j++ ){
            if(j == 8){
                $('#generationsSelect').append($('<option>', {
                    value: j,
                    text: j,
                    selected: true
                }));
            }else{
                $('#generationsSelect').append($('<option>', {
                    value: j,
                    text: j
                }));
            }

        }

        function getLastName(a){

            var aLast = "";
            if(a.hasOwnProperty("surname")){
                aLast = a.surname.toLowerCase();

            }else if (a.hasOwnProperty("name")){
                var fullname = a.name
                var nameSplit = fullname.split(" ")
                aLast = nameSplit[(nameSplit.length-1)].toLowerCase();

            }else{
                alast = "{"

            }

            var finalname = "";
            //takes out the '/' symbol used in gedcoms to designate last name
            for(var j = 0; j < aLast.length;j++){
                if(aLast[j] != "/"){
                    finalname = finalname + aLast[j]
                }
            }
            aLast = finalname

            if(aLast.length == 0){
                aLast = "{"
            }

            return aLast
        }

        function getFirstName(a){

            var aFirst = "";
            if(a.hasOwnProperty("given")){
                aFirst = a.given.toLowerCase();

            }else if (a.hasOwnProperty("name")){
                var fullname = a.name
                var nameSplit = fullname.split(" ")
                aFirst = nameSplit[0].toLowerCase();

            }else{
                aFirst = "{"

            }

            if(aFirst.length == 0){
                aFirst = "{"
            }

            return aFirst
        }


        function getDisplayName(name){

            var toReturn = "";
            var splitName = name.split("/")
            var lastName = ""
            var firstName = ""

            if(splitName.length >1){
                lastName = splitName[(splitName.length-2)]
            }else{
                splitName = name.split(" ")
                lastName = splitName[(splitName.length-1)]
            }

            firstName = splitName[0]
            splitName = firstName.split(" ")

            if(splitName.length > 5){
                firstName = splitName[0] + " " + splitName[1]
            }

            return lastName + ", " + firstName
        }

    }//end setOptionsfunction


    $('#gedcomModal').modal({
        backdrop: 'static',
        keyboard: false
    })

    $('#gedcomModal').show()

    function resetOptions(){
        document.getElementById('opg-show-empty').innerHTML = "Show Empty Boxes";
        document.getElementById('opg-edit-spacing').innerHTML = "Edit Spacing";
        $('#edit-spacing-switch').css("display", "none");
        $('.BSswitch').bootstrapSwitch('state', true);
        $('#country-legend').css('display', 'none');
        $('#ruler-height').val("");
    }

    $('#gedcomSave').click(function(){
        localStorage.setItem("chartType", "Gedcom");
        $('#gedcomModal').hide();

        var dscOrAsc = $('input[name=ascOrDsc]:checked').val();
        var rootId = $("option:selected", ('#gedcomSelect'))[0].value;
        var generations = $("option:selected", ('#generationsSelect'))[0].value;

        localStorage.setItem("rootPID", rootId);
        numGenerations = generations;

        var chartSVGElement = cloneRemove(document.getElementById("opg-chart"))
        while (chartSVGElement.lastChild) {
            chartSVGElement.removeChild(chartSVGElement.lastChild);
        }

        resetOptions();

        if(optionManager === null){
            optionManager = new OptionManager();
        }
        c = new C({
            rootId: rootId,
            gedData: indiMap,
            generations: generations,
            dscOrAsc: dscOrAsc,
            optionManager: optionManager
        });

        var gedcomSelectElement = cloneRemove(document.getElementById('gedcomSelect'))
        while (gedcomSelectElement.lastChild) {
            gedcomSelectElement.removeChild(gedcomSelectElement.lastChild);
        }

        var genSelectElement = cloneRemove(document.getElementById("generationsSelect"))
        while (genSelectElement.lastChild) {
            genSelectElement.removeChild(genSelectElement.lastChild);
        }


        document.getElementById("generationsRadio").checked = true;

        //cloneRemove(document.getElementById("generationsRadio"))
        cloneRemove(document.getElementById("gedcomSave"))
        cloneRemove(document.getElementById("gedcomModal"))
        cloneRemove(document.getElementById("myInput"))


        $("#myInput").change(inputChange)

        //removes listeners of an element via cloning
        function cloneRemove(element){
            var new_element = element.cloneNode(true);
            element.parentNode.replaceChild(new_element,element)
            return new_element
        }

    })//end gedcomSave .click function




}