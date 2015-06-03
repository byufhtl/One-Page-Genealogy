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
    }
    handleOptionSetting(type:String, data:any): void {
        var self = this;
        if(type === 'selectIndividual') {
            var box:IBox = data.box.copy();
            $('#opg-modal').modal('show');
            setTimeout(function(){
                self.renderTempBox(box);
            },400);




            var opgModalSelect = $('#opg-modal-select');
            var opgModalSave = $('#opg-modal-save');
            var opgModalCollapse = $('#opg-modal-collapse');
            opgModalSelect.off();
            opgModalSave.off();
            opgModalCollapse.off();


            $('#opg-modal-select option[value='+box.getType()+']').prop('selected', true);
            opgModalSelect.change(function() {
                var optionSelected = $("option:selected", this);
                box.setType(this.value);
                self.renderTempBox(box);
            });
            opgModalSave.click(function() {
                $('#opg-modal').modal('hide');
                var changeWho = $('input[name=opg-change-who]:checked').val();
                self.listener.handleOption(changeWho, {type: box.getType(), id: box.getNode().getId()})

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