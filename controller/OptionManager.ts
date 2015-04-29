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
            var box:IBox = data['box'].copy();
            this.renderTempBox(box);

            $('#opg-modal').modal('show');

            $('#opg-modal-select').off();
            $('#opg-modal-save').off();
            $('#opg-modal-collapse').off();


            $('#opg-modal-select option[value='+box.getType()+']').prop('selected', true);
            $('#opg-modal-select').change(function() {
                var optionSelected = $("option:selected", this);
                box.setType(this.value);
                self.renderTempBox(box);
            });
            $('#opg-modal-save').click(function() {
                $('#opg-modal').modal('hide');
                var changeWho = $('input[name=opg-change-who]:checked').val();
                self.listener.handleOption(changeWho, {type: box.getType(), id: box.getNode().getId()})

            });
            $('#opg-modal-collapse').click(function() {
                $('#opg-modal').modal('hide');
                self.listener.handleOption("collapse-sub-tree", {id: box.getNode().getId()})
            });

        }
        return;
    }
    private renderTempBox(box: IBox) {
        var g = BoxStyleFactory.getNewBoxStyle(box.getType()).render(box);
        g.setAttribute("transform", "translate("+OptionManager.DISPLAY_PADDING+", "+OptionManager.DISPLAY_PADDING+")");
        $('#opg-modal-svg').empty();
        $('#opg-modal-svg').append(g);
        var jqG = $(g);
        $('#opg-modal-svg').height(box.getHeight() + OptionManager.DISPLAY_PADDING*2);
        $('#opg-modal-svg').width(box.getWidth() + OptionManager.DISPLAY_PADDING*2);

    }
    setListener(listener: IOptionListener) {
        this.listener = listener;
    }
}