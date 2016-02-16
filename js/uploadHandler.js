/**
 * Created by jared on 02/09/16.
 */

$(document).ready(function() {
    $("#svgFile").change(inputChange)
});

var optionManager = null;

function inputChange(data) {
    var input = data.target.files[0];
    var reader = new FileReader();

    var result;

    function readFile(e){
        result = reader.result;

        var boxes = JSON.parse(result);
        document.getElementById('opg-chart').innerHTML = "";

        if(optionManager === null){
            optionManager = new OptionManager();
        }

        c = new C({
            optionManager: optionManager,
            boxes: boxes,
            file: true
        });
    }

    reader.onload = readFile;
    reader.readAsText(input);
}

