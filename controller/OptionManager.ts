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
    constructor() {
        var self = this;

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
            self.listener.handleOption('detail-style', null);
        });
        $('#opg-vertical-style').click(function(){
            self.listener.handleOption('vertical-style', null);
        });
        $('#opg-eight-eleven-style').click(function(){
            self.listener.handleOption('eight-eleven-style', null);
        });
        $('#opg-eight-eleven-detail-style').click(function(){
            self.listener.handleOption('eight-eleven-detail-style', null);
        });
        $('#opg-js-public-style').click(function(){
            self.listener.handleOption('js-public-style', null);
        });
        $('#opg-to-greyscale').click(function(){
            self.listener.handleOption('to-greyscale', null);
        });
        $('#opg-to-branch-color').click(function(){
            self.listener.handleOption('to-branch-color', null);
        });
        $('#opg-to-generation-color').click(function(){
            self.listener.handleOption('to-generation-color', null);
        });
        $('#opg-to-generation-color-vibrant').click(function(){
            self.listener.handleOption('to-generation-color-vibrant', null);
        });
        $('#opg-to-gender-color').click(function(){
            self.listener.handleOption('to-gender-color', null);
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
                change: function(color){
                    box.setColor(color.toHexString());
                    self.renderTempBox(box);
                }
            });

            $('#box-color-picker').spectrum({
                color: box.getColor(),
                change: function(color){
                    box.setColor(color.toHexString());
                    self.renderTempBox(box);
                }
            });

            var opgModalSelect = $('#opg-modal-select');
            var opgModalSave = $('#opg-modal-save');
            var opgModalCollapse = $('#opg-modal-collapse');
            var opgModalFSview = $('#FS-view');
            var opgModalVPview = $('#VP-view');
            opgModalSelect.off('click');
            opgModalSave.off('click');
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
            opgModalSave.click(function() {
                $('#opg-modal').modal('hide');
                //console.log("ran save");
                var changeWho = $('input[name=opg-change-who]:checked').val();
                self.listener.handleOption(changeWho, {type: box.getType(), id: box.getNode().getId(), color: box.getColor()})
                //var changeWhoColor = $('input[name=opg-change-who-color]:checked').val();
                //self.listener.handleOption(changeWhoColor, {type: "green", id: box.getNode().getId()})

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
    setListener(listener: IOptionListener) {
        this.listener = listener;
    }
}