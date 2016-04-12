/**
 * Created by jared on 02/09/16.
 */

$(document).ready(function() {
    $("#uploadFile").change(inputChanged)
});

var optionManager = null;
var numGenerations;

function inputChanged(data) {
    var input = data.target.files[0];
    var reader = new FileReader();

    var result;

    function resetOptions(){
        document.getElementById('opg-show-empty').innerHTML = "Show Empty Boxes";
        document.getElementById('opg-edit-spacing').innerHTML = "Edit Spacing";
        $('#edit-spacing-switch').css("display", "none");
        $('.BSswitch').bootstrapSwitch('state', true);
        $('#country-legend').css('display', 'none');
        $('#ruler-height').val("");
        $('#country-legend').css("width", "0%");
        $('#opg-chart').css("width", "100%");
    }

    function readFile(e){
        resetOptions();
        
        result = reader.result;

        //var boxes = JSON.parse(result);
        document.getElementById('opg-chart').innerHTML = "";

        if(optionManager === null){
            optionManager = new OptionManager();
        }

        //console.log(result);
        var map = JSON.parse(result);

        var type = map['type'];
        var direction = map['direction'];
        var root = map['root'];
        numGenerations = map['generations'];
        var stylingPipeline = map['stylingPipeline'];
        var boxes = map['boxes'];

        //console.log(map);

        console.log('root: ' + root);
        console.log('gen: ' + numGenerations);
        console.log('direction: ' + direction);
        console.log('chartType: ' + type);

        //localStorage.setItem("numGenerations", numGenerations);
        //localStorage.setItem("rootPID", root);
        //localStorage.setItem("direction", direction);
        //localStorage.setItem("chartType", type);
        //localStorage.setItem("load", true);

        c = new C({
            //optionManager: optionManager,
            boxes: boxes,
            file: true,
            rootId: root,
            generations: numGenerations,
            dscOrAsc: direction,
            optionManager: optionManager,
            pipeline: stylingPipeline,
        });
        $("#uploadFile").val(null);
    }

    reader.onload = readFile;
    reader.readAsText(input);
}

