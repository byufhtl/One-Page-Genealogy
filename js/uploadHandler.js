/**
 * Created by jared on 02/09/16.
 */

$(document).ready(function() {
    $("#svgFile").change(inputChanged)
});

var optionManager = null;

function inputChanged(data) {
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

        console.log(boxes);
        c = new C({
            optionManager: optionManager,
            boxes: boxes,
            file: true
        });
    }

    reader.onload = readFile;
    reader.readAsText(input);
}

