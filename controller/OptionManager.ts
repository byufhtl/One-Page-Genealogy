///<reference path="IOptionManager.ts"/>
///<reference path="../model/IBox.ts"/>
///<reference path="../controller/BoxMap.ts"/>
///<reference path="../view/BoxStyleFactory.ts"/>
///<reference path="../js/jsDeclarations.ts"/>
///<reference path="../view/boxRenderers/Renderer.ts"/>
///<reference path="../sources/BuildNode.ts"/>

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
        this.direction = "Ascendancy";
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

        $('#opg-show-empty').click(function(){
            if (document.getElementById('opg-show-empty').innerHTML === "Show Empty Boxes") {
                $('#showEmptyModal').modal('show');
            }else{
                self.listener.handleOption('hide-empty', null);
            }
        });
        $('#modal-show-empty').click(function(){
            $('#showEmptyModal').modal('hide');
            self.listener.handleOption('show-empty', {recurse: true});
        });
        $('#modal-show-fruit').click(function(){
            $('#showEmptyModal').modal('hide');
            self.listener.handleOption('show-empty', {recurse: false});
        });
        $('#opg-show-duplicates').click(function(){
            self.listener.handleOption('show-duplicates', null);
        });
        $('#opg-edit-spacing').click(function(){
            if (document.getElementById("opg-edit-spacing").innerHTML === "Edit Spacing") {
                self.listener.handleOption('edit-spacing', null);
            }else{
                self.listener.handleOption('done-editing-spacing', null);
            }
        });
        $('#edit-spacing-switch').on('switchChange.bootstrapSwitch', function(event, state) {
            self.listener.handleOption('edit-spacing-switch-changed', {state: state});
        });
        $('#style-dropdown').click(function(){
            var style_menu = $('#style-menu');
            var direction = $('input[name=FSascOrDsc]:checked').val();
            var dropdown = $('#style-dropdown');
            if(direction !== dropdown.val()) {
                style_menu.empty();
                if (this.direction === "ascendancy") {
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
                else {
                    style_menu.append('<li><a id="opg-js-public-style" href="#">Vertical Descendancy Style</a></li>');
                    style_menu.append('<li><a id="opg-js-reunion-public-style" href="#">Family Reunion Descendancy Style</a></li>');
                    style_menu.append('<li><span class="label label-warning">new</span><a id="opg-js-var-depth-style" href="#">Variable Depth Descendancy Style (13+ Generations)</a></li>');

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
            if(this.direction === "Ascendancy"){
                private_add.text("Add Parent");
            }
            else{
                private_add.text("Add Child");
            }

            //~~~ Append Private Node Editing buttons as appropriate~~~

            var private_edit = $('#opg-modal-private-edit-div');
            var private_remove = $('#opg-modal-private-remove-div');
            private_edit.empty();
            private_remove.empty();

            if(box.getNode().getId().match(/@OPG.+/i)){
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
                if(primaryNode.getId().match(/@OPG.+/i)){
                    p_id = "Private Node";
                }
                else if (!p_id || p_id == ''){
                    p_id = primaryNode.getAttr('name') + " (No ID found)";
                }
                var s_id = primaryNode.getId().substr(0,colonLoc);
                if(secondaryNode.getId().match(/@OPG.+/i)){
                    s_id = "Private Node";
                }
                else if (!s_id || s_id == ''){
                    s_id = primaryNode.getAttr('name') + " (No ID found)";
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
                    if(box.getNode().getId().match(/@OPG.+/i)){
                        id = "Private Node";
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
        var g = Renderer.renderBox(box, opgModalSvg[0]);
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
            var pid = box.getNode().getId().substr(0,colonLoc);
            if(pid != null && pid != "" && !pid.match(/@OPG.+/i)) {
                $("#opg-modal").modal('hide');
                $('#pid-search-input').val(pid);
                $('#treeRt-other').prop('selected',true);
                $('#relative-tree-downloader').show();
                familySearchDownload();
            }
        });

        opgModalFSview.click(() => {
            var pid = box.getNode().getId().substring(0,8);
            if(!pid.match(/@OPG.+/i)) {
                window.open("https://familysearch.org/tree/#view=ancestor&person=" + pid, '_blank');
            }
        });

        opgModalVPview.click(() => {
            var pid:string = box.getNode().getId().substring(0,8);
            if(!pid.match(/@OPG.+/i)) {
                self.listener.handleOption('VP-view', {id: pid});
            }
        });

        this.initCreateCreator(box);


        // The editor pane for private nodes
        if(box.getNode().getId().match(/@OPG.+/i)) {
            this.initCreateEditor(box);

            this.initCreateRemover(box);
        }

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

    private initCreateCreator(box: IBox){
        // Sets up the creator pane
        let self = this;
        var opgModalCreatePrivateNode = $('#opg-modal-add-private');
        opgModalCreatePrivateNode.off('click');

        opgModalCreatePrivateNode.click(() => {
            $("#opg-modal").modal('hide');
            $('#child-maker-title').text("Create Child for " + box.getNode().getAttr('name'));

            //~~~ Clear Old Values ~~~

            $('#creator-name').val("");
            $('#creator-bdate').val("");
            $('#creator-bplace').val("");
            $('#creator-ddate').val("");
            $('#creator-dplace').val("");

            $('#creator-s-name').val("");
            $('#creator-s-bdate').val("");
            $('#creator-s-bplace').val("");
            $('#creator-s-ddate').val("");
            $('#creator-s-dplace').val("");

            $('#creator-mdate').val("");
            $('#creator-mplace').val("");


            //~~~ Button Configuration ~~~

            // Radio Button Exclusion Setup
            let male_button = $('#male-radio');
            male_button.off('click');
            male_button.prop("checked",true); // set male default
            $('#s-female-radio').prop("checked",true); // set female default
            male_button.click(() => {
                //male_button.prop("checked",true);
                $('#s-female-radio').prop("checked",true);
                //female_button.prop("checked",false);
            });

            let female_button = $('#female-radio');
            female_button.off('click');
            female_button.click(() => {
                //female_button.prop("checked",true);
                $('#s-male-radio').prop("checked",true);
                //male_button.prop("checked",false);
            });

            let unknown_button = $('#unknown-radio');
            unknown_button.off('click');
            unknown_button.click(() => {
                //unknown_button.prop("checked",true);
                $('#s-unknown-radio').prop("checked",true);
                //male_button.prop("checked",false);
            });

            // FS Button
            let button_plug_l = $('#create-bottom-button-plug-left');
            button_plug_l.empty();
            button_plug_l.append('<button type="button" class="btn btn-footer" style="float: left;" id="FS-view-from-create">View Parent on FamilySearch</button>');

            var privateNodeModalFSView = $('#FS-view-from-create');
            privateNodeModalFSView.off('click');

            privateNodeModalFSView.click(function(){
                var pid = box.getNode().getId().substring(0,8);
                if(!pid.match(/@OPG.+/i)) {
                    window.open("https://familysearch.org/tree/#view=ancestor&person=" + pid, '_blank');
                }
            });

            // Create Button
            let button_plug_r = $('#create-bottom-button-plug-right');
            button_plug_r.empty();
            button_plug_r.append('<button type="button" class="btn btn-footer" id="create-private-button">Create</button>');

            var createPrivateNodeButton = $('#create-private-button');
            createPrivateNodeButton.off('click');

            createPrivateNodeButton.click(() => {
                var name_data = $('#creator-name').val();
                var childMakerModal = $('#child-maker-modal');
                if(!name_data){
                    console.log("Attempted to make child with no name for " + box.getNode().getAttr('name'));
                    childMakerModal.modal('hide');
                    return;
                }

                //~~~ Generate Data ~~~

                var customChildPID = "@OPG-" + (self.customNodeIndex++).toString();

                var bdate_data = $('#creator-bdate').val();
                var bplace_data = $('#creator-bplace').val();
                var ddate_data = $('#creator-ddate').val();
                var dplace_data = $('#creator-dplace').val();
                var gender_data = $('input[name=gender-radio]:checked').val();

                var s_name_data = $('#creator-s-name').val();
                var s_bdate_data = $('#creator-s-bdate').val();
                var s_bplace_data = $('#creator-s-bplace').val();
                var s_ddate_data = $('#creator-s-ddate').val();
                var s_dplace_data = $('#creator-s-dplace').val();
                var s_gender_data = $('input[name=s-gender-radio]:checked').val();

                var m_date = $('#creator-mdate').val();
                var m_place = $('#creator-mplace').val();

                //~~~ Create Nodes ~~~

                var node_data = {name: name_data, birthdate: bdate_data, birthplace: bplace_data, deathdate: ddate_data,
                                deathplace: dplace_data, marriagedate: m_date, marriageplace: m_place,
                                displaySpouse: null, gender:gender_data, isMain: true};

                var customNode = new BuildNode(customChildPID,node_data);

                var has_spouse = s_name_data || s_bdate_data || s_bplace_data || s_ddate_data || s_dplace_data;

                if(has_spouse){
                    var spouse_data = {name: s_name_data, birthdate: s_bdate_data, birthplace: s_bplace_data,
                                        deathdate: s_ddate_data, deathplace: s_dplace_data, marriagedate: m_date,
                                        marriageplace: m_place, displaySpouse: null, gender:s_gender_data, isMain: false};

                    var customSpouseNode = new BuildNode("@OPG-" + (self.customNodeIndex++).toString(),spouse_data);
                    customNode.setDisplaySpouse(customSpouseNode);
                    customSpouseNode.setDisplaySpouse(customNode);
                }
                box.getNode().getBranchIds().push(customChildPID);

                var customBox = new AbstractBox(customNode);

                customBox.setType(box.getType());

                customBox.getRenderInstructions()
                    .setHasPicture(false)
                    .setSpouseHasPicture(false)
                    .setFlavorKey(box.getRenderInstructions().getFlavorKey());
                self.listener.getBoxes().setId(customChildPID,customBox);

                self.listener.handleOption("add-custom-node",{node: customNode, box :customBox});
                if(has_spouse) {
                    self.listener.handleOption("add-custom-node", {node: customSpouseNode, box:null});
                }

                self.listener.refresh(self.listener.getBoxes());
                childMakerModal.modal('hide');
            });

            $("#child-maker-modal").modal('show');
        });
    }

    private initCreateEditor(box: IBox){

        var opgModalEditPrivateNode = $('#opg-modal-edit-private');
        opgModalEditPrivateNode.off('click');

        opgModalEditPrivateNode.click(() => {
            $("#opg-modal").modal('hide');
            let node:INode = box.getNode();

            $('#child-maker-title').text("Edit details for " + node.getAttr('name'));

            //~~~ Fill in values ~~~

            // Get the info from the node and put it into the chart.
            let name_line = $('#creator-name');
            let bdate_line = $('#creator-bdate');
            let bplace_line = $('#creator-bplace');
            let ddate_line = $('#creator-ddate');
            let dplace_line = $('#creator-dplace');

            name_line.val(node.getAttr('name'));
            bdate_line.val(node.getAttr('birthdate'));
            bplace_line.val(node.getAttr('birthplace'));
            ddate_line.val(node.getAttr('deathdate'));
            dplace_line.val(node.getAttr('deathplace'));

            // Do the same for the spouse, if one exists...
            let s_name:string = "";
            let s_bd:string = "";
            let s_bp:string = "";
            let s_dd:string = "";
            let s_dp:string = "";

            if (node.getDisplaySpouse()) {
                s_name = node.getDisplaySpouse().getAttr('name');
                s_bd = node.getDisplaySpouse().getAttr('birthdate');
                s_bp = node.getDisplaySpouse().getAttr('birthplace');
                s_dd = node.getDisplaySpouse().getAttr('deathdate');
                s_dp = node.getDisplaySpouse().getAttr('deathplace');
            }

            let s_name_line = $('#creator-s-name');
            let s_bdate_line = $('#creator-s-bdate');
            let s_bplace_line = $('#creator-s-bplace');
            let s_ddate_line = $('#creator-s-ddate');
            let s_dplace_line = $('#creator-s-dplace');

            s_name_line.val(s_name);
            s_bdate_line.val(s_bd);
            s_bplace_line.val(s_bp);
            s_ddate_line.val(s_dd);
            s_dplace_line.val(s_dp);

            // Grab the marriage data.
            let mdate_line = $('#creator-mdate');
            let mplace_line = $('#creator-mplace');

            mdate_line.val(node.getAttr('marriagedate'));
            mplace_line.val(node.getAttr('marriageplace'));

            //~~~ Add the Buttons ~~~

            let button_plug_l = $('#create-bottom-button-plug-left');
            button_plug_l.empty();
            button_plug_l.append('<button type="button" class="btn btn-footer" id="create-close-edits-button">Close</button>');
            $('#create-close-edits-button').click(() => {
                $("#child-maker-modal").modal('hide');
            });

            let button_plug_r = $('#create-bottom-button-plug-right');
            button_plug_r.empty();
            button_plug_r.append('<button type="button" class="btn btn-success" id="create-save-edits-button">Save</button>');

            let button = $('#create-save-edits-button');
            button.off('click');

            //~~~ Configure the reset data ~~~
            button.click(() => {

                // Grab the updated gender information.
                let gender_data = $('input[name=gender-radio]:checked');
                let s_gender_data = $('input[name=s-gender-radio]:checked');

                //~~~ Grab the new data fields ~~~

                box.getNode()
                    .setAttr("name", name_line.val())
                    .setAttr("birthdate", bdate_line.val())
                    .setAttr("birthplace", bplace_line.val())
                    .setAttr("deathdate", ddate_line.val())
                    .setAttr("deathplace", dplace_line.val())
                    .setAttr("gender", gender_data.val())
                    .setAttr("marriagedate", mdate_line.val())
                    .setAttr("marriageplace", mplace_line.val());

                let has_spouse:boolean = (s_name_line.val() != "" || s_bdate_line.val() != "" ||
                s_bplace_line.val() != "" || s_ddate_line.val() != "" ||
                s_dplace_line.val() != "");

                //~~~ Grab the spouse's new data or nullify the spouse.

                if (has_spouse) {
                    box.getNode().getDisplaySpouse()
                        .setAttr("name", s_name_line.val())
                        .setAttr("birthdate", s_bdate_line.val())
                        .setAttr("birthplace", s_bplace_line.val())
                        .setAttr("deathdate", s_ddate_line.val())
                        .setAttr("deathplace", s_dplace_line.val())
                        .setAttr("gender", s_gender_data.val())
                        .setAttr("marriagedate", mdate_line.val())
                        .setAttr("marriageplace", mplace_line.val());
                }
                else {
                    box.getNode().setAttr('displaySpouse', null);
                    box.setSpouseNode(null);
                }


                box.setNeedsUpdate(true);
                //StyleManager.restylize(box,box.getRenderInstructions().getFlavorKey());

                //~~~ Run the Styling Pipeline ~~~
                //This is actually correct because of lambda expression (arrow) function declaration.
                this.listener.handleOption("update-custom-node",{node: box.getNode(), box :box});
                if(has_spouse) {
                    this.listener.handleOption("update-custom-node", {node: box.getNode().getDisplaySpouse(), box:null});
                }

                //~~~ Refresh to redraw everything ~~~

                this.listener.refresh(this.listener.getBoxes());

                $("#child-maker-modal").modal('hide');
            });

            $("#child-maker-modal").modal('show');
        });
    }

    private initCreateRemover(box: IBox){
        var opgModalRemovePrivateNode = $('#opg-modal-remove-private');
        opgModalRemovePrivateNode.off('click');

        opgModalRemovePrivateNode.click(() => {
            $('#child-maker-modal').modal('hide');
            this.listener.getBoxes().removeId(box.getNode().getId());
            this.listener.handleOption("remove-custom-node",{node:box.getNode(), box:box});
            this.listener.refresh(this.listener.getBoxes());
        });
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
}