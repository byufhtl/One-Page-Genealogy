/**
 * Created by jared on 02/09/16.
 */

$(document).ready(function() {
    $("#uploadFile").change(inputChanged)
});

var optionManager = null;

function inputChanged(data) {
    var input = data.target.files[0];
    var reader = new FileReader();

    var result;

    function readFile(e){
        result = reader.result;

        //var boxes = JSON.parse(result);
        document.getElementById('opg-chart').innerHTML = "";

        if(optionManager === null){
            optionManager = new OptionManager();
        }

        //console.log(result);
        var map = JSON.parse(result);
        var pipeline = [];

        //console.log(map);

        for(var key in map){
            switch(key){
                case 'type':
                    var type = map[key];
                    break;
                case 'root':
                    var rootPID = map[key];
                    break;
                case 'generations':
                    var numGenerations = parseInt(map[key]);
                    break;
                case 'direction':
                    console.log(key);
                    var direction = map[key];
                    break;
                case 'AscColorSpacer':
                    pipeline.push(new AscColorSpacer());
                    break;
                case 'CollapseSpacer':
                    var collapseSpacer = new CollapseSpacer();
                    collapseSpacer.setCustomMap(map[key]['customMap']);
                    pipeline.push(collapseSpacer);
                    break;
                case 'CustomColorSpacer':
                    var customColorSpacer = new CustomColorSpacer();
                    customColorSpacer.setCustomMap(map[key]['customMap']);
                    pipeline.push(customColorSpacer);
                    break;
                case 'CustomSpacer':
                    var customSpacer = new CustomSpacer();
                    customSpacer.setCustomMap(map[key]['customMap']);
                    pipeline.push(customSpacer);
                    break;
                case 'CustomTextColorSpacer':
                    var customTextColorSpacer = new CustomTextColorSpacer();
                    customTextColorSpacer.setCustomMap(map[key]['customMap']);
                    pipeline.push(customTextColorSpacer);
                    break;
                case 'SpacingSpacer':
                    pipeline.push(new SpacingSpacer());
                    break;
                case 'VertDetChartSpacer':
                    pipeline.push(new VertDetChartSpacer());
                    break;
                case 'YSpacer':
                    var ySpacer = new YSpacer();
                    ySpacer.setHigh(map[key]['high']);
                    ySpacer.setLow(map[key]['low']);
                    pipeline.push(ySpacer);
                    break;

            }
        }

        console.log('root: ' + rootPID);
        console.log('gen: ' + numGenerations);
        console.log('direction: ' + direction);
        c = new C({
            //optionManager: optionManager,
            //boxes: boxes,
            //file: true
            rootId: rootPID,
            generations: numGenerations,
            dscOrAsc: direction,
            optionManager: optionManager,
            pipeline: pipeline
        });
    }

    reader.onload = readFile;
    reader.readAsText(input);
}

