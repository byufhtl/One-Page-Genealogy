///<reference path="IOptionManager.ts"/>
///<reference path="../model/IBox.ts"/>
///<reference path="../controller/BoxMap.ts"/>
///<reference path="../view/BoxStyleFactory.ts"/>
///<reference path="../js/jsDeclarations.ts"/>
///<reference path="../view/boxRenderers/Renderer.ts"/>
///<reference path="../sources/BuildNode.ts"/>
///<reference path="PrivatePersonUtils.ts"/>

/**
 * Created by curtis on 3/19/15.
 */

declare function familySearchDownload(): void;

class OptionManager implements IOptionManager {
    private static DISPLAY_PADDING:number = 5;

    private listener: IOptionListener;

    private customSize:boolean;
    private customColor:boolean;

    private rotation:number = 0;

    private customNodeIndex :number;

    private direction: string;

    constructor() {
        var self = this;
        this.direction = "ascendancy";
        this.customSize = false;
        this.customColor = false;
        this.customNodeIndex = 1111; // Has to be at least three digits long to create a valid PID.

        $('#opg-rotate-cc').click(function(){
            self.listener.handleOption('rotate', {value: -Math.PI/2});
        });
        $('#opg-rotate-c').click(function(){
            self.listener.handleOption('rotate', {value: Math.PI/2});
        });
        $('#opg-download').click(function(){
            self.listener.handleOption('request-download', null);
        });
        $('#opg-save').click(function() {
            self.listener.handleOption('save', null);
        });
        $('#opg-ruler').click(function() {
            self.listener.handleOption('ruler', null);
        });
        $('#ruler-save').click(function() {
            self.listener.handleOption('ruler-save', null);
        });
        $('#ruler-hide').click(function() {
            self.listener.handleOption('ruler-hide', null);
        });
        //~~~ Color Schemes ~~~

        $('#opg-to-greyscale').click(function(){
            self.handleStyleChange('to-greyscale',false);
        });
        $('#opg-to-branch-color').click(function(){
            self.handleStyleChange('to-branch-color',false);
        });
        $('#opg-to-branch-color-blackout').click(function(){
            self.handleStyleChange('to-branch-color-blackout',false);
        });
        $('#opg-to-branch-color-bold').click(function(){
            self.handleStyleChange('to-branch-color-bold',false);
        });
        $('#opg-to-branch-color-gray').click(function(){
            self.handleStyleChange('to-branch-color-gray',false);
        });
        $('#opg-to-generation-color-warm').click(function(){
            self.handleStyleChange('to-generation-color-warm',false);
        });
        $('#opg-to-generation-color-cold').click(function(){
            self.handleStyleChange('to-generation-color-cold',false);
        });
        $('#opg-to-generation-color-vibrant').click(function(){
            self.handleStyleChange('to-generation-color-vibrant',false);
        });
        $('#opg-to-generation-wood').click(function(){
            self.handleStyleChange('to-generation-wood',false);
        });
        $('#opg-to-gender-color').click(function(){
            self.handleStyleChange('to-gender-color',false);
        });
        $('#opg-to-country-color').click(function(){
            self.handleStyleChange('to-country-color', false);
        });

        //~~~ Other ~~~

        $('#male-radio').click(() => {
            //male_button.prop("checked",true);
            $('#s-female-radio').prop("checked",true);
            //female_button.prop("checked",false);
        });
        $('#female-radio').click(() => {
            //female_button.prop("checked",true);
            $('#s-male-radio').prop("checked",true);
            //male_button.prop("checked",false);
        });
        $('#unknown-radio').click(() => {
            //unknown_button.prop("checked",true);
            $('#s-unknown-radio').prop("checked",true);
            //male_button.prop("checked",false);
        });

        $('#modal-show-empty').click(() => {
            $('#showEmptyModal').modal('hide');
            self.listener.handleOption('show-empty', {recurse: true});
        });
        $('#modal-show-fruit').click(() => {
            $('#showEmptyModal').modal('hide');
            self.listener.handleOption('show-empty', {recurse: false});
        });

        $('#opg-show-empty').click(() => {
            if (document.getElementById('opg-show-empty').innerHTML === "Show Empty Boxes") {
                if(this.direction == "ascendancy"){
                    $('#showEmptyModal').modal('show');
                }
                else{
                    $('#modal-show-fruit').click();
                }
                //$('#showEmptyModal').modal('show');
            }
            else{
                self.listener.handleOption('hide-empty', null);
            }
        });
        $('#opg-show-duplicates').click(() => {
            self.listener.handleOption('show-duplicates', null);
        });
        $('#opg-edit-spacing').click(() => {
            if (document.getElementById("opg-edit-spacing").innerHTML === "Edit Spacing") {
                self.listener.handleOption('edit-spacing', null);
            }else{
                self.listener.handleOption('done-editing-spacing', null);
            }
        });
        $('#edit-spacing-switch').on('switchChange.bootstrapSwitch', function(event, state) {
            self.listener.handleOption('edit-spacing-switch-changed', {state: state});
        });
        $('#statistics-button').click(() => {
            self.listener.handleOption('show-statistics', null);
        });
        $('#statistics-modal-close').click(() => {
            self.listener.handleOption('hide-statistics', null);
        });
        $('#find-button').click(() => {
            $('#box-finder-modal').show();
        });
        $('#box-finder-modal-close').click(() => {
            $('#box-finder-modal').hide();
        });
        $('#box-finder-modal-seek').click(() => {
            var id = $('#box-finder-search-input').val();
            console.log(id);
            self.listener.handleOption('find-box-by-id', id);
        });
        $('#recenter-button').click(() => {
            self.listener.handleOption('recenter-chart', null);
        });
        $('#style-dropdown').click(() => {
            var style_menu = $('#style-menu');
            var direction = $('input[name=FSascOrDsc]:checked').val();
            var dropdown = $('#style-dropdown');
            if(direction !== dropdown.val()) {
                style_menu.empty();
                if (this.direction == "ascendancy") {
                    style_menu.append('<li><a id="opg-detail-style" href="#">Full Detail Style</a></li>');
                    style_menu.append('<li><a id="opg-reunion-style" href="#">Family Reunion Style</a></li>');
                    style_menu.append('<li><a id="opg-extended-style" href="#"><span class="label label-warning">new</span> Extended Style (13+ Generations)</a></li>');
                    style_menu.append('<li><a id="opg-vertical-style" href="#">Vertical Detail Style (Default)</a></li>');
                    style_menu.append('<li><a id="opg-vertical-style-accent" href="#"><span class="label label-warning">new</span> Vertical Detail Accent Style</a></li>');
                    style_menu.append('<li><a id="opg-bubble-style" href="#"><span class="label label-warning">new</span> Bubble Style</a></li>');
                    style_menu.append('<li><a id="opg-var-depth-style" href="#"><span class="label label-warning">new</span> Variable Depth Style</a></li>');
                    style_menu.append('<li><a id="opg-eight-eleven-style" href="#">8 1/2 x 11 Style</a></li>');
                    style_menu.append('<li><a id="opg-eight-eleven-detail-style" href="#">8 1/2 x 11 Detail Style</a></li>');
                    style_menu.append('<li><a id="opg-eleven-seventeen-style" href="#"><span class="label label-warning">new</span> 11 x 17 Style</a></li>');

                    $('#opg-detail-style').click(function(){
                        self.handleStyleChange('detail-style');
                    });
                    $('#opg-reunion-style').click(function(){
                        self.handleStyleChange('reunion-style');
                    });
                    $('#opg-vertical-style').click(function(){
                        self.handleStyleChange('vertical-style');
                    });
                    $('#opg-vertical-style-accent').click(function(){
                        self.handleStyleChange('vertical-style-accent');
                    });
                    $('#opg-bubble-style').click(function(){
                        self.handleStyleChange('bubble-style');
                    });
                    $('#opg-var-depth-style').click(function(){
                        self.handleStyleChange('var-depth-style');
                    });
                    $('#opg-eight-eleven-style').click(function(){
                        self.handleStyleChange('eight-eleven-style');
                    });
                    $('#opg-eight-eleven-detail-style').click(function(){
                        self.handleStyleChange('eight-eleven-detail-style');
                    });
                    $('#opg-eleven-seventeen-style').click(function(){
                        self.handleStyleChange('eleven-seventeen-style');
                    });
                    $('#opg-extended-style').click(function(){
                        self.handleStyleChange('extended-style');
                    });
                }
                else if (this.direction == "descendancy"){
                    style_menu.append('<li><a id="opg-js-public-style" href="#">Vertical Descendancy Style (Default)</a></li>');
                    style_menu.append('<li><a id="opg-js-reunion-public-style" href="#">Family Reunion Descendancy Style</a></li>');
                    style_menu.append('<li><a id="opg-js-var-depth-style" href="#"><span class="label label-warning">new</span> Variable Depth Descendancy Style</a></li>');

                    $('#opg-js-public-style').click(function(){
                        self.handleStyleChange('js-public-style');
                    });
                    $('#opg-js-reunion-public-style').click(function(){
                        self.handleStyleChange('js-reunion-public-style');
                    });
                    $('#opg-js-var-depth-style').click(function(){
                        self.handleStyleChange('js-var-depth-style');
                    });
                }
                else{
                    console.log("Bad Direction: [" + this.direction+"]!");
                }
                dropdown.val(direction);
            }
        });
    }

    handleOptionSetting(type:String, data:any): void {
        var self = this;
        if(type === 'selectIndividual') {
            var box:IBox = data.box.copy();
            var colonLoc = box.getNode().getId().indexOf(':');

            var primary = $('#primary-node-information');
            var secondary = $('#secondary-node-information');

            primary.empty();
            secondary.empty();

            //~~~ Change the add button to display parent/child status

            let private_add = $('#opg-modal-add-private');
            if(this.direction === "ascendancy"){
                if(box.getNode().getBranchIds().length < 2){
                    private_add.show();
                    private_add.text("Add Parent");
                }
                else {
                    private_add.hide();
                }
            }
            else{
                private_add.show();
                private_add.text("Add Child");
            }

            //~~~ Append Private Node Editing buttons as appropriate~~~

            var private_edit = $('#opg-modal-private-edit-div');
            var private_remove = $('#opg-modal-private-remove-div');
            private_edit.empty();
            private_remove.empty();

            if(PrivatePersonUtils.isCustomId(box.getNode().getId())){
                private_edit.append('<button type="button" class="btn btn-footer" id="opg-modal-edit-private" style="float: left;">Edit Node</button>');
                if(box.getNode().getBranchIds().length === 0) {
                    private_remove.append('<button type="button" class="btn btn-footer" id="opg-modal-remove-private" style="float: left;">Remove Node</button>');
                }
            }

            //~~~ Append the place for names and information ~~~

            primary.append('<div id="p-data-col" class="col-sm-9"></div>');

            var prim_data = $('#p-data-col');

            prim_data.append('<div class="row"><div id="name" style="font-size: 32px;"></div></div>');
            prim_data.append('<div id="p-b-d-row" class="row"><div class="col-sm-2 right-justified">Birth:</div></div>');
            $('#p-b-d-row').append('<div class="col-sm-10 left-justified"><div id="bdate" class="row"></div><div id="bplace" class="row"></div></div>');
            prim_data.append('<div id="p-d-d-row" class="row"><div class="col-sm-2 right-justified">Death:</div>');
            $('#p-d-d-row').append('<div class="col-sm-10 left-justified"><div id="ddate" class="row"></div><div id="dplace" class="row"></div></div></div>');

            primary.append('<div class="col-sm-3 right"><svg id="opg-modal-portrait"></svg></div>');

            // Render a bit differently for spouse boxes than for regular boxes
            if(box.getRenderInstructions().getSpouseNameInstruction()){

                //~~~ Append the spouse Elements into the modal window as necessary ~~~
                var primaryNode   = (box.getNode().getAttr('gender') === 'Male') ? box.getNode() : box.getNode().getDisplaySpouse();
                var secondaryNode = (box.getNode().getAttr('gender') === 'Female') ? box.getNode() : box.getNode().getDisplaySpouse();

                secondary.append('<div id="s-data-col" class="col-sm-9"></div>');

                var second_data = $('#s-data-col');

                second_data.append('<div class="row"><div id="s-name" style="font-size: 32px;"></div></div>');
                second_data.append('<div id="s-b-d-row" class="row"><div class="col-sm-2 right-justified">Birth:</div></div>');
                $('#s-b-d-row').append('<div class="col-sm-10 left-justified"><div id="s-bdate" class="row"></div><div id="s-bplace" class="row"></div></div>');
                second_data.append('<div id="s-d-d-row" class="row"><div class="col-sm-2 right-justified">Death:</div>');
                $('#s-d-d-row').append('<div class="col-sm-10 left-justified"><div id="s-ddate" class="row"></div><div id="s-dplace" class="row"></div></div></div>');

                secondary.append('<div class="col-sm-3 right"><svg id="s-opg-modal-portrait"></svg></div>');

                //~~~ Setup the Ids ~~~
                var p_id = primaryNode.getId().substr(0,colonLoc);
                if(PrivatePersonUtils.isCustomId(primaryNode.getId())){
                    p_id = "Private Person";
                }
                else if (!p_id || p_id == ''){
                    p_id = primaryNode.getAttr('name') + " (No ID found)";
                }
                var s_id = secondaryNode.getId().substr(0,colonLoc);
                if(PrivatePersonUtils.isCustomId(secondaryNode.getId())){
                    s_id = "Private Person";
                }
                else if (!s_id || s_id == ''){
                    s_id = secondaryNode.getAttr('name') + " (No ID found)";
                }

                $('#pid').text("Personal Information for " + p_id + " and " + s_id);
                $('#name').text(primaryNode.getAttr("name"));
                $('#bdate').text(primaryNode.getAttr("birthdate"));
                $('#bplace').text(primaryNode.getAttr("birthplace"));
                $('#ddate').text(primaryNode.getAttr("deathdate"));
                $('#dplace').text(primaryNode.getAttr("deathplace"));

                $('#s-name').text(secondaryNode.getAttr("name"));
                $('#s-bdate').text(secondaryNode.getAttr("birthdate"));
                $('#s-bplace').text(secondaryNode.getAttr("birthplace"));
                $('#s-ddate').text(secondaryNode.getAttr("deathdate"));
                $('#s-dplace').text(secondaryNode.getAttr("deathplace"));
            }
            else{

                var id = box.getNode().getId().substr(0,colonLoc);
                if(!id || id == ""){
                    if(PrivatePersonUtils.isCustomId(box.getNode().getId())){
                        id = "Private Person";
                    }
                    else {
                        id = box.getNode().getAttr('name') + " (No ID found)";
                    }
                }
                $('#pid').text("Personal Information for " + id);
                $('#name').text(box.getNode().getAttr("name"));
                $('#bdate').text(box.getNode().getAttr("birthdate"));
                $('#bplace').text(box.getNode().getAttr("birthplace"));
                $('#ddate').text(box.getNode().getAttr("deathdate"));
                $('#dplace').text(box.getNode().getAttr("deathplace"));
            }
            $('#opg-modal').modal('show');

            setTimeout(function(){
                self.renderTempBox(box);
                if(box.getRenderInstructions().getSpouseNameInstruction() && box.getRenderInstructions().getSpousePictureDimInstruction()){
                    self.renderTempPortriat(primaryNode, $('#opg-modal-portrait')[0], 130, 130);
                    self.renderTempPortriat(secondaryNode, $('#s-opg-modal-portrait')[0], 130, 130);
                }
                else {
                    self.renderTempPortriat(box.getNode(), $('#opg-modal-portrait')[0], 130, 130);
                }
                var longer = (box.getHeight() > box.getWidth()) ? box.getHeight() : box.getWidth();
                if(longer > 1000 ){
                    $('modal-dialog-box').css('width',(longer+50).toString());
                }
            },0);

            $('#box-color-picker').spectrum({
                color: box.getColor(),
                clickoutFiresChange: true,
                change: function(color){
                    box.setColor(color.toHexString());
                    self.renderTempBox(box);
                }
            });

            $('#box-text-color-picker').spectrum({
                color: box.getTextColor(),
                clickoutFiresChange: true,
                change: function(color){
                    box.setTextColor(color.toHexString());
                    self.renderTempBox(box);
                }
            });

            this.handleButtonInit(box);
        }
        if(type === 'selectStyle') {
            $('#opg-modal').modal('show');
            setTimeout(function(){
                self.renderTempBox(box);
            },400);

            //var generations = data.generations;
        }
        return;
    }

    private renderTempBox(box: IBox) {
        var opgModalSvg = $('#opg-modal-svg');
        opgModalSvg.empty();
        var transform = [];
        if(this.rotation % 360 === 0){
            opgModalSvg.height(box.getHeight() + OptionManager.DISPLAY_PADDING*2);
            opgModalSvg.width(box.getWidth() + OptionManager.DISPLAY_PADDING*2);
        }else if(this.rotation % 270 === 0){
            opgModalSvg.width(box.getHeight() + OptionManager.DISPLAY_PADDING*2);
            opgModalSvg.height(box.getWidth() + OptionManager.DISPLAY_PADDING*2);
            transform.push("translate(0," + box.getWidth() +')');
        }else if(this.rotation % 180 === 0){
            opgModalSvg.height(box.getHeight() + OptionManager.DISPLAY_PADDING*2);
            opgModalSvg.width(box.getWidth() + OptionManager.DISPLAY_PADDING*2);
            transform.push("translate(" + box.getWidth() + ',' + box.getHeight() + ")");
        }else{
            opgModalSvg.width(box.getHeight() + OptionManager.DISPLAY_PADDING*2);
            opgModalSvg.height(box.getWidth() + OptionManager.DISPLAY_PADDING*2);
            transform.push("translate(" + box.getHeight() + ',0)');
        }
        var g = opgModalSvg[0];
        g.setAttribute("style", "font-family: 'Roboto Slab' ");
        g = Renderer.renderBox(box, g);
        transform.push("translate("+OptionManager.DISPLAY_PADDING+", "+OptionManager.DISPLAY_PADDING+")");
        transform.push('rotate('+ this.rotation +')');

        g.setAttribute("transform", transform.join(' '));
    }

    /**
     * Clears out the g element passed in and then puts the portrait into it.
     */
    private renderTempPortriat(node :INode, g :Element, width :number, height : number){
        while(g.lastChild){
            g.removeChild(g.lastChild);
        }
        Renderer.renderPortrait(node, width, height, g);
    }

    private handleStyleChange(changeType:string, sizeChange:boolean = true){
        if((this.customColor && !sizeChange) || (this.customSize && sizeChange)){
            this.displayWarning(changeType,sizeChange);
        }
        else {
            if(changeType === 'to-country-color') {
                //pass the callback
                var colorMap = this.setCountryColors(this.listener.getBoxes());
                this.listener.handleOption(changeType, colorMap);
                this.setupCountryColorLegend(colorMap);
            }else {
                this.listener.handleOption(changeType, null);
            }
        }
    }

    private handleButtonInit(box: IBox){

        var self = this;

        var opgModalSelect = $('#opg-modal-select');
        var opgModalSizeSave = $('#opg-modal-save-size');
        var opgModalColorSave = $('#opg-modal-save-color');
        var opgModalCollapse = $('#opg-modal-collapse');
        var opgModalFSview = $('#FS-view');
        var opgModalVPview = $('#VP-view');
        var setAsRoot = $('#set-as-root');

        // Must deactivate old responses or you will get duplicates.
        opgModalSelect.off('click');
        opgModalSizeSave.off('click');
        opgModalColorSave.off('click');
        opgModalCollapse.off('click');
        opgModalFSview.off('click');
        opgModalVPview.off('click');
        setAsRoot.off('click');

        setAsRoot.click(() => {
            var colonLoc = box.getNode().getId().indexOf(':');
            var pid :string;
            if(box.getNode().isMainPerson() || (!box.getSpouseNode())) {
                pid = box.getNode().getId().substr(0, colonLoc);
            }
            else if(box.getSpouseNode()){
                pid = box.getSpouseNode().getId();
            }

            if (pid != null && pid != ""){
                $("#opg-modal").modal('hide');
                //if(pid.match(RegExp("@[^@]+@"))){
                //    $('#myInput').click();
                //}
                //else
                if(!PrivatePersonUtils.isCustomId(pid)) {
                    $('#pid-search-input').val(pid);
                    $('#treeRt-other').prop('selected', true);
                    $('#relative-tree-downloader').show();

                    var downloadBack = $('#fsDwldBack');
                    downloadBack.off('click');
                    downloadBack.click(function(){
                        $('#fsModal').hide();
                    });
                    familySearchDownload();
                }
            }
        });

        if(localStorage.getItem("chartType") === "FamilySearch") {

            opgModalFSview.show();
            opgModalVPview.show();

            opgModalFSview.click(() => {
                var pid = box.getNode().getId().substring(0, 8);
                if (!PrivatePersonUtils.isCustomId(pid)) {
                    window.open("https://familysearch.org/tree/#view=ancestor&person=" + pid, '_blank');
                }
            });

            opgModalVPview.click(() => {
                var pid:string = box.getNode().getId().substring(0, 8);
                if (!PrivatePersonUtils.isCustomId(pid)) {
                    self.listener.handleOption('VP-view', {id: pid});
                }
            });
        }
        else{
            opgModalFSview.hide();
            opgModalVPview.hide();
        }

        // Inits the buttons on the detail modal relative to private persons.
        PrivatePersonUtils.initDetailModalButtons(box,this.listener);

        if(box.isCollapsed()) {
            opgModalCollapse.html('Expand');
            opgModalCollapse.click(function() {
                $('#opg-modal').modal('hide');
                self.listener.handleOption("expand-sub-tree", {id: box.getNode().getId(), box: box})
            });
        }
        else {
            opgModalCollapse.html('Collapse');
            opgModalCollapse.click(function() {
                $('#opg-modal').modal('hide');
                self.listener.handleOption("collapse-sub-tree", {id: box.getNode().getId(), box: box})
            });
        }
    }

    private getCountry(country:string) :string {
        if(CountryHash.hasOwnProperty(country)){
            return this.toTitleCase(CountryHash[country]);
        }
        var wordsInCountry = country.split(" ");
        for(var i in wordsInCountry){
            if(CountryList.indexOf(wordsInCountry[i]) > -1){
                return this.toTitleCase(CountryList[CountryList.indexOf(wordsInCountry[i])]);
            }
        }
        return "Unknown";
    }

    private setCountryColors(boxes:BoxMap):{} {
        var colorMap = {"Unknown" : ColorManager.lightgray()};
        for (var id in boxes.getMap()) {
            if (boxes.getMap().hasOwnProperty(id)) {
                var box = boxes.getMap()[id];
                var country = box.getNode().getAttr('birthplace') || box.getNode().getAttr('deathplace') || "Unknown";
                country = country.substr(country.lastIndexOf(",") + 1).trim().toLowerCase().replace(/[^ a-z]/g, '').replace(/\s\s+/g, ' ');
                country = this.getCountry(country);
                if (!colorMap.hasOwnProperty(country)) {
                    colorMap[country] = ColorManager.generateRandomPastel();
                }
            }
        }
        return colorMap;
    }

    private toTitleCase(str:string){
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

    private setupCountryColorLegend(colorMap:{}){
        var sortedKeys = Object.keys(colorMap).sort();
        $('#country-legend').css('display', 'block');
        $('#country-legend').animate({"width":"15%"}, "fast");
        //$('#opg-chart').css("width","85%"); // A good idea, but messes up the clicking in the SVG because of the resulting offset.
        $('#country-color-list').empty();
        for(var i in sortedKeys){
            var country = sortedKeys[i];
            if(colorMap.hasOwnProperty(country) && country){
                var li = document.createElement('li');
                var div = document.createElement('div');
                var color_picker = document.createElement("input");
                color_picker.setAttribute('id', country.replace(/\s+/g, ''));
                div.setAttribute('style', 'float: right');
                //country = country.length > 15 ? country.substr(0, 12) + "..." : country;

                var label = document.createElement("label");
                label.innerHTML = country;
                label.setAttribute("for", country.replace(/\s+/g, ''));

                div.appendChild(color_picker);
                li.appendChild(div);
                li.appendChild(label);
                document.getElementById('country-color-list').appendChild(li);
                var self = this;
                (function(safeCountry){
                    $("#" + safeCountry.replace(/\s+/g, '')).spectrum({
                        color: colorMap[safeCountry],
                        clickoutFiresChange: true,
                        change: function(newColor){
                            colorMap[safeCountry] = newColor.toHexString();
                            self.listener.handleOption("to-country-color", colorMap);
                        }
                    });
                })(country)

            }
        }

        if(parseInt($("#dragbar").css("height"),10) < parseInt($("#country-color-list").css("height"),10)) {
            $("#dragbar").css("height", $("#country-color-list").css("height"));
        }
    }

    private displayWarning(type : string, sizeBased:boolean){
        console.log('Should show warning modal...');
        var self = this;
        var warningModal = $('#warningModal');
        warningModal.modal('show');
        $('#warning-cancel').click(function(){
            warningModal.modal('hide');
        })
        $('#warning-continue').click(function(){
            self.listener.handleOption(type, null);
            if(sizeBased){
                this.customSize = false;
            }
            else{
                this.customColor = false;
            }
            warningModal.modal('hide');
        })
    }

    setListener(listener: IOptionListener) {
        this.listener = listener;
    }

    public setRotation(r:number){
        this.rotation = r * (180/Math.PI);
    }

    public setDirection(dir :string): void{
        this.direction = dir;
    }

    public getDirection(): string{
        return this.direction;
    }
}