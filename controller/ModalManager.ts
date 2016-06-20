///<reference path="IOptionListener.ts"/>
///<reference path="PrivatePersonUtils.ts"/>
///<reference path="IOptionManager.ts"/>
///<reference path="../sources/DownloadManager.ts"/>
/**
 * Created by calvinmcm on 6/14/16.
 *
 * Manages the buttons associated with modal panes, including buttons that show and hide the modals, as well as those
 * attached to the modal windows.
 */

declare function familySearchDownload(): void;
declare var type: string;

class ModalManager{
    private rotation: number;
    private downloadManager: DownloadManager;
    private optionManager: IOptionManager;

    constructor(rotation: number){
       this.rotation = rotation;
    }

    /**
     * Initializes the opening modal window which allows the user to select the source material for their chart.
     * @param downloadManager The download manager for the chart.
     * @param optionManager The option manager for the chart.
     */
    initSourceModal(downloadManager: DownloadManager, optionManager: IOptionManager): void{

        this.downloadManager = downloadManager;
        this.optionManager = optionManager;

        $("[name='edit-spacing-switch']").bootstrapSwitch();

        $('#downloadModal').modal({
            backdrop: 'static',
            keyboard: false
        });

        if (localStorage.getItem("numGenerations") && FamilySearch.hasAccessToken()) {
            this.initFSDownloadModal();
        } else if (localStorage.getItem("numGenerations")) {
            localStorage.removeItem("numGenerations");
            localStorage.removeItem("rootPID");
            localStorage.removeItem("direction");
        }

        // New Chart Button Event Handler
        $("#redownload-button").click(function(){
            var dwnldClose = $('#download-modal-close');
            dwnldClose.show();
            //dwnldClose.off('click'); // Disable old handlers.
            //dwnldClose.click(function(){
            //    $('#fsModal').hide();
            //});
            $('#downloadModal').show();
        });

        // Card Click Event Handlers
        $("#tofsbutton-user").click(() => {
            this.handleCardClick("myFSTree")
        });
        $("#tofsbutton").click(() => {
            this.handleCardClick("otherFSTree")
        });
        $("#togedbutton").click(() => {
            this.handleCardClick("gedcom")
        });
        $('#myTreeCard').click(() => {
            this.handleCardClick("myFSTree")
        });
        $('#otherTreeCard').click(() => {
            this.handleCardClick("otherFSTree")
        });
        $('#gedcomCard').click(() => {
            this.handleCardClick("gedcom")
        });
    }

    /**
     * Initializes the response for the FSDownloadModal.
     */
    initFSDownloadModal(): void{

        type = "familysearch";
        var downloadBack = $('#fsDwldBack');
        downloadBack.off('click');
        downloadBack.html('Back');
        downloadBack.click(function(){
            $('#fsModal').hide();
            $('#downloadModal').show();
        });
        $('#downloadModal').hide();
        this.downloadManager.init(this.optionManager)
    }

    /**
     * Initializes the response for the GedcomModal.
     */
    initGedcomDownloadModal(): void{
        type = "gedcom";
        $('#myInput').click();
        $('#downloadModal').hide();
    }

    /**
     * Initializes the button controls for the Detail View Modal.
     *
     * The button elements used in this modal are manually dropped on each call, and should not require additional
     * management for standard operations.
     *
     * @param obs The class that will handle processed events.
     * @param box The box that contains the information being reviewed.
     * @param direction The direction in which the chart will go.
     */
    initDetailViewModal(obs: IOptionListener, box: IBox, direction: string): void{

        this.initPersonData(box);
        this.initCustomPersonButtons(box, obs, direction);

        this.initFSViewButton(box);
        this.initVPViewButton(box, obs);

        this.initSetAsRootButton(box);
        this.initCollapseButton(box, obs);
    }

    /**
     * Initializes the child editor modal.
     * @param obs The object with more advanced handlers for the processed event.
     * @param box The box being acted on (either the one being appended to or the one being editted).
     */
    initChildEditorModal(obs: IOptionListener, box: IBox): void{
        PrivatePersonUtils.initDetailModalButtons(box,obs);
    }

    /**
     * Initializes the buttons and content of the ruler specification modal.
     * @param obs The listener that handles the processed event.
     */
    initRulerModal(obs: IOptionListener): void{
        $('#opg-ruler').click(function() {
            if ($('#ruler-height').val() === "") {
                obs.handleOption('ruler', null);
            } else {
                $('#rulerModal').modal('show');
            }
        });

        $('#ruler-save').click(function() {
            if ($('#ruler-height').val() <= 0) {
                alert("Please enter a dimension greater than zero.")
            } else {
                $('#rulerModal').modal('hide');
                $('#ruler').css('display', 'block');
                obs.handleOption('ruler-save', null);
            }
        });

        $('#ruler-hide').click(function() {
            $('#rulerModal').modal('hide');
            $('#ruler').css('display', 'none');
        });
    }

    /**
     * Initializes the buttons for generating the statistic report modal.
     * @param obs The class with more robust handlers for the processed events.
     */
    initChartStatsModal(obs: IOptionListener): void{

        $('#statistics-button').click(() => {
            obs.handleOption('show-statistics', null);
            // Show the modal window
            $('#statistics-modal').modal('show');
        });
        $('#statistics-modal-close').click(() => {
            obs.handleOption('hide-statistics', null);
            $('#statistics-modal').modal('hide');
        });
        $('#recenter-button').click(() => {
            obs.handleOption('recenter-chart', null);
        });
    }

    /**
     * Initializes the buttons on the finder modal.
     * @param obs The listener handling the processed event.
     */
    initFindModal(obs: IOptionListener): void{
        $('#find-button').click(() => {
            $('#box-finder-modal').modal('show');
        });

        $('#box-finder-modal-close').click(() => {
            $('#box-finder-modal').modal('hide');
        });

        $('#box-finder-modal-seek').click(() => {
            var id = $('#box-finder-search-input').val();
            console.log(id);
            obs.handleOption('find-box-by-id', id);
        });
    }

    initPrintServicesModal(obs: IOptionListener): void{

        $('#print-services-button').click(function(){
            $('#printServicesModal').modal('show');
        });

        $('#print-services-close').click(function(){
            $('#printServicesModal').modal('hide');
        });

        $('#print-services-accept').click(function(){
            $('#printServicesModal').modal('hide');
            obs.handleOption("request-print-services",null);
        });
    }

    /**
     * Drops all existing handlers on the options and buttons pertinent to modals.
     */
    restore(){
        $('#opg-ruler').off('click');
        $('#ruler-save').off('click');
        $('#ruler-hide').off('click');
        $('#find-button').off('click');
        $('#box-finder-modal-close').off('click');
        $('#box-finder-modal-seek').off('click');
        $('#statistics-button').off('click');
        $('#statistics-modal-close').off('click');
        $('#recenter-button').off('click');
        $('#print-services-button').off('click');
        $('#print-services-close').off('click');
        $('#print-services-accept').off('click');
    }



//[][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][]
//                                                          UTILITIES
//[][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][]

    private static DISPLAY_PADDING:number = 5;

    //[][][][][][][][][][][][][][][][][][][][][] DETAIL VIEWER [][][][][][][][][][][][][][][][][][][][][][][][][][][][]>

    /**
     * Renders a temporary version of a box inside of the Detail View Modal.
     * @param box The box being drawn in simulation.
     */
    private renderTempBox(box: IBox) {
        var opgModalSvg = $('#opg-modal-svg');
        console.log(opgModalSvg[0], opgModalSvg);
        opgModalSvg.empty();
        var transform = [];
        // We need to convert from radians to degrees.
        var angle = Math.round(this.rotation * (180/Math.PI));
        if(angle === 0){
            opgModalSvg.height(box.getHeight() + ModalManager.DISPLAY_PADDING*2);
            opgModalSvg.width(box.getWidth() + ModalManager.DISPLAY_PADDING*2);
        }else if(angle % 270 === 0){
            opgModalSvg.width(box.getHeight() + ModalManager.DISPLAY_PADDING*2);
            opgModalSvg.height(box.getWidth() + ModalManager.DISPLAY_PADDING*2);
            transform.push("translate(0," + box.getWidth() +')');
        }else if(angle % 180 === 0){
            opgModalSvg.height(box.getHeight() + ModalManager.DISPLAY_PADDING*2);
            opgModalSvg.width(box.getWidth() + ModalManager.DISPLAY_PADDING*2);
            transform.push("translate(" + box.getWidth() + ',' + box.getHeight() + ")");
        }else{
            opgModalSvg.width(box.getHeight() + ModalManager.DISPLAY_PADDING*2);
            opgModalSvg.height(box.getWidth() + ModalManager.DISPLAY_PADDING*2);
            transform.push("translate(" + box.getHeight() + ',0)');
        }
        opgModalSvg.css("font-family","Roboto Slab");
        var g = opgModalSvg[0];
        g = Renderer.renderBox(box, g);
        console.log("G:", g, angle);
        transform.push("translate("+ModalManager.DISPLAY_PADDING+", "+ModalManager.DISPLAY_PADDING+")");
        transform.push('rotate('+ angle +')');

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

    /**
     * Initializes the "Add Person," "Edit Person," and "Remove Person" buttons
     * @param box The box being examined.
     * @param obs The class with handlers for processed events.
     * @param direction The direction of the chart (Asc/Desc)
     */
    private initCustomPersonButtons(box: IBox, obs: IOptionListener, direction: string){
        let private_add = $('#opg-modal-add-private');
        if(direction === "ascendancy"){
            // If there is a missing parent, show.
            if(box.getNode().getBranchIds().length < 2){
                private_add.show();
                private_add.text("Add Parent");
            }
            // If there is no missing parent, don't allow one to be added.
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
        private_edit.hide();
        private_remove.hide();

        if(PrivatePersonUtils.isCustomId(box.getNode().getId())){
            private_edit.show();
            if(box.getNode().getBranchIds().length === 0) {
                private_remove.show();
            }
        }

        this.initChildEditorModal(obs, box)
    }

    /**
     * Initializes the data presentation for the Detail Viewer Modal.
     * @param box The box being examined.
     *
     * TODO: Would really benefit from refactoring. I'm 90+% sure that rendering the HTML at run time is completely unnecessary...
     */
    private initPersonData(box: IBox){
        var colonLoc = box.getNode().getId().indexOf(':');
        var primary = $('#primary-node-information');
        var secondary = $('#secondary-node-information');


        // Render a bit differently for spouse boxes than for regular boxes
        if(box.getRenderInstructions().getSpouseNameInstruction()){
            secondary.show();

            //~~~ Append the spouse Elements into the modal window as necessary ~~~
            var primaryNode   = (box.getNode().getAttr('gender') === 'Male') ? box.getNode() : box.getNode().getDisplaySpouse();
            var secondaryNode = (box.getNode().getAttr('gender') === 'Female') ? box.getNode() : box.getNode().getDisplaySpouse();

            secondary.append('<div id="s-data-col" class="col-sm-9"></div>');

            //~~~ Setup the Ids ~~~
            let nodes = [primaryNode, secondaryNode];
            let ids = [];
            for(var node of nodes){
                var p_id = node.getId().substr(0,colonLoc);
                if(PrivatePersonUtils.isCustomId(node.getId())){
                    p_id = "Private Person";
                }
                else if (!p_id || p_id == ''){
                    p_id = node.getAttr('name') + " (No ID found)";
                }
                ids.push(p_id)
            }

            $('#pid').text("Personal Information for " + ids[0] + " and " + ids[1]);
            $('#primary-name').text(primaryNode.getAttr("name"));
            $('#primary-bdate').text(primaryNode.getAttr("birthdate"));
            $('#primary-bplace').text(primaryNode.getAttr("birthplace"));
            $('#primary-ddate').text(primaryNode.getAttr("deathdate"));
            $('#primary-dplace').text(primaryNode.getAttr("deathplace"));

            $('#secondary-name').text(secondaryNode.getAttr("name"));
            $('#secondary-bdate').text(secondaryNode.getAttr("birthdate"));
            $('#secondary-bplace').text(secondaryNode.getAttr("birthplace"));
            $('#secondary-ddate').text(secondaryNode.getAttr("deathdate"));
            $('#secondary-dplace').text(secondaryNode.getAttr("deathplace"));

        }
        else{
            secondary.hide();
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
            $('#primary-name').text(box.getNode().getAttr("name"));
            $('#primary-bdate').text(box.getNode().getAttr("birthdate"));
            $('#primary-bplace').text(box.getNode().getAttr("birthplace"));
            $('#primary-ddate').text(box.getNode().getAttr("deathdate"));
            $('#primary-dplace').text(box.getNode().getAttr("deathplace"));

        }
        $('#opg-modal').modal('show');

        var self = this;

        setTimeout(function(){
            self.renderTempBox(box);
            if(box.getRenderInstructions().getSpouseNameInstruction() && box.getRenderInstructions().getSpousePictureDimInstruction()){
                self.renderTempPortriat(primaryNode, $('#primary-portrait')[0], 130, 130);
                self.renderTempPortriat(secondaryNode, $('#secondary-portrait')[0], 130, 130);
            }
            else {
                self.renderTempPortriat(box.getNode(), $('#primary-portrait')[0], 130, 130);
            }
            var longer = (box.getHeight() > box.getWidth()) ? box.getHeight() : box.getWidth();
            if(longer > 1000 ){
                $('modal-dialog-box').css('width',(longer+50).toString());
            }
        },0);
    }

    /**
     * Initializes the button that will reroute to FamilySearch.
     * @param box The Box being examined and which pertains to where to re-route to.
     */
    private initFSViewButton(box: IBox){
        var opgModalFSview = $('#FS-view');
        opgModalFSview.off('click');

        if(localStorage.getItem("chartType") === "FamilySearch") {

            opgModalFSview.show();

            opgModalFSview.click(() => {
                var pid = box.getNode().getId().substring(0, 8);
                if (!PrivatePersonUtils.isCustomId(pid)) {
                    window.open("https://familysearch.org/tree/#view=ancestor&person=" + pid, '_blank');
                }
            });
        }
        else{
            opgModalFSview.hide();
        }
    }

    /**
     * Initializes the button that will reroute to VirtualPedigree
     * @param box The Box being examined and which pertains to where to re-route to.
     * @param obs The listener with a more extensive handler for the event.
     */
    private initVPViewButton(box: IBox, obs: IOptionListener){
        var opgModalVPview = $('#FS-view');
        opgModalVPview.off('click');

        if(localStorage.getItem("chartType") === "FamilySearch") {

            opgModalVPview.show();

            opgModalVPview.click(() => {
                var pid:string = box.getNode().getId().substring(0, 8);
                if (!PrivatePersonUtils.isCustomId(pid)) {
                    obs.handleOption('VP-view', {id: pid});
                }
            });
        }
        else{
            opgModalVPview.hide();
        }
    }

    /**
     * Initializes the branch collapse button.
     * @param box The box whose descendants will be hidden (collapsed).
     * @param obs The class that will handle the processed request.
     */
    private initCollapseButton(box: IBox, obs: IOptionListener){
        var opgModalCollapse = $('#opg-modal-collapse');
        opgModalCollapse.off('click');

        if(box.isCollapsed()) {
            opgModalCollapse.html('Expand');
            opgModalCollapse.click(function() {
                $('#opg-modal').modal('hide');
                obs.handleOption("expand-sub-tree", {id: box.getNode().getId(), box: box})
            });
        }
        else {
            opgModalCollapse.html('Collapse');
            opgModalCollapse.click(function() {
                $('#opg-modal').modal('hide');
                obs.handleOption("collapse-sub-tree", {id: box.getNode().getId(), box: box})
            });
        }
    }

    /**
     * Initializes the Set As Root Button.
     * @param box The box containing the soon-to-be root node.
     */
    private initSetAsRootButton(box: IBox){
        var setAsRoot = $('#set-as-root');
        // Must deactivate old responses or you will get duplicates.
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
    }

    //[][][][][][][][][][][][][][][][][][][][][] SOURCE MODAL  [][][][][][][][][][][][][][][][][][][][][][][][][][][][]>

    private handleCardClick(card: string){
        switch(card){
            case "myFSTree":
                $('#relative-tree-downloader').hide();
                $('#pid-search-input').val("");
                this.initFSDownloadModal();
                break;
            case "otherFSTree":
                $('#relative-tree-downloader').show();
                this.initFSDownloadModal();
                break;
            case "gedcom":
                this.initGedcomDownloadModal();
                break;
            default:
                console.log("Invalid Card click input:", card);
        }
    }

    //[][][][][][][][][][][][][][][][][][][][][][][] OTHER [][][][][][][][][][][][][][][][][][][][][][][][][][][][][][]>

    setRotation(rotation: number): ModalManager{
        this.rotation = rotation;
        return this;
    }
}