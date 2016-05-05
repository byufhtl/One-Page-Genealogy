///<reference path="IOptionManager.ts"/>
///<reference path="../model/IBox.ts"/>
///<reference path="../controller/BoxMap.ts"/>
///<reference path="../view/BoxStyleFactory.ts"/>
///<reference path="../js/jsDeclarations.ts"/>
///<reference path="../view/boxRenderers/Renderer.ts"/>

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

    constructor() {
        var self = this;

        this.customSize = false;
        this.customColor = false;

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
        })
        $('#opg-detail-style').click(function(){
            self.handleStyleChange('detail-style');
        });
        $('#opg-reunion-style').click(function(){
            self.handleStyleChange('reunion-style');
        });
        $('#opg-vertical-style').click(function(){
            self.handleStyleChange('vertical-style');
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
        $('#opg-js-public-style').click(function(){
            self.handleStyleChange('js-public-style');
        });
        $('#opg-js-reunion-public-style').click(function(){
            self.handleStyleChange('js-reunion-public-style');
        });
        $('#opg-to-greyscale').click(function(){
            self.handleStyleChange('to-greyscale',false);
        });
        $('#opg-to-branch-color').click(function(){
            self.handleStyleChange('to-branch-color',false);
        });
        $('#opg-to-generation-color').click(function(){
            self.handleStyleChange('to-generation-color',false);
        });
        $('#opg-to-generation-color-vibrant').click(function(){
            self.handleStyleChange('to-generation-color-vibrant',false);
        });
        $('#opg-to-gender-color').click(function(){
            self.handleStyleChange('to-gender-color',false);
        });
        $('#opg-to-country-color').click(function(){
            self.handleStyleChange('to-country-color', false);
        });
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
        $("#edit-spacing-switch").on('switchChange.bootstrapSwitch', function(event, state) {
            self.listener.handleOption('edit-spacing-switch-changed', {state: state});
        })
    }

    handleOptionSetting(type:String, data:any): void {
        var self = this;
        if(type === 'selectIndividual') {
            var box:IBox = data.box.copy();
            var colonLoc = box.getNode().getId().indexOf(':');
            $('#pid').text("Box Style Options - " + box.getNode().getId().substr(0,colonLoc));
            $('#opg-modal').modal('show');
            setTimeout(function(){
                self.renderTempBox(box);
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

            var opgModalSelect = $('#opg-modal-select');
            var opgModalSizeSave = $('#opg-modal-save-size');
            var opgModalColorSave = $('#opg-modal-save-color');
            var opgModalCollapse = $('#opg-modal-collapse');
            var opgModalFSview = $('#FS-view');
            var opgModalVPview = $('#VP-view');
            var setAsRoot = $('#set-as-root');
            opgModalSelect.off('click');
            opgModalSizeSave.off('click');
            opgModalColorSave.off('click');
            opgModalCollapse.off('click');
            opgModalFSview.off('click');
            opgModalVPview.off('click');
            setAsRoot.off('click');

            setAsRoot.click(function(){
                var colonLoc = box.getNode().getId().indexOf(':');
                var pid = box.getNode().getId().substr(0,colonLoc);
                $("#opg-modal").modal('hide');
                $('#pid-search-input').val(pid);
                familySearchDownload();
            });

            opgModalFSview.click(function(){
                var pid = box.getNode().getId().substring(0,8);
                window.open("https://familysearch.org/tree/#view=ancestor&person="+pid, '_blank');
            });

            opgModalVPview.click(function(){
                var pid:string = box.getNode().getId().substring(0,8);
                self.listener.handleOption('VP-view', {id: pid});
            });

            $('#opg-modal-select option[value='+box.getType()+']').prop('selected', true);
            opgModalSelect.change(function() {
                var optionSelected = $("option:selected", this);
                box.setType(this.value);
                self.renderTempBox(box);
            });
            opgModalSizeSave.click(function() {
                $('#opg-modal').modal('hide');
                var changeWho = $('input[name=opg-change-who]:checked').val();
                self.listener.handleOption(changeWho, {type: box.getType(), id: box.getNode().getId()});
                this.customSize = true;
            });
            opgModalColorSave.click(function() {
                $('#opg-modal').modal('hide');
                var changeWho = $('input[name=opg-change-who-color]:checked').val();
                self.listener.handleOption(changeWho, {id: box.getNode().getId(), color: box.getColor(), textcolor: box.getTextColor()});
                this.customColor = true;
            });
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

    private handleStyleChange(changeType:string, sizeChange:boolean = true){
        if((this.customColor && !sizeChange) || (this.customSize && sizeChange)){
            console.log("Style Change - Override Protocol");
            this.displayWarning(changeType,sizeChange);
        }
        else {
            console.log("Style Change - No Override");
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
        var colorMap = {"Unknown" : ColorManager.gray()};
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
        $('#country-legend').css("width","15%");
        $('#opg-chart').css("width","85%");
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

}