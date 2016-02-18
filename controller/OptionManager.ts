///<reference path="IOptionManager.ts"/>
///<reference path="../model/IBox.ts"/>
///<reference path="../view/BoxStyleFactory.ts"/>
///<reference path="../js/jsDeclarations.ts"/>

/**
 * Created by curtis on 3/19/15.
 */


class OptionManager implements IOptionManager {
    private static DISPLAY_PADDING:number = 5;

    private listener: IOptionListener;

    private customSize:boolean;
    private customColor:boolean;

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
        $('#opg-detail-style').click(function(){
            self.handleStyleChange('detail-style');
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
        $('#opg-js-public-style').click(function(){
            self.handleStyleChange('js-public-style');
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
        $('#opg-show-empty').click(function(){
            self.listener.handleOption('show-empty', null);
        });
    }
    handleOptionSetting(type:String, data:any): void {
        var self = this;
        if(type === 'selectIndividual') {
            var box:IBox = data.box.copy();
            $('#opg-modal').modal('show');
            setTimeout(function(){
                self.renderTempBox(box);
            },400);

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
            opgModalSelect.off('click');
            opgModalSizeSave.off('click');
            opgModalColorSave.off('click');
            opgModalCollapse.off('click');
            opgModalFSview.off('click');
            opgModalVPview.off('click');

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
                var changeWho = $('input[name=opg-change-who]:checked').val();
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
        opgModalSvg.height(box.getHeight() + OptionManager.DISPLAY_PADDING*2);
        opgModalSvg.width(box.getWidth() + OptionManager.DISPLAY_PADDING*2);
        var g = BoxStyleFactory.getNewBoxStyle(box.getType()).render(box, opgModalSvg[0]);
        g.setAttribute("transform", "translate("+OptionManager.DISPLAY_PADDING+", "+OptionManager.DISPLAY_PADDING+")");
        var jqG = $(g);


    }
    private handleStyleChange(changeType:string, sizeChange:boolean = true){
        if((this.customColor && !sizeChange) || (this.customSize && sizeChange)){
            console.log("Style Change - Override Protocol");
            this.displayWarning(changeType,sizeChange);
        }
        else {
            console.log("Style Change - No Override");
            this.listener.handleOption(changeType, null);
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

}