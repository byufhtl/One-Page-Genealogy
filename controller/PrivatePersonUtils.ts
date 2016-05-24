///<reference path="IOptionListener.ts"/>
///<reference path="../model/IBox.ts"/>
///<reference path="../controller/BoxMap.ts"/>
///<reference path="../view/BoxStyleFactory.ts"/>
///<reference path="../js/jsDeclarations.ts"/>
///<reference path="../view/boxRenderers/Renderer.ts"/>
///<reference path="../sources/BuildNode.ts"/>
/**
 * Created by calvinmcm on 5/19/16.
 *
 * A centralized locale for creating, editing, and deleting custom-built people.
 */
class PrivatePersonUtils{

    private static customNodeIndex = 1111; // Must be at least 4 digits long.

    static initDetailModalButtons(box :IBox, c :IOptionListener){

        this.initAddButton(box, c);
        this.initEditButton(box, c);

        let opgModalRemovePlug = $('#opg-modal-private-remove-div');
        opgModalRemovePlug.empty();
        if(this.isCustomId(box.getNode().getId())){
            if(box.getNode().getBranchIds().length == 0) {
                opgModalRemovePlug.append('<button type="button" class="btn btn-footer" id="opg-modal-remove-private" style="float: left;">Remove Node</button>');
                this.initRemoveButton(box, c);
            }
        }
    }

    private static initAddButton(parentBox: IBox, c :IOptionListener){
        // Sets up the creator pane
        var opgModalCreatePrivateNode = $('#opg-modal-add-private');
        opgModalCreatePrivateNode.off('click');

        opgModalCreatePrivateNode.click(() => {
            $("#opg-modal").modal('hide');
            $('#child-maker-title').text("Create Child for " + parentBox.getNode().getAttr('name'));

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

            // Radio Button Setup
            $('#male-radio').prop("checked",true); // set male default
            $('#s-female-radio').prop("checked",true); // set female default


            // FS Button
            this.initFSViewButton(parentBox, c);

            // Create Button
            this.initCreateButton(parentBox, c);

            $("#child-maker-modal").modal('show');
        });
    }

    private static initFSViewButton(box: IBox, c: IOptionListener){
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
    }

    private static initCreateButton(parentBox: IBox, c: IOptionListener){
        let button_plug_r = $('#create-bottom-button-plug-right');
        button_plug_r.empty();
        button_plug_r.append('<button type="button" class="btn btn-footer" id="create-private-button">Create</button>');

        var createPrivateNodeButton = $('#create-private-button');
        createPrivateNodeButton.off('click');

        createPrivateNodeButton.click(() => {
            var name_data = $('#creator-name').val();
            var childMakerModal = $('#child-maker-modal');
            if(!name_data){
                console.log("Attempted to make child with no name for " + parentBox.getNode().getAttr('name'));
                childMakerModal.modal('hide');
                return;
            }

            //~~~ Construct the nodes and the box for them ~~~

            var primary_node = PrivatePersonUtils.generateNode();
            var secondary_node = PrivatePersonUtils.generateSpouseNode(primary_node);

            parentBox.getNode().getBranchIds().push(primary_node.getId());

            var customBox = new AbstractBox(primary_node);

            customBox.setType(parentBox.getType());

            customBox.getRenderInstructions()
                .setHasPicture(false)
                .setSpouseHasPicture(false)
                .setFlavorKey(parentBox.getRenderInstructions().getFlavorKey());

            c.getBoxes().setId(primary_node.getId(),customBox);

            c.handleOption("add-custom-node",{node: primary_node, box :customBox});
            if(secondary_node) {
                console.log("queing spouse...");
                c.handleOption("add-custom-node", {node: secondary_node, box:null});
                c.getBoxes().setId(secondary_node.getId(),customBox);
            }

            c.refresh(c.getBoxes());
            childMakerModal.modal('hide');
        });
    }

    private static initEditButton(box: IBox, c: IOptionListener){

        var opgModalEditPrivateNode = $('#opg-modal-edit');
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

            let primary_gender = node.getAttr('gender');
            if(primary_gender == "Male"){
                $('#male-radio').prop("checked",true);
                $('#s-female-radio').prop("checked",true);
            }
            else if(primary_gender == "Female"){
                $('#female-radio').prop("checked",true);
                $('#s-male-radio').prop("checked",true);
            }
            else{
                $('#unknown-radio').prop("checked",true);
                $('#s-unknown-radio').prop("checked",true);
            }

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

                if(has_spouse) {
                    if (box.getNode().getDisplaySpouse()) {
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
                    else{
                        this.generateSpouseNode(box.getNode());
                    }
                }
                else {
                    box.getNode().setAttr('displaySpouse', null);
                    box.setSpouseNode(null);
                }


                box.setNeedsUpdate(true);
                //StyleManager.restylize(box,box.getRenderInstructions().getFlavorKey());

                //~~~ Run the Styling Pipeline ~~~
                //This is actually correct because of lambda expression (arrow) function declaration.
                c.handleOption("update-custom-node",{node: box.getNode(), box :box});
                if(has_spouse) {
                    c.handleOption("update-custom-node", {node: box.getNode().getDisplaySpouse(), box:null});
                }

                //~~~ Refresh to redraw everything ~~~

                c.refresh(c.getBoxes());

                $("#child-maker-modal").modal('hide');
            });

            $("#child-maker-modal").modal('show');
        });
    }

    static initRemoveButton(box: IBox, c :IOptionListener){
        var opgModalRemovePrivateNode = $('#opg-modal-remove-private');
        opgModalRemovePrivateNode.off('click');

        opgModalRemovePrivateNode.click(() => {
            let node = box.getNode();
            c.getBoxes().removeId(box.getNode().getId());
            c.handleOption("remove-custom-node",{node:node, box:box});
            // splice out all references to this node in their spouse.
            for(var spouse of node.getSpouses()){
                let spouses = c.getBoxes().getId(spouse).getNode().getSpouses();
                while(spouses.indexOf(node.getId()) !== -1){
                    spouses.splice(spouses.indexOf(node.getId()),1);
                }
            }
            c.refresh(c.getBoxes());
            $('#opg-modal').modal('hide');
        });
    }

    private static generateNode(subKey: string = "") :BuildNode{
        var name_data = $('#creator-name').val();
        var bdate_data = $('#creator-bdate').val();
        var bplace_data = $('#creator-bplace').val();
        var ddate_data = $('#creator-ddate').val();
        var dplace_data = $('#creator-dplace').val();
        var gender_data = $('input[name=gender-radio]:checked').val();

        var m_date = $('#creator-mdate').val();
        var m_place = $('#creator-mplace').val();

        var node_data = {name: name_data, birthdate: bdate_data, birthplace: bplace_data, deathdate: ddate_data,
            deathplace: dplace_data, marriagedate: m_date, marriageplace: m_place,
            displaySpouse: null, gender:gender_data, isMain: true};

        return new BuildNode(this.generateCustomKey(this.customNodeIndex++),node_data);
    }

    private static generateSpouseNode(node: INode) :INode{
        var s_name_data = $('#creator-s-name').val();
        var s_bdate_data = $('#creator-s-bdate').val();
        var s_bplace_data = $('#creator-s-bplace').val();
        var s_ddate_data = $('#creator-s-ddate').val();
        var s_dplace_data = $('#creator-s-dplace').val();
        var s_gender_data = $('input[name=s-gender-radio]:checked').val();

        var m_date = $('#creator-mdate').val();
        var m_place = $('#creator-mplace').val();

        var has_spouse = <boolean>(s_name_data || s_bdate_data || s_bplace_data || s_ddate_data || s_dplace_data);

        console.log("Spouse creator:",has_spouse,s_name_data,s_bdate_data);

        if(has_spouse){
            var spouse_data = {name: s_name_data, birthdate: s_bdate_data, birthplace: s_bplace_data,
                deathdate: s_ddate_data, deathplace: s_dplace_data, marriagedate: m_date,
                marriageplace: m_place, displaySpouse: null, gender:s_gender_data, isMain: false};

            var customSpouseNode = new BuildNode("@OPG-" + (this.customNodeIndex++).toString(),spouse_data);
            node.setDisplaySpouse(customSpouseNode);
            node.getPerson().display.displaySpouse = customSpouseNode;
            let spouses = node.getSpouses();
            if(spouses.indexOf(customSpouseNode.getId()) == -1){
                spouses.push(customSpouseNode.getId());
            }
            customSpouseNode.setDisplaySpouse(node);
            customSpouseNode.getPerson().display.displaySpouse = node;
            customSpouseNode.getSpouses().push(node.getId());
            return customSpouseNode;
        }

        return null;
    }

    /**
     * Builds a customized PID, using an optional subkey to identify particular usages as needed.
     * With subKey: @OPG-subKey-\d\d\d(\d+)
     * Without subKey: @OPG-\d\d\d(\d+)
     * @param subKey an optional subKey used to further identify custom identifiers
     * @returns {string}
     */
    static generateCustomKey(index:number, subKey: string = ""): string{
        return("@OPG-" + ((subKey)? subKey+"-" : "") +(index).toString());
    }

    static isCustomId(id: string): boolean{
        let matches = id.match(/@OPG.+/i);
        return((matches && matches.length > 0));
    }

    static getCustomSubKey(id: string): string{
        if(this.isCustomId(id)){
            let tags = id.split(RegExp('-'));
            if(tags.length > 2){
                return tags[1];
            }
        }
        return null;
    }

}