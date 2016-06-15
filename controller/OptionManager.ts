///<reference path="IOptionManager.ts"/>
///<reference path="ModalManager.ts"/>
///<reference path="../model/IBox.ts"/>
///<reference path="../controller/BoxMap.ts"/>
///<reference path="../view/BoxStyleFactory.ts"/>
///<reference path="../js/jsDeclarations.ts"/>
///<reference path="../view/boxRenderers/Renderer.ts"/>
///<reference path="../sources/BuildNode.ts"/>
///<reference path="PrivatePersonUtils.ts"/>
///<reference path="../sources/DownloadManager.ts"/>

/**
 * Created by curtis on 3/19/15.
 * Last Updated by calvinmcm on 6/14/16.
 *
 * This class exists to handle button presses on the UI. The constructor calls methods to handle the various bits and
 * pieces.
 */

declare function familySearchDownload(): void;

class OptionManager implements IOptionManager {

    private listener: IOptionListener;

    private customSize:boolean;
    private customColor:boolean;

    private modalManager:ModalManager;
    private downloadManager: DownloadManager;

    private rotation:number = 0;

    private customNodeIndex :number;

    private direction: string;

    constructor() {}

    init(){
        var self = this;
        this.modalManager = new ModalManager(this.rotation);
        this.direction = "ascendancy";
        this.customSize = false;
        this.customColor = false;
        this.customNodeIndex = 1111; // Has to be at least three digits long to create a valid PID.

        this.resetOptions();

        this.downloadManager = DownloadManager.inst();
        this.modalManager.initSourceModal(this.downloadManager, self);

        this.initTopBar(this.listener);
        this.initStyleDropdown();
        this.initColorDropdown();
        this.initOptionsDropdown();
    }

    /**
     * Initializes the style drop down. This dropdown menu should populate at run time with only the styles that are
     * viable for the type of chart being used (Ascendancy/Descendancy).
     */
    private initStyleDropdown(): void{
        var self = this;
        $('#style-dropdown').click(() => {
            var style_menu = $('#style-menu');
            var direction = $('input[name=FSascOrDsc]:checked').val();
            var dropdown = $('#style-dropdown');
            if(direction !== dropdown.val()) {
                style_menu.empty();
                if (self.direction == "ascendancy") {
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

    /**
     * Initializes the options in the color dropdown menu.
     */
    private initColorDropdown(): void{
        var self = this;
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
    }

    /**
     * Initializes the options in the options dropdown menu.
     */
    private initOptionsDropdown(): void{
        var self = this;
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
    }

    /**
     * Initializes the buttons that generate the modal windows.
     */
    private initModalGenerators(): void{
        this.modalManager.restore();
        this.modalManager.initChartStatsModal(this.listener);
        this.modalManager.initRulerModal(this.listener);
        this.modalManager.initFindModal(this.listener);
    }

    private initTopBar(obs: IOptionListener): void{

        var rotCounter = $('#opg-rotate-cc');
        var rotClockwise = $('#opg-rotate-c');
        var DwnldButton = $('#opg-download');
        var SaveButton = $('#opg-save');

        rotCounter.off('click');
        rotClockwise.off('click');
        DwnldButton.off('click');
        SaveButton.off('click');

        rotCounter.click(function(){
            obs.handleOption('rotate', {value: -Math.PI/2});
        });
        rotClockwise.click(function(){
            obs.handleOption('rotate', {value: Math.PI/2});
        });
        DwnldButton.click(function(){
            obs.handleOption('request-download', null);
        });
        SaveButton.click(function() {
            obs.handleOption('save', null);
        });
    }

    /**
     * Initializes the responses when a box is selected, configuring the corresponding modal windows.
     *
     * @param type The type of setting being changed.
     * @param data Any data needed for the setting change.
     */
    handleOptionSetting(type:String, data:any): void {
        if(type === 'selectIndividual') {
            this.modalManager.initDetailViewModal(this.listener, <IBox> data.box.copy(), this.direction);
        }
        if(type === 'selectStyle') { // Obsolete?
            $('#opg-modal').modal('show');
            setTimeout(() => {
                //this.renderTempBox(box); // Code Moved to ModalManager.ts
            },400);
        }
        return;
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

        this.initModalGenerators();
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

    public resetOptions(): void{
        document.getElementById('opg-show-empty').innerHTML = "Show Empty Boxes";
        document.getElementById('opg-edit-spacing').innerHTML = "Edit Spacing";
        $('#edit-spacing-switch').css("display", "none");
        $('.BSswitch').bootstrapSwitch('state', true);
        $('#country-legend').css('display', 'none');
        $('#ruler-height').val("");
        $('#country-legend').animate({"width": "0%"}, "fast");
        $('#opg-chart').css("width", "100%");
    }
}