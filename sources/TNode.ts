/**
 * Created by calvinmcm on 6/3/16.
 *
 * A better approach to the nodes that will allow OPG to only require one type of node, and will allow for those nodes
 * to be better preserved for the client.
 *
 * class TNode : The basic Node class that contains an ID, a Display object, a FamilyIds object, and functions.
 *
 * class Display : A data structure for holding the display information for the node like names, dates, and displaySpouse.
 *
 * class FamilyIds : a data structure with three arrays containing parents', children's, and spouses' ids respectively.
 *
 * The one functionality abandoned here is the profile picture promise parameter, since it would be better to queue a
 * central PictureManager to index and respond to the promises based on the node ID. This would make things a lot more
 * streamlined and clean. Space has been left in the display object and the TNode object to store a convenient picture
 * URL for uploading purposes.
 */
class TNode{
    private id: string;
    private display: Display;
    private family: FamilyIds;

    constructor(id: string, display: Display, family: FamilyIds){
        this.id = id;
        this.display = display;
        this.family = family;
    }

    getId(): string{
        return this.id;
    }

    hasDisplayAttr(name:string){
        var attr = this.getDisplayAttr(name);
        return (attr != null && attr != undefined);
    }

    getDisplayAttr(name: string): any{

        switch(name){
            case TNode.NAME:
                return this.display.displayName;
            case TNode.GENDER:
                return this.display.displayGender;
            case TNode.B_DATE:
                return this.display.displayBirthDate;
            case TNode.B_PLACE:
                return this.display.displayBirthPlace;
            case TNode.D_DATE:
                return this.display.displayDeathDate;
            case TNode.D_PLACE:
                return this.display.displayDeathPlace;
            case TNode.M_DATE:
                return this.display.displayMarriageDate;
            case TNode.DISP_SPOUSE:
                return this.display.displaySpouse;
            case TNode.IS_MAIN:
                return this.display.isMain;
            case TNode.PICTURE_URL:
                return this.display.pictureURL;
            default:
                return null;
        }
    }

    setDisplayAttr(name: string, value: any): void{
        switch(name){
            case TNode.NAME:
                this.display.displayName = value;
                break;
            case TNode.GENDER:
                this.display.displayGender = value;
                break;
            case TNode.B_DATE:
                this.display.displayBirthDate = value;
                break;
            case TNode.B_PLACE:
                this.display.displayBirthPlace = value;
                break;
            case TNode.D_DATE:
                this.display.displayDeathDate = value;
                break;
            case TNode.D_PLACE:
                this.display.displayDeathPlace = value;
                break;
            case TNode.M_DATE:
                this.display.displayMarriageDate = value;
                break;
            case TNode.DISP_SPOUSE:
                if(value instanceof TNode || value === null) {
                    this.display.displaySpouse = value;
                }
                break;
            case TNode.IS_MAIN:
                this.display.isMain = value;
                break;
            case TNode.PICTURE_URL:
                this.display.pictureURL = value;
                break;
        }
    }

    getParentIds(): string[]{
        return this.family.parents;
    }

    setParentIds(parentIds: string[]): void{
        this.family.parents = parentIds;
    }

    hasParentIds(): boolean{
        return(this.family.parents.length > 0);
    }

    getChildIds(): string[]{
        return this.family.children;
    }

    setChildIds(childIds: string[]): void{
        this.family.children = childIds;
    }

    hasChildIds(): boolean{
        return(this.family.children.length > 0);
    }

    getSpouseIds(): string[]{
        return this.family.spouses;
    }

    setSpouseIds(spouseIds: string[]): void{
        this.family.spouses = spouseIds;
        // Makes sure that the display spouse is included.
        if(this.display.displaySpouse) {
            var index = this.family.spouses.indexOf(this.display.displaySpouse.getId());
            if (index < 0) { // If not found, add it into the array.
                this.family.spouses.push(this.display.displaySpouse.getId());
            }
        }
    }

    hasSpouseIds(): boolean{
        return(this.family.spouses.length > 0);
    }

    // Static Variable for better organization and less parameter guessing in the above function calls.
    static NAME = "name";
    static GENDER = "gender";
    static B_DATE = "bdate";
    static B_PLACE = "bplace";
    static D_DATE = "ddate";
    static D_PLACE = "dplace";
    static M_DATE = "mdate";
    static DISP_SPOUSE = "dispspouse";
    static IS_MAIN = "ismain";
    static PICTURE_URL = "pictureurl"
}

/**
 * The class for storing the display information. The data is stored in publicly accessible and mutable variables for
 * convenience, since the data is copied from an immutable source such as FamilySearch or a Gedcom File, and is protected
 * by the privacy of the node class.
 */
class Display{
    public displayName: string;
    public displayGender: string;
    public displayBirthDate: string;
    public displayBirthPlace: string;
    public displayDeathDate: string;
    public displayDeathPlace: string;
    public displayMarriageDate: string;
    public displaySpouse: TNode;
    public isMain: boolean;
    public pictureURL: string;

    constructor(name: string, gender: string, bdate: string, bplace: string, ddate: string, dplace: string, mdate: string, displaySpouse: TNode, isMain: boolean, pictureURL: string){
        this.displayName = name;
        this.displayGender = Display.processGender(gender);
        this.displayBirthDate = bdate;
        this.displayBirthPlace = bplace;
        this.displayDeathDate = ddate;
        this.displayDeathPlace = dplace;
        this.displayMarriageDate = mdate;
        this.displaySpouse = displaySpouse;
        this.isMain = isMain;
        this.pictureURL = pictureURL;
    }

    static processGender(gender: string): string{
        let male = "Male";
        let female = "Female";
        if(gender === male || gender === female){return gender;}
        if(gender === "m" || gender === "M" || gender === "male"){
            return male;
        }
        if(gender === 'f' || gender === "F" || gender === 'female'){
            return female;
        }
        return "Unknown";
    }

}

/**
 * A convenient storage container for the person's relationships. The data is stored in publicly accessible variables.
 */
class FamilyIds{

    public children: string[];
    public parents: string[];
    public spouses: string[];

    constructor(children: string[], parents: string[], spouses: string[]){
        this.children = children;
        this.parents = parents;
        this.spouses = spouses;
    }

}