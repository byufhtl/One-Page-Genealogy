/**
 * Created by curtis on 5/12/15.
 */
class StringUtils {
    //**************************************************************************************************************
    // Misc formatting
    //**************************************************************************************************************
    public static centerElement(element, x, width) {
        var bbox = element.getBBox();
        var dw = width - bbox.width;
        element.setAttribute('x', x + dw/2);
    }
    //**************************************************************************************************************
    // Date formatting
    //**************************************************************************************************************
    public static fitDate(textObj, birthDateStr, deathDateStr, width) {
        var longDate = '( '+StringUtils.standardDate(birthDateStr)+" - "+StringUtils.standardDate(deathDateStr)+" )";
        textObj.textContent = longDate;
        if(textObj.getSubStringLength(0, longDate.length)<width) {
            return;
        }
        var medDate = '('+StringUtils.standardDate(birthDateStr)+"-"+StringUtils.standardDate(deathDateStr)+")";
        textObj.textContent = medDate;
        if(textObj.getSubStringLength(0, medDate.length)<width) {
            return;
        }
        var smDate = '('+new Date(birthDateStr).getFullYear()+"-"+new Date(deathDateStr).getFullYear()+")";
        textObj.textContent = smDate;
        if(textObj.getSubStringLength(0, smDate.length)<width) {
            return;
        }
        var xsDate = '('+new Date(birthDateStr).getFullYear()+"-"+(new Date(deathDateStr).getFullYear()+"").substring(2, 4);+")";
        textObj.textContent = xsDate;
        if(textObj.getSubStringLength(0, xsDate.length)<width) {
            return;
        }
    }
    private static months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    public static standardDate(dateString): string {
        if(!dateString) {
            return '';
        }

        if(dateString.length <= 4) {
            return dateString;
        }

        var date = new Date(dateString);
        var ret = [date.getDate(), StringUtils.months[date.getMonth()], date.getFullYear()].join(' ');
        return ret;
    }

    //**************************************************************************************************************
    // Name formatting
    //**************************************************************************************************************
    private static prefixNames = ['ms', 'miss', 'mrs', 'mr','mister','master','rev','reverend','fr','father','dr','doctor',
        'atty','attorney','prof','professor','hon','honorable','pres','president','gov','governor','coach',
        'ofc','officer','msgr','monsignor','sr','sister','br','brother','supt','superintendent','rep',
        'representative','sen','senator','amb','ambassador','treas','sec','secretary','pvt','cpl','corporal','sgt',
        'sergeant','sergent','sargent','adm','administrative','maj','major','capt','captain','cmdr','commander',
        'lt','lieutenant','lt col','ltcol','lieutenant colonel','col','colonel','gen','general']

    private static suffixNames = ['jr','junior','sr','senior','i','first','1st','ii','second','2nd','iii','third','3rd',
        'iv','fourth','4th','v','fifth','5th','vi','sixth','6th','esq','dc','dd','dds','dmd','jd','lld','md','od',
        'phd','ret','cfre','cpa','do','dvm','edd','pc','usa','usaf','usmc','usmcr','usn','bvm','clu','csc','csj',
        'osb','pe','rgs']


    public static fitName(textObj, name, width) {
        if(!name) {
            return '';
        }
        //1) Check to see if original can fit in given width
        var longName = name;
        textObj.textContent = longName;
        if(textObj.getSubStringLength(0, longName.length)<width) {
            return;
        }

        var names = name.split(" ");

        //2) Set each name to have the first letter capitalized and the rest lower case
        //   This isn't to shorten the string, it's just to make it look nice
        names = StringUtils.capitalizeFirstLetter(names);
        name = StringUtils.toNameString(names);

        //3) Remove the prefix
        //this.intializePrefixNames();
        names = StringUtils.removePrefix(names);
        names = StringUtils.removeNulls(names);
        name = StringUtils.toNameString(names);
        if(name.length <= width) {
            textObj.textContent = name;
            return;
        }

        //4) Remove the 'or__'
        names = StringUtils.removeOr(names);
        names = StringUtils.removeNulls(names);
        name = StringUtils.toNameString(names);
        if(name.length <= width) {
            textObj.textContent = name;
            return;
        }

        //5) remove the suffix
        //StringUtils.initializeSuffixNames();
        names = StringUtils.removeSuffix(names);
        names = StringUtils.removeNulls(names);
        name = StringUtils.toNameString(names);
        if(name.length <= width) {
            textObj.textContent = name;
            return;
        }

        //6) reduce the middle name to only the middle initial
        names = StringUtils.abbrMidName(names);
        names = StringUtils.removeNulls(names);
        name = StringUtils.toNameString(names);
        if(name.length <= width) {
            textObj.textContent = name;
            return;
        }

        //7) remove the middle initial
        names = StringUtils.removeMiddleInitial(names);
        names = StringUtils.removeNulls(names);
        name = StringUtils.toNameString(names);
        if(name.length <= width) {
            textObj.textContent = name;
            return;
        }

        //8) reduce the given name to initial
        names = StringUtils.reduceGivenName(names);
        name = StringUtils.toNameString(names);
        if(name.length <= width) {
            textObj.textContent = name;
            return;
        }

        //9) reduce the surname to have ellipsis where it doesn't fit
        //   i.e. 'Reallylongname' will become 'Reallylo...'
        names = StringUtils.reduceSurname(names, width);
        name = StringUtils.toNameString(names);
        textObj.textContent = name;
        return;
    }
    //-------------------------------
    //Concats the name string together again, separating the
    //words with a space.
    //-------------------------------
    private static toNameString(names){
        var result = "";
        for(var i = 0; i < names.length; i++){
            if(names[i] != null && names[i] != "")
                result = result.concat((names[i] + " "));
        }
        if(result.length === 0)
            return result;

        result = result.trim();
        return result;
    }
    //-------------------------------
    //Removes all null positions in names
    //-------------------------------
    private static removeNulls(names){
        var temp = [];
        for(var i = 0; i < names.length; i++){
            if(names[i] != null && names[i] != ""){
                temp.push(names[i]);
            }
        }
        return temp;
    }
    //-------------------------------
    //Capitalizes the first letter only and the rest of the characters are lower case
    //-------------------------------
    private static capitalizeFirstLetter(names){
        for(var i = 0; i < names.length; i++){
            var temp = names[i].substring(0,1); //first character
            var temp2 = names[i].substring(1); //rest of the name
            temp = temp.toUpperCase();
            temp2 = temp2.toLowerCase();

            temp = temp.concat(temp2);
            names[i] = temp;
        }
        return names;
    }
    //-------------------------------
    //Removes unwanted characters (if applicable)
    //Uses a fixed point algorithm
    //-------------------------------
    private static removeUnwants(names){
        for(var i = 0; i < names.length; i++){
            var before = "";
            var after = names[i];
            do {
                before = after;
                after = StringUtils.removeChar(after, '.');
                after = StringUtils.removeChar(after, '?');

            } while (after.toLowerCase() != before.toLowerCase()) //fixed point algorithm

            names[i] = after.trim();
        }
        return names;
    }
    //-------------------------------
    //Removes the first instance of the given character c from name
    //-------------------------------
    private static removeChar(name,c){
        var location = name.indexOf(c);
        if (location != -1) {
            var newName = "";
            if (location != 0){
                newName = name.substring(0, location);
            }
            if (location != (name.length - 1))
                newName = newName.concat(name.substring(location + 1));

            return newName;
        }
        return name;
    }
    //-------------------------------
    //Removes the prefix (if applicable)
    //-------------------------------
    private static removePrefix(names){
        names = StringUtils.removeUnwants(names);
        for(var i = 0; i < names.length; i++){
            var temp = names[i].toLowerCase().trim();
            if(StringUtils.prefixNames.indexOf(temp) >= 0)
                names[i] = "";//null;
        }
        return names;
    }
    //-------------------------------
    //Removes any 'or__' (if applicable)
    //In removing the 'or' and everything afterwards or before
    //	The function will test to see which side of the string is longer
    //  And keep the longer portion of the name.
    //  i.e. 'Jean or Jane Thompson' will return 'Jane Thompson'
    //  i.e. 'Tom Rig or Tometheous' will return 'Tom Rig'
    //-------------------------------
    private static removeOr(names){
        for(var i = 0; i < names.length; i++){
            if(names[i].toLowerCase().trim() === 'or'){
                if(((names.length-1)-i) > i){ //if the amount of name after the 'or' is greater than before the 'or'
                    for(var j = 0; j <= i; j++){
                        names[j] = "";//null;
                    }
                }
                else{
                    for(var j = (names.length-1); j >= i; j--){
                        names[j] = "";//null;
                    }
                }
            }
        }

        return names;
    }
    //-------------------------------
    //Abbreviates the middle name
    //Whatever is in between the first and last name is shortened
    //If the middle name is one single letter already it is left alone
    //-------------------------------
    private static abbrMidName(names){
        if(names.length > 2){
            if(names[1].length > 1)
                names[1] = names[1].charAt(0) + ".";
        }
        for(var i = 2; i < names.length-1; i++){ //remove all other middle names
            names[i] = "";//null;
        }

        return names;
    }
    //-------------------------------
    //Removes the suffix (if applicable)
    //-------------------------------
    private static removeSuffix(names){
        for(var i = 0; i < names.length; i++){
            var temp = names[i].toLowerCase().trim();
            if(StringUtils.suffixNames.indexOf(temp) >= 0)
                names[i] = "";//null;
        }
        return names;
    }
    //-------------------------------
    //Removes the middle initial (if applicable)
    //-------------------------------
    private static removeMiddleInitial(names){
        if(names.length > 2){
            names[1] = "";//null;
        }
        return names;
    }
    //-------------------------------
    //Reduces the given name to a single initial and '.'
    //-------------------------------
    private static reduceGivenName(names){
        if(names.length > 1){
            names[0] = names[0].charAt(0) + ".";
        }
        return names;
    }
    //-------------------------------
    //Reduces the surname to fit the box using ellipsis
    //i.e. 'Reallylongname' will become 'Reallylo...'
    //-------------------------------
    private static reduceSurname(names,width){
        if(names.length > 1){
            names[names.length-1] = names[names.length-1].substring(0, names[names.length-1].length-3) + "...";
            var name = StringUtils.toNameString(names);
            if(name.length <= width)
                return names;
            else{
                for(var i = names[names.length-1].length-4; i > 0; i--){
                    names[names.length-1] = names[names.length-1].substring(0, i) + "...";
                    var name = StringUtils.toNameString(names);
                    if(name.length <= width)
                        return names;
                }
            }
        }
        return names;
    }

    //**************************************************************************************************************
    // Place formatting
    //**************************************************************************************************************
    public static fitPlace(textObj, place, width) {
        if (!place) {
            return '';
        }
        //1) Check to see if original can fit in given width
        var longPlace = place;
        textObj.textContent = longPlace;
        if (textObj.getSubStringLength(0, longPlace.length) < width) {
            return;
        }

        StringUtils.initializeStates();
        StringUtils.initializeCountries();
        //StringUtils.fitToBoxesFiveAndSix(place);
        if(place != undefined){
            var places = place.split(",");

            //places = StringUtils.removeCounty(places); //Removes county for everybody

            if(StringUtils.isUnitedStates(places[(places.length-1)].toLowerCase().trim())){

                places[(places.length-1)] = "USA";

                if(places[(places.length-2)] != undefined && (places[(places.length-2)].toLowerCase().trim()) in StringUtils.stateAbbrMap){
                    places[(places.length-2)] = StringUtils.stateAbbrMap[places[(places.length-2)].toLowerCase().trim()];
                }
                place = StringUtils.toPlaceString(places);
            }

            else{ //Make sure that the place doesn't have the state at the end of the string without the country
                if((places[(places.length-1)].toLowerCase().trim()) in StringUtils.stateAbbrMap){
                    places[(places.length-1)] = StringUtils.stateAbbrMap[places[(places.length-1)].toLowerCase().trim()];
                }
                else if(places[(places.length-2)] != undefined && (places[(places.length-2)].toLowerCase().trim()) in StringUtils.stateAbbrMap){
                    places[(places.length-2)] = StringUtils.stateAbbrMap[places[(places.length-2)].toLowerCase().trim()];
                }
                place = StringUtils.toPlaceString(places);
            }
        }
        place = StringUtils.fitToBoxesOneThroughFour(place,width);
        textObj.textContent = place;
        return;
    }

    //For having both birth and death places on one line
    public static fit2Places(textObj, place1, place2, width) {
        if (!place1 && !place2) {
            return '';
        }
        //1) Check to see if original can fit in given width
        var longPlace = 'B: '+place1+ ' D: '+place2;
        textObj.textContent = longPlace;
        if (textObj.getSubStringLength(0, longPlace.length) < width) {
            return;
        }

        StringUtils.initializeStates();
        StringUtils.initializeCountries();
        //StringUtils.fitToBoxesFiveAndSix(place);
        if(place1 != undefined){
            var places = place1.split(",");

            //places = StringUtils.removeCounty(places); //Removes county for everybody

            if(StringUtils.isUnitedStates(places[(places.length-1)].toLowerCase().trim())){

                places[(places.length-1)] = "USA";

                if(places[(places.length-2)] != undefined && (places[(places.length-2)].toLowerCase().trim()) in StringUtils.stateAbbrMap){
                    places[(places.length-2)] = StringUtils.stateAbbrMap[places[(places.length-2)].toLowerCase().trim()];
                }
                place1 = StringUtils.toPlaceString(places);
            }

            else{ //Make sure that the place doesn't have the state at the end of the string without the country
                if((places[(places.length-1)].toLowerCase().trim()) in StringUtils.stateAbbrMap){
                    places[(places.length-1)] = StringUtils.stateAbbrMap[places[(places.length-1)].toLowerCase().trim()];
                }
                else if(places[(places.length-2)] != undefined && (places[(places.length-2)].toLowerCase().trim()) in StringUtils.stateAbbrMap){
                    places[(places.length-2)] = StringUtils.stateAbbrMap[places[(places.length-2)].toLowerCase().trim()];
                }
                place1 = StringUtils.toPlaceString(places);
            }
        }
        place1 = StringUtils.fitToBoxesOneThroughFour(place1,width/2-3);

        if(place2 != undefined){
            var places = place2.split(",");

            //places = StringUtils.removeCounty(places); //Removes county for everybody

            if(StringUtils.isUnitedStates(places[(places.length-1)].toLowerCase().trim())){

                places[(places.length-1)] = "USA";

                if(places[(places.length-2)] != undefined && (places[(places.length-2)].toLowerCase().trim()) in StringUtils.stateAbbrMap){
                    places[(places.length-2)] = StringUtils.stateAbbrMap[places[(places.length-2)].toLowerCase().trim()];
                }
                place2 = StringUtils.toPlaceString(places);
            }

            else{ //Make sure that the place doesn't have the state at the end of the string without the country
                if((places[(places.length-1)].toLowerCase().trim()) in StringUtils.stateAbbrMap){
                    places[(places.length-1)] = StringUtils.stateAbbrMap[places[(places.length-1)].toLowerCase().trim()];
                }
                else if(places[(places.length-2)] != undefined && (places[(places.length-2)].toLowerCase().trim()) in StringUtils.stateAbbrMap){
                    places[(places.length-2)] = StringUtils.stateAbbrMap[places[(places.length-2)].toLowerCase().trim()];
                }
                place2 = StringUtils.toPlaceString(places);
            }
        }
        place2 = StringUtils.fitToBoxesOneThroughFour(place2,width/2-4);

        if(place1 == null && place2 ==null)
            textObj.textContent = '';
        else if(place1 == null && place2 != null)
            textObj.textContent = 'D: '+place2;
        else if(place1 != null && place2==null)
            textObj.textContent = 'B: '+place1;
        else
            textObj.textContent = 'B: '+place1+ ' D: '+place2;
        return;
    }


    private static fitToBoxesOneThroughFour(place,width){
        if(place != undefined){

            //1) Check to see if the original line can already fit in the given width
            if(place.length <= width)
                return place;

            //2) Remove all unwanted items (AKA '<', '>', '.', '(...)', etc)
            //   Check to see if the updated string is able to fit in the given width
            place = StringUtils.removeUnwants(place);

            if(place.length <= width)
                return place;

            //3) Remove all blank spaces
            //   i.e. If a string has empty spots 'Canann, , NH, USA'
            //   Check to see if the updated string is able to fit in the given width
            var places = place.split(",");
            places = StringUtils.removeSpaces(places);
            place = StringUtils.toPlaceString(places);

            if(place.length <= width)
                return place;

            //4) Remove extraneous description words
            //   Check to see if the updated string is able to fit in the given width
            //StringUtils.setUpExtraneousWords();
            places = StringUtils.removeExtraneousWords(places);
            place = StringUtils.toPlaceString(places);

            if(place.length <= width)
                return place;

            //5) Shorten North, South, East, and West to N, S, E, and W respectively
            //   Check to see if the updated string is able to fit in the given width
            places = StringUtils.abbreviateDirections(places);
            place = StringUtils.toPlaceString(places);

            if(place.length <= width)
                return place;

            //6) Abbreviate the country
            //   Check to see if the updated string is able to fit in the given width
            places = StringUtils.abbreviateCountry(places);
            place = StringUtils.toPlaceString(places);

            if(place.length <= width)
                return place;

            //7) Remove all vowels from the places besides the state and country
            //   Check to see if the updated string is able to fit in the given width
            places = StringUtils.removeVowels2(places);
            place = StringUtils.toPlaceString(places);

            if(place.length <= width)
                return place;

            //8) Remove everything besides the last 2 positions
            places = StringUtils.removePlacesBelow2(places);
            place = StringUtils.toPlaceString(places);
            if(place.length <= width)
                return place;

            //9) Remove everything besides the last position
            places = StringUtils.removePlacesBelowLast(places);
            place = StringUtils.toPlaceString(places);

        }
        return place;
    }

    private static fitToBoxesFiveAndSix(place){
        if(place != undefined){
            var places = place.split(",");
            var places2 = places[(places.length-1)].split(" ");

            //If some form of the united states is in the last position of the place string
            if(StringUtils.isUnitedStates(places[(places.length-1)].toLowerCase().trim())){
                return "USA";
            }

            //If the last position of the place string is a country contained in the countryAbbrMap
            else if((places[(places.length-1)].toLowerCase().trim()) in StringUtils.countryAbbrMap){
                return StringUtils.countryAbbrMap[places[(places.length-1)].toLowerCase().trim()];
            }

            //If the last position of the place string is a state in the united states
            else if((places[(places.length-1)].toLowerCase().trim()) in StringUtils.stateAbbrMap){
                return StringUtils.stateAbbrMap[places[(places.length-1)].toLowerCase().trim()];
            }

            //If the last position is empty, check to see if the second to last is a state
            else if(places[(places.length-2)] != undefined && (places[(places.length-2)].toLowerCase().trim()) in StringUtils.stateAbbrMap){
                return StringUtils.stateAbbrMap[places[(places.length-2)].toLowerCase().trim()];
            }

            //If by chance the last position is a long place without any commas
            //i.e. instead of 'Manchester, England' it shows 'Manchester England'
            //Split the string at the spaces and check if the last part is a country
            else if(places2[(places2.length-1)].toLowerCase().trim() in StringUtils.countryAbbrMap){
                return StringUtils.countryAbbrMap[places2[(places2.length-1)].toLowerCase().trim()];
            }

            //if no known abbreviation exists, just make the place blank
            else{
                return "";
            }
        }

        //if place is undefined, define it as "" instead of 'unknown'
        return "";
    }

    private static extraneousWords = ['county','co','co.','twp','twp.','township','district','dist','dist.','prob',
        'near','from']
    private static stateAbbrMap = {}
    private static countryAbbrMap = {}
    private static carrots = false
    private static statesInitialized = false
    private static countriesInitialized = false

    //-------------------------------
    //Removes '<'' and '>' from the place
    //This assumes that there is only one set of '<' and '>'
    //and that '>' always comes after '<', and only if '<' is contained in the place
    //
    //(AKA, they cannot have: 'Richmond, Connecticut>' or '<San Diego, California')
    //
    //example:
    //'<Seattle, Washington>'
    //returns
    //'Seattle, Washington'
    //-------------------------------
    private static removeCarrots(place){
        var openCarrot = place.indexOf("<");
        var closeCarrot = place.indexOf(">");

        if (openCarrot != -1 && closeCarrot != -1) {
            var newPlace = "";

            if (openCarrot != 0)
                newPlace = place.substring(0, openCarrot - 1);

            newPlace = newPlace.concat(place.substring(openCarrot + 1, closeCarrot));

            if (closeCarrot != (place.length - 1))
                newPlace = newPlace.concat(place.substring(closeCarrot + 1));

            return newPlace;
        }

        return place;
    }

    //-------------------------------
    //Removes parenthesis from the place, and everything inside
    //Assumes that if there is a '(', then there will also be a ')'
    //
    //Example:
    //'London, England (now part of the United Kingdom)'
    //returns
    //'London, England'
    //-------------------------------
    private static removeParenthesis(place){
        var openParen = place.indexOf('(');
        var closeParen = place.indexOf(')');

        if (openParen != -1 && closeParen != -1) {
            var newPlace = "";
            if (openParen != 0)
                newPlace = place.substring(0, openParen);
            if (closeParen != (place.length - 1))
                newPlace = newPlace.concat(place.substring(closeParen + 1));
            return newPlace;
        }

        return place;
    }

    //-------------------------------
    //Checks to make sure the last character is not a comma
    //If it is, then it will remove it from place
    //-------------------------------
    private static removeLastComma(place){
        if (place.charAt(place.length - 1) === ',')
            return place.substring(0, place.length() - 1);
        return place;
    }

    //-------------------------------
    //Removes 'of' from the place
    //
    //Example:
    //'Saxony, of Germany'
    //returns
    //'Saxony, Germany'
    //-------------------------------
    private static removeOf(place){
        var temp = place.toLowerCase();

        if (StringUtils.findLastOf(temp)) { //if there is an 'of' at the end of place
            //remove it
            return place.substring(0, (place.length - 2));
        }

        var of = temp.indexOf("of ");

        if (of != -1) {
            var newPlace = "";
            if (of != 0)
                newPlace = place.substring(0, of);
            if ((of + 2) != (place.length - 1))
                newPlace = newPlace.concat(place.substring(of + 3));
            return newPlace;
        }

        return place;
    }

    //-------------------------------
    //Checks if there is an 'of' at the end of place
    //-------------------------------
    private static findLastOf(place){
        if (place[place.length - 1] === 'f') {
            if (place[place.length - 2] === 'o') {
                if (place[place.length - 3] === ' ') {
                    return true;
                }
            }
        }
        return false;
    }

    //-------------------------------
    //Removes the first instance of the given character c from place
    //-------------------------------
    /*private static removeChar(place,c){
        var location = place.indexOf(c);
        if (location != -1) {
            var newPlace = "";
            if (location != 0)
                newPlace = place.substring(0, location);
            if (location != (place.length - 1))
                newPlace = newPlace.concat(place.substring(location + 1));
            return newPlace;
        }
        return place;
    }*/

    //-------------------------------
    //Removes all carrots, parenthesis, '.', '?', trailing commas,
    // and trailing white space from place. It is contained in a loop
    //until the string in the beginning of the loop is equal to the string
    //at the end of the loop (AKA, there were no more changes made). This is
    //to make sure that if there are multiple unwanted characters (like 3 periods
    //in the name) they are all removed before sending it back.
    //-------------------------------
    private static removeUnwantsP(place){
        var before = "";
        var after = place;
        do {
            before = after;
            after = StringUtils.removeCarrots(after);
            after = StringUtils.removeParenthesis(after);
            after = StringUtils.removeChar(after, '?');
            after = StringUtils.removeChar(after, '.');
            after = StringUtils.removeOf(after);
            after = after.trim();
            after = StringUtils.removeLastComma(after);

        } while (after.toLowerCase() != before.toLowerCase())

        return after;
    }

    //-------------------------------
    //Removes the vowels. If it is only one letter, it returns
    //it whether or not it is a vowel. Also, the first letter is
    //always skipped in the name, so the gist of the name can be preserved.
    //
    //Example:
    //'Germany'
    //Returns
    //'Grmny'
    //-------------------------------
    private static removeVowels(oldString){
        if (oldString.length <= 1)
            return oldString;

        var result = oldString.substring(0, 1);
        for (var i = 1; i < oldString.length; i++) {
            var check = oldString.substring(i, i + 1);
            var lower = check.toLowerCase();
            if(lower != 'a' && lower != 'e' && lower != 'i' && lower != 'o' && lower != 'u')
                result = result.concat(check);
        }

        return result;
    }

    //Removes the vowels of all words below the last two positions
    private static removeVowels2(places){
        if(places.length >= 3){
            for(var i = 0; i < places.length-2; i++){
                if(places[i] != null){
                    var words = places[i].split(" ");
                    places[i] = "";
                    for(var j = 0; j < words.length; j++){
                        words[j] = StringUtils.removeVowels(words[j]);
                        places[i] = places[i].concat(words[j] + " ");
                    }
                    places[i] = places[i].trim();
                }
            }
        }
        return places;
    }

    //-------------------------------
    //Concats the place string together again, separating the
    //words with a comma and a space.
    //-------------------------------
    private static toPlaceString(places){
        var result = "";
        if(!places)
            return result;
        for(var i = 0; i < places.length; i++){
            if(places[i] != null && places[i] != "")
                result = result.concat((places[i] + ", "));
        }
        if(result.length === 0)
            return result;

        result = result.substring(0, result.length-2); //deletes extra ', '
        return result;
    }

    //-------------------------------
    //Capitalizes first letters of strings only
    //-------------------------------
    private static firstLetterCapsOnly(line){
        var places = line.split(',');
        var finalString = "";
        for(var i = 0; i < places.length; i++){
            var place = places[i];
            place = place.trim();
            var split = place.split(" ");
            var finalPlace = "";

            for(var j = 0; j < split.length; j++){
                var name = split[j];
                if(name != null){
                    if(name.length() > 3) {
                        name = name.toLowerCase();
                        var lowername = name.substring(1);
                        name = name.substring(0,1);
                        name = name.toUpperCase();
                        name = name.concat(lowername);
                    }
                    finalPlace = finalPlace.concat(name + " ");
                }
            }

            finalPlace = finalPlace.trim();
            finalString = finalString.concat(finalPlace + ", ");
        }
        finalString = finalString.substring(0, finalString.length-2); //deletes extra ", "
        return finalString;
    }

    //-------------------------------
    //Removes the empty spots in places
    //i.e. If a place is 'Kanab, , UT, USA'
    //     Returns 'Kanab, UT, USA'
    //-------------------------------
    private static removeSpaces(places){
        for(var i = 0; i < places.length; i++){
            places[i] = places[i].trim();
        }

        //if the towns/places are unknown, but not null, remove
        for(var i = 0; i < places.length; i++){
            if(places[i] === ""){
                places[i] = null;
            }
        }
        return places;
    }

    //-------------------------------
    //Finds the extraneous words via the extraneous words list
    //And removes them
    //-------------------------------
    private static removeExtraneousWords(places) {
        for(var i = 0; i < places.length-1; i++){
            if(places[i] != null && places[i] != ""){
                var extran = places[i].split(" ");
                places[i] = "";
                for (var j = 0; j < extran.length; j++){
                    var word = extran[j].toLowerCase();
                    if(StringUtils.extraneousWords.indexOf(word) < 0){
                        places[i] = places[i].concat(extran[j] + " ");
                    }
                }
                places[i] = places[i].trim();
            }
        }
        return places;
    }

    //-------------------------------
    //Abbreviates the words North, East, West, South to N, E, W, S respectively
    //-------------------------------
    private static abbreviateDirections(places){
        for(var i = 0; i < places.length-1; i++){
            if(places[i] != null){
                var split = places[i].split(" ");
                places[i] = "";
                for(var j = 0; j < split.length; j++){
                    var word = split[j].toLowerCase();
                    if(word === "north")
                        places[i] = places[i].concat("N ");
                    else if(word === "east")
                        places[i] = places[i].concat("E ");
                    else if(word === "south")
                        places[i] = places[i].concat("S ");
                    else if(word === "west")
                        places[i] = places[i].concat("W ");
                    else
                        places[i] = places[i].concat(split[j] + " ");
                }
                places[i] = places[i].trim();
            }
        }
        return places;
    }

    //-------------------------------
    //Returns the expected index of the county
    //Assumes the county will be one position below the state
    //Returns -1 if the place does not have enough strings
    //-------------------------------
    private static getCountryIndex(places){
        if(places.length >= 4){ //Only if place is long enough to hold a county
            if(StringUtils.isUnitedStates(places[(places.length-1)].toLowerCase().trim())){
                if(places[(places.length-2)].toLowerCase().trim() in StringUtils.stateAbbrMap){
                    return (places.length-3);
                }
                else
                    return (places.length-2);
            }
            else
                return (places.length-2);
        }
        return -1;
    }
    //-------------------------------
    //Removes the county
    //If input is -1, does nothing
    //-------------------------------
    private static removeCounty(place){
        if(place != undefined){
            var places = place.split(",");
            if(places.length >= 4){
                var length = places.length - 2;
                for(var i = 1; i < length; i++){
                    places[i] = null;
                }
            }
            return StringUtils.toPlaceString(places);
        }
        return place;
    }

    //-------------------------------
    //Returns the state index
    //If input is -1, returns -1
    //Assumes the state is one above the county
    //-------------------------------
    private static getStateIndex(county){
        if(county != -1){
            return (county + 1);
        }
        return -1;
    }

    //-------------------------------
    //Removes everything in place except for last 2 positions
    //-------------------------------
    private static removePlacesBelow2(places){
        var startIndex =-1;
        if(places.length >= 3){
            for(var i = places.length - 2; i >= 0; i--){
                if(places[i] != null && places[i] != ""){
                    startIndex = i; //gets the first non-null place
                    break;
                }
            }

            if(startIndex != -1){
                for(var i = 0; i < startIndex; i++){
                    places[i] = "";//null;
                }
            }
            return places;
        }
    }

    //-------------------------------
    //Removes everything in place except for last position
    //-------------------------------
    private static removePlacesBelowLast(places){
        var startIndex =-1;
        if(places.length >= 2){
            for(var i = places.length - 1; i >= 0; i--){
                if(places[i] != null && places[i]!= ""){
                    startIndex = i; //gets the first non-null place
                    break;
                }
            }

            if(startIndex != -1){
                for(var i = 0; i < startIndex; i++){
                    places[i] = "";//null;
                }
            }
            return places;
        }
    }

    private static abbreviateCountry(places){
        for(var i = 0; i < places.length; i++){
            if (places[i] == null) {
            }
            else if (places[i].toLowerCase().trim() in StringUtils.countryAbbrMap) {
                places[i] = StringUtils.countryAbbrMap[places[i].toLowerCase().trim()];
            }
        }
        return places;
    }

    //-------------------------------
    //Checks if the country is the United States
    //-------------------------------
    private static isUnitedStates(place){
        place = place.replace(/\s+/g, ''); //take out all whitespace
        if(place === "unitedstates" ||
            place === "usa" ||
            place === "u.s.a" ||
                //place === "united states" ||
                //place === "u s a" ||
            place === "us" ||
            place === "u.s." ||
                //place === "u. s. a." ||
                //place === "u. s." ||
            place === "untdstts" ||
                //place === "untd stts" ||
            place === "usofa" ||
                //place === "u s of a" ||
            place === "america" ||
                //place === "united states of america")
            place === "unitedstatesofamerica")
            return true;

        return false;
    }
    //-------------------------------
    //Creates the map for stateAbbrMap
    //The keys of the map are the long form of the state
    //The values of the map are the abbreviated form
    //-------------------------------
    private static initializeStates(){
        if(StringUtils.statesInitialized === true) //initializes only once
            return;

        else
            StringUtils.statesInitialized = true;

        StringUtils.stateAbbrMap["alaska"] = "AK";StringUtils.stateAbbrMap["ak"] = "AK";
        StringUtils.stateAbbrMap["american samoa"] = "AS";StringUtils.stateAbbrMap["as"] = "AS";
        StringUtils.stateAbbrMap["arizona"] = "AZ";StringUtils.stateAbbrMap["az"] = "AZ";
        StringUtils.stateAbbrMap["arkansas"] = "AR";StringUtils.stateAbbrMap["ar"] = "AR";
        StringUtils.stateAbbrMap["california"] = "CA";StringUtils.stateAbbrMap["ca"] = "CA";
        StringUtils.stateAbbrMap["colorado"] = "CO";StringUtils.stateAbbrMap["co"] = "CO";
        StringUtils.stateAbbrMap["connecticut"] = "CT";StringUtils.stateAbbrMap["ct"] = "CT";
        StringUtils.stateAbbrMap["conn"] = "CT";StringUtils.stateAbbrMap["cn"] = "CT";
        StringUtils.stateAbbrMap["conn."] = "CT";StringUtils.stateAbbrMap["ct."] = "CT";
        StringUtils.stateAbbrMap["delaware"] = "DE";StringUtils.stateAbbrMap["de"] = "DE";
        StringUtils.stateAbbrMap["district of columbia"] = "DC";StringUtils.stateAbbrMap["dc"] = "DC";
        StringUtils.stateAbbrMap["d.c."] = "DC";
        StringUtils.stateAbbrMap["federated states of micronesia"] = "FM";StringUtils.stateAbbrMap["fm"] = "FM";
        StringUtils.stateAbbrMap["florida"] = "FL";StringUtils.stateAbbrMap["fl"] = "FL";
        StringUtils.stateAbbrMap["georgia"] = "GA";StringUtils.stateAbbrMap["ga"] = "GA";
        StringUtils.stateAbbrMap["guam"] = "GU";StringUtils.stateAbbrMap["gu"] = "GI";
        StringUtils.stateAbbrMap["hawaii"] = "HI";StringUtils.stateAbbrMap["hi"] = "HI";
        StringUtils.stateAbbrMap["idaho"] = "ID";StringUtils.stateAbbrMap["id"] = "ID";
        StringUtils.stateAbbrMap["illinois"] = "IL";StringUtils.stateAbbrMap["il"] = "IL";
        StringUtils.stateAbbrMap["indiana"] = "IN";StringUtils.stateAbbrMap["in"] = "IN";
        StringUtils.stateAbbrMap["iowa"] = "IA";StringUtils.stateAbbrMap["ia"] = "IA";
        StringUtils.stateAbbrMap["kansas"] = "KS";StringUtils.stateAbbrMap["ks"] = "KS";
        StringUtils.stateAbbrMap["kentucky"] = "KY";StringUtils.stateAbbrMap["ky"] = "KY";
        StringUtils.stateAbbrMap["louisiana"] = "LA";StringUtils.stateAbbrMap["la"] = "LA";
        StringUtils.stateAbbrMap["maine"] = "ME";StringUtils.stateAbbrMap["me"] = "ME";
        StringUtils.stateAbbrMap["marshall islands"] = "MH";StringUtils.stateAbbrMap["mh"] = "MH";
        StringUtils.stateAbbrMap["maryland"] = "MD";StringUtils.stateAbbrMap["md"] = "MD";
        StringUtils.stateAbbrMap["massachusetts"] = "MA";StringUtils.stateAbbrMap["ma"] = "MA";
        StringUtils.stateAbbrMap["mass."] = "MA";StringUtils.stateAbbrMap["mass"] = "MA";
        StringUtils.stateAbbrMap["michigan"] = "MI";StringUtils.stateAbbrMap["mi"] = "MI";
        StringUtils.stateAbbrMap["minnesota"] = "MN";StringUtils.stateAbbrMap["mn"] = "MN";
        StringUtils.stateAbbrMap["mississippi"] = "MS";StringUtils.stateAbbrMap["ms"] = "MS";
        StringUtils.stateAbbrMap["missouri"] = "MO";StringUtils.stateAbbrMap["mo"] = "MO";
        StringUtils.stateAbbrMap["montana"] = "mt";StringUtils.stateAbbrMap["mt"] = "MT";
        StringUtils.stateAbbrMap["nebraska"] = "NE";StringUtils.stateAbbrMap["ne"] = "NE";
        StringUtils.stateAbbrMap["nevada"] = "NV";StringUtils.stateAbbrMap["nv"] = "NV";
        StringUtils.stateAbbrMap["new hampshire"] = "NH";StringUtils.stateAbbrMap["nh"] = "NH";
        StringUtils.stateAbbrMap["new jersey"] = "NJ";StringUtils.stateAbbrMap["nj"] = "NJ";
        StringUtils.stateAbbrMap["new mexico"] = "NM";StringUtils.stateAbbrMap["nm"] = "NM";
        StringUtils.stateAbbrMap["new york"] = "NY";StringUtils.stateAbbrMap["ny"] = "NY";
        StringUtils.stateAbbrMap["n. y."] = "NY";StringUtils.stateAbbrMap["n.y."] = "NY";
        StringUtils.stateAbbrMap["north carolina"] = "NC";StringUtils.stateAbbrMap["nc"] = "NC";
        StringUtils.stateAbbrMap["n. carolina"] = "NC";StringUtils.stateAbbrMap["n.carolina"] = "NC";
        StringUtils.stateAbbrMap["no. carolina"] = "NC";StringUtils.stateAbbrMap["n carolina"] = "NC";
        StringUtils.stateAbbrMap["no carolina"] = "NC";StringUtils.stateAbbrMap["no.carolina"] = "NC";
        StringUtils.stateAbbrMap["north dakota"] = "ND";StringUtils.stateAbbrMap["nd"] = "ND";
        StringUtils.stateAbbrMap["n. dakota"] = "ND";StringUtils.stateAbbrMap["n.dakota"] = "ND";
        StringUtils.stateAbbrMap["no. dakota"] = "ND";StringUtils.stateAbbrMap["no dakota"] = "ND";
        StringUtils.stateAbbrMap["no.dakota"] = "ND";
        StringUtils.stateAbbrMap["northern mariana islands"] = "MP";StringUtils.stateAbbrMap["mp"] = "MP";
        StringUtils.stateAbbrMap["ohio"] = "OH";StringUtils.stateAbbrMap["oh"] = "OH";
        StringUtils.stateAbbrMap["oklahoma"] = "OK";StringUtils.stateAbbrMap["ok"] = "OK";
        StringUtils.stateAbbrMap["oregon"] = "OR";StringUtils.stateAbbrMap["or"] = "OR";
        StringUtils.stateAbbrMap["palau"] = "PW";StringUtils.stateAbbrMap["pw"] = "PW";
        StringUtils.stateAbbrMap["pennsylvania"] = "PA";StringUtils.stateAbbrMap["pa"] = "PA";
        StringUtils.stateAbbrMap["puerto rico"] = "PR";StringUtils.stateAbbrMap["pr"] = "PR";
        StringUtils.stateAbbrMap["rhode island"] = "RI";StringUtils.stateAbbrMap["ri"] = "RI";
        StringUtils.stateAbbrMap["south carolina"] = "SC";StringUtils.stateAbbrMap["sc"] = "SC";
        StringUtils.stateAbbrMap["s. carolina"] = "SC";StringUtils.stateAbbrMap["s.carolina"] = "SC";
        StringUtils.stateAbbrMap["so. carolina"] = "SC";StringUtils.stateAbbrMap["s carolina"] = "SC";
        StringUtils.stateAbbrMap["so.carolina"] = "SC";StringUtils.stateAbbrMap["so carolina"] = "SC";
        StringUtils.stateAbbrMap["south dakota"] = "SD";StringUtils.stateAbbrMap["sd"] = "SD";
        StringUtils.stateAbbrMap["s. dakota"] = "SD";StringUtils.stateAbbrMap["s.dakota"] = "SD";
        StringUtils.stateAbbrMap["so dakota"] = "SD";StringUtils.stateAbbrMap["s dakota"] = "SD";
        StringUtils.stateAbbrMap["so. dakota"] = "SD";StringUtils.stateAbbrMap["so.dakota"] = "SD";
        StringUtils.stateAbbrMap["tennessee"] = "TN";StringUtils.stateAbbrMap["tn"] = "TN";
        StringUtils.stateAbbrMap["texas"] = "TX";StringUtils.stateAbbrMap["tx"] = "TX";
        StringUtils.stateAbbrMap["utah"] = "UT";StringUtils.stateAbbrMap["ut"] = "UT";
        StringUtils.stateAbbrMap["vermont"] = "VT";StringUtils.stateAbbrMap["vt"] = "VT";
        StringUtils.stateAbbrMap["virgian islands"] = "VI";StringUtils.stateAbbrMap["vi"] = "VI";
        StringUtils.stateAbbrMap["virginia"] = "VA";StringUtils.stateAbbrMap["va"] = "VA";
        StringUtils.stateAbbrMap["washington"] = "WA";StringUtils.stateAbbrMap["wa"] = "WA";
        StringUtils.stateAbbrMap["west virginia"] = "WV";StringUtils.stateAbbrMap["wv"] = "WV";
        StringUtils.stateAbbrMap["w.virginia"] = "WV";StringUtils.stateAbbrMap["w. virginia"] = "WV";
        StringUtils.stateAbbrMap["w virginia"] = "WV";
        StringUtils.stateAbbrMap["wisconsin"] = "WI";StringUtils.stateAbbrMap["wi"] = "WI";
        StringUtils.stateAbbrMap["wyoming"] = "WY";StringUtils.stateAbbrMap["wy"] = "WY";

        //I'm just going to throw up the canadian provinces as well.
        StringUtils.stateAbbrMap["alberta"] = "AB";StringUtils.stateAbbrMap["ab"] = "AB";
        StringUtils.stateAbbrMap["british colombia"] = "BC";StringUtils.stateAbbrMap["bc"] = "BC";
        StringUtils.stateAbbrMap["manitoba"] = "MB";StringUtils.stateAbbrMap["mb"] = "MB";
        StringUtils.stateAbbrMap["new brunswick"] = "NB";StringUtils.stateAbbrMap["nb"] = "NB";
        StringUtils.stateAbbrMap["newfoundland and labrador"] = "NL";StringUtils.stateAbbrMap["nl"] = "NL";
        StringUtils.stateAbbrMap["nova scotia"] = "NS";StringUtils.stateAbbrMap["ns"] = "NS";
        StringUtils.stateAbbrMap["northwest territories"] = "NT";StringUtils.stateAbbrMap["nt"] = "NT";
        StringUtils.stateAbbrMap["nunavut"] = "NU";StringUtils.stateAbbrMap["nu"] = "NU";
        StringUtils.stateAbbrMap["ontario"] = "ON";StringUtils.stateAbbrMap["on"] = "ON";
        StringUtils.stateAbbrMap["prince edward island"] = "PE";StringUtils.stateAbbrMap["pe"] = "PE";
        StringUtils.stateAbbrMap["quebec"] = "QC";StringUtils.stateAbbrMap["qc"] = "QC";
        StringUtils.stateAbbrMap["saskatchewan"] = "SK";StringUtils.stateAbbrMap["sk"] = "SK";
        StringUtils.stateAbbrMap["yukon"] = "YT";StringUtils.stateAbbrMap["yt"] = "YT";
    }

    //-------------------------------
    //Creates the map for countryAbbrMap
    //The keys of the map are the long form of the country
    //The values of the map are the abbreviated form
    //-------------------------------
    public static initializeCountries(){
        if(StringUtils.countriesInitialized === true) //initializes only once
            return;

        else
            StringUtils.countriesInitialized = true;

        StringUtils.countryAbbrMap["unitedstates"] = "USA";
        StringUtils.countryAbbrMap["usa"] = "USA";
        StringUtils.countryAbbrMap["u.s.a."] = "USA";
        StringUtils.countryAbbrMap["united states"] = "USA";
        StringUtils.countryAbbrMap["u s a"] = "USA";
        StringUtils.countryAbbrMap["us"] = "USA";
        StringUtils.countryAbbrMap["u.s."] = "USA";
        StringUtils.countryAbbrMap["u. s. a."] = "USA";
        StringUtils.countryAbbrMap["u. s."] = "USA";
        StringUtils.countryAbbrMap["untd stts"] = "USA";
        StringUtils.countryAbbrMap["u s of a"] = "USA";
        StringUtils.countryAbbrMap["america"] = "USA";
        StringUtils.countryAbbrMap["united states of america"] = "USA";

        StringUtils.countryAbbrMap["canada"] = "CAN"; StringUtils.countryAbbrMap["can"] = "CAN";
        StringUtils.countryAbbrMap["mexico"] = "MEX";StringUtils.countryAbbrMap["m�xico"] = "MEX";
        StringUtils.countryAbbrMap["american samoa"] = "ASM";

        //North american regions
        StringUtils.countryAbbrMap["new england"] = "NENG";

        StringUtils.countryAbbrMap["acadia"] = "ACA";
        StringUtils.countryAbbrMap["albania"] = "ALB";
        StringUtils.countryAbbrMap["algeria"] = "DZA";
        StringUtils.countryAbbrMap["andorra"] = "AND";
        StringUtils.countryAbbrMap["anguilla"] = "AIA";
        StringUtils.countryAbbrMap["antarctica"] = "ATA";
        StringUtils.countryAbbrMap["argentina"] = "ARG";
        StringUtils.countryAbbrMap["armenia"] = "ARM";
        StringUtils.countryAbbrMap["aruba"] = "ABW";
        StringUtils.countryAbbrMap["austria"] = "AUT";
        StringUtils.countryAbbrMap["australia"] = "AUS";StringUtils.countryAbbrMap["australian colonies"] = "AUS";
        StringUtils.countryAbbrMap["azerbaijan"] = "AZE";
        StringUtils.countryAbbrMap["AZORES"] = "AZR";
        StringUtils.countryAbbrMap["oesterreich"] = "AUT";
        StringUtils.countryAbbrMap["bahamas"] = "BHS";
        StringUtils.countryAbbrMap["bahrain"] = "BHR";
        StringUtils.countryAbbrMap["bangladesh"] = "BGD";
        StringUtils.countryAbbrMap["barbados"] = "BRB";
        StringUtils.countryAbbrMap["belarus"] = "BLR";
        StringUtils.countryAbbrMap["belgium"] = "BEL";
        StringUtils.countryAbbrMap["belize"] = "BLZ";
        StringUtils.countryAbbrMap["benin"] = "BEN";
        StringUtils.countryAbbrMap["bermuda"] = "BMU";
        StringUtils.countryAbbrMap["bhutan"] = "BTN";
        StringUtils.countryAbbrMap["bolivia"] = "BOL";
        StringUtils.countryAbbrMap["bosnia"] = "BIH";
        StringUtils.countryAbbrMap["bosnia and herzegovinia"] = "BIH";StringUtils.countryAbbrMap["bosnia herzegovinia"] = "BIH";
        StringUtils.countryAbbrMap["botswana"] = "BWA";
        StringUtils.countryAbbrMap["bouvet"] = "BVT";
        StringUtils.countryAbbrMap["bouvet island"] = "BVT";
        StringUtils.countryAbbrMap["brazil"] = "BRA";
        StringUtils.countryAbbrMap["british empire"] = "BRT";
        StringUtils.countryAbbrMap["brunei darussalam"] = "BRN";
        StringUtils.countryAbbrMap["bulgaria"] = "BGR";
        StringUtils.countryAbbrMap["burkina faso"] = "BFA";
        StringUtils.countryAbbrMap["bouvet"] = "BVT";
        StringUtils.countryAbbrMap["burundi"] = "BDI";
        StringUtils.countryAbbrMap["croatia"] = "HRV";
        StringUtils.countryAbbrMap["cambodia"] = "KHM";
        StringUtils.countryAbbrMap["cameroon"] = "CMR";
        StringUtils.countryAbbrMap["cape colony"] = "CAP";
        StringUtils.countryAbbrMap["cape verde"] = "CPV";
        StringUtils.countryAbbrMap["cayman islands"] = "CYM";
        StringUtils.countryAbbrMap["chad"] = "TCD";
        StringUtils.countryAbbrMap["chile"] = "CHL";
        StringUtils.countryAbbrMap["china"] = "CHN";
        StringUtils.countryAbbrMap["christmas island"] = "CXR";
        StringUtils.countryAbbrMap["cocos islands"] = "CCK";StringUtils.countryAbbrMap["cocos"] = "CCK";
        StringUtils.countryAbbrMap["keeling islands"] = "CCK";StringUtils.countryAbbrMap["keeling"] = "CCK";
        StringUtils.countryAbbrMap["columbia"] = "COL";
        StringUtils.countryAbbrMap["comoros"] = "COM";
        StringUtils.countryAbbrMap["cook islands"] = "COK";
        StringUtils.countryAbbrMap["congo"] = "COG";
        StringUtils.countryAbbrMap["costa rica"] = "CRI";
        StringUtils.countryAbbrMap["cote d'ivoire"] = "CIV";
        StringUtils.countryAbbrMap["ivory coast"] = "CIV";
        StringUtils.countryAbbrMap["cyprus"] = "CYP";
        StringUtils.countryAbbrMap["czechoslovakia"] = "CSK";
        StringUtils.countryAbbrMap["czech republic"] = "CZE";
        StringUtils.countryAbbrMap["czech"] = "CZE";
        StringUtils.countryAbbrMap["channel islands"] = "CHI";
        StringUtils.countryAbbrMap["denmark"] = "DNMK";
        StringUtils.countryAbbrMap["djibouti"] = "DJI";
        StringUtils.countryAbbrMap["dominica"] = "DMA";
        StringUtils.countryAbbrMap["danmark"] = "DNK"; //apparently some people spell it this way
        StringUtils.countryAbbrMap["denmark"] = "DNK";
        StringUtils.countryAbbrMap["dominican"] = "DOM";
        StringUtils.countryAbbrMap["el salvador"] = "SLE";
        StringUtils.countryAbbrMap["england"] = "ENG";StringUtils.countryAbbrMap["engl"] = "ENG";
        StringUtils.countryAbbrMap["engl."] = "ENG";StringUtils.countryAbbrMap["eng"] = "ENG";
        StringUtils.countryAbbrMap["eng."] = "ENG";
        StringUtils.countryAbbrMap["ecuador"] = "ECU";
        StringUtils.countryAbbrMap["egypt"] = "EGY";
        StringUtils.countryAbbrMap["equatorial guinea"] = "GNQ";
        StringUtils.countryAbbrMap["eritrea"] = "ERI";
        StringUtils.countryAbbrMap["estonia"] = "EST";
        StringUtils.countryAbbrMap["ethiopia"] = "ETH";
        StringUtils.countryAbbrMap["falkland islands"] = "FLK";
        StringUtils.countryAbbrMap["malvinas"] = "FLK";
        StringUtils.countryAbbrMap["faroe"] = "FRO";
        StringUtils.countryAbbrMap["federated states of micronesia"] = "FSM";
        StringUtils.countryAbbrMap["fiji"] = "FJI";
        StringUtils.countryAbbrMap["finland"] = "FIN";
        StringUtils.countryAbbrMap["flanders"] = "FLD";
        StringUtils.countryAbbrMap["france"] = "FRA";
        StringUtils.countryAbbrMap["french guiana"] = "GUF";
        StringUtils.countryAbbrMap["french polynesia"] = "PYF";
        StringUtils.countryAbbrMap["gabon"] = "GAB";
        StringUtils.countryAbbrMap["gambia"] = "GMB";
        StringUtils.countryAbbrMap["georgia"] = "GEO";
        StringUtils.countryAbbrMap["germany"] = "GER";
        StringUtils.countryAbbrMap["ghana"] = "GHA";
        StringUtils.countryAbbrMap["gibraltar"] = "GIB";
        StringUtils.countryAbbrMap["great britain"] = "GBR";
        StringUtils.countryAbbrMap["greece"] = "GRC";
        StringUtils.countryAbbrMap["greenland"] = "GRL";
        StringUtils.countryAbbrMap["grenada"] = "GRD";
        StringUtils.countryAbbrMap["guadeloupe"] = "GLP";
        StringUtils.countryAbbrMap["guam"] = "GUM";
        StringUtils.countryAbbrMap["guatemala"] = "GTM";
        StringUtils.countryAbbrMap["guyana"] = "GUY";
        StringUtils.countryAbbrMap["guinea"] = "GIN";
        StringUtils.countryAbbrMap["guinea-bissaue"] = "GNB";
        StringUtils.countryAbbrMap["guinea-bissau"] = "GNB";
        StringUtils.countryAbbrMap["guinea bissaue"] = "GNB";
        StringUtils.countryAbbrMap["guinea bissau"] = "GNB";
        StringUtils.countryAbbrMap["haiti"] = "HTI";
        StringUtils.countryAbbrMap["holland"] = "HOL";
        StringUtils.countryAbbrMap["hong kong"] = "HKG";
        StringUtils.countryAbbrMap["honduras"] = "HND";
        StringUtils.countryAbbrMap["hungary"] = "HUN";
        StringUtils.countryAbbrMap["magyarorszag"] = "HUN";
        StringUtils.countryAbbrMap["iceland"] = "ISL";
        StringUtils.countryAbbrMap["india"] = "IND";
        StringUtils.countryAbbrMap["indonesia"] = "IDN";
        StringUtils.countryAbbrMap["iran"] = "IRN";
        StringUtils.countryAbbrMap["iraq"] = "IRQ";
        StringUtils.countryAbbrMap["ireland"] = "IRL";
        StringUtils.countryAbbrMap["israel"] = "ISR";
        StringUtils.countryAbbrMap["italy"] = "ITA";
        StringUtils.countryAbbrMap["jamaica"] = "JAM";
        StringUtils.countryAbbrMap["jordan"] = "JOR";
        StringUtils.countryAbbrMap["japan"] = "JPN";
        StringUtils.countryAbbrMap["kazakhstan"] = "KAZ";
        StringUtils.countryAbbrMap["kenya"] = "KEN";
        StringUtils.countryAbbrMap["kiribati"] = "KIR";
        StringUtils.countryAbbrMap["korea"] = "KOR";
        StringUtils.countryAbbrMap["republic of korea"] = "KOR";
        StringUtils.countryAbbrMap["kuwait"] = "KWT";
        StringUtils.countryAbbrMap["kyrgyzstan"] = "KGZ";
        StringUtils.countryAbbrMap["laos"] = "LAO";
        StringUtils.countryAbbrMap["latvia"] = "LVA";
        StringUtils.countryAbbrMap["lebanon"] = "LBN";
        StringUtils.countryAbbrMap["lesotho"] = "LSO";
        StringUtils.countryAbbrMap["liberia"] = "LBR";
        StringUtils.countryAbbrMap["libyan arab jamhiriya"] = "LBY";
        StringUtils.countryAbbrMap["liechtenstein"] = "LIE";
        StringUtils.countryAbbrMap["lithuania"] = "LTU";
        StringUtils.countryAbbrMap["luxembourg"] = "LUX";
        StringUtils.countryAbbrMap["macau"] = "MAC";
        StringUtils.countryAbbrMap["macedonia"] = "MKD";
        StringUtils.countryAbbrMap["madagascar"] = "MDG";
        StringUtils.countryAbbrMap["malaysia"] = "MYS";
        StringUtils.countryAbbrMap["malawi"] = "MWI";
        StringUtils.countryAbbrMap["maldives"] = "MDV";
        StringUtils.countryAbbrMap["mali"] = "MLI";
        StringUtils.countryAbbrMap["malta"] = "MLT";
        StringUtils.countryAbbrMap["marshall islands"] = "MHL";
        StringUtils.countryAbbrMap["martinique"] = "MTQ";
        StringUtils.countryAbbrMap["mauritania"] = "MRT";
        StringUtils.countryAbbrMap["mauritius"] = "MUS";
        StringUtils.countryAbbrMap["mayotte"] = "MYT";
        StringUtils.countryAbbrMap["mexico"] = "MEX";
        StringUtils.countryAbbrMap["mongollia"] = "MNG";
        StringUtils.countryAbbrMap["montserrat"] = "MSR";
        StringUtils.countryAbbrMap["morocco"] = "MAR";
        StringUtils.countryAbbrMap["moldava"] = "MDA";
        StringUtils.countryAbbrMap["monaco"] = "MCO";
        StringUtils.countryAbbrMap["mozambique"] = "MOZ";
        StringUtils.countryAbbrMap["namibia"] = "NAM";
        StringUtils.countryAbbrMap["nauru"] = "NRU";
        StringUtils.countryAbbrMap["nepal"] = "NPL";
        StringUtils.countryAbbrMap["new caledonia"] = "NCL";
        StringUtils.countryAbbrMap["new zealand"] = "NZL";
        StringUtils.countryAbbrMap["new zeland"] = "NZL";
        StringUtils.countryAbbrMap["niger"] = "NER";
        StringUtils.countryAbbrMap["nigeria"] = "NGA";
        StringUtils.countryAbbrMap["nicaragua"] = "NIC";
        StringUtils.countryAbbrMap["niue"] = "NIU";
        StringUtils.countryAbbrMap["netherlands"] = "NLD";
        StringUtils.countryAbbrMap["norway"] = "NOR";
        StringUtils.countryAbbrMap["oman"] = "OMN";
        StringUtils.countryAbbrMap["pakistan"] = "PAK";
        StringUtils.countryAbbrMap["panama"] = "PAN";
        StringUtils.countryAbbrMap["paraguay"] = "PRY";
        StringUtils.countryAbbrMap["pitcairn"] = "PCN";
        StringUtils.countryAbbrMap["peru"] = "PER";
        StringUtils.countryAbbrMap["philippines"] = "PHL";
        StringUtils.countryAbbrMap["papua new guinea"] = "PNG";
        StringUtils.countryAbbrMap["poland"] = "POL";
        StringUtils.countryAbbrMap["palau"] = "PLW";
        StringUtils.countryAbbrMap["belau"] = "PLW";
        StringUtils.countryAbbrMap["portugal"] = "PRT";
        StringUtils.countryAbbrMap["qatar"] = "QAT";
        StringUtils.countryAbbrMap["reunion"] = "REU";
        StringUtils.countryAbbrMap["romania"] = "ROM";
        StringUtils.countryAbbrMap["russia"] = "RUS";
        StringUtils.countryAbbrMap["rwanda"] = "RWA";
        StringUtils.countryAbbrMap["saudi arabia"] = "SAU";
        StringUtils.countryAbbrMap["samoa"] = "WSM";
        StringUtils.countryAbbrMap["soviet union"] = "USSR";
        StringUtils.countryAbbrMap["union of soviet socialist republics"] = "USSR";
        StringUtils.countryAbbrMap["spain"] = "ESP";
        StringUtils.countryAbbrMap["saint helena"] = "SHN";
        StringUtils.countryAbbrMap["san marino"] = "SMR";
        StringUtils.countryAbbrMap["sicily"] = "SIC";
        StringUtils.countryAbbrMap["solomon islands"] = "SLB";
        StringUtils.countryAbbrMap["sierra leone"] = "SLE";
        StringUtils.countryAbbrMap["saint lucia"] = "LCA";
        StringUtils.countryAbbrMap["senegal"] = "SEN";
        StringUtils.countryAbbrMap["serbia"] = "SER";
        StringUtils.countryAbbrMap["seychelles"] = "SYC";
        StringUtils.countryAbbrMap["singapore"] = "SGP";
        StringUtils.countryAbbrMap["scotland"] = "SCT";
        StringUtils.countryAbbrMap["scot"] = "SCT";
        StringUtils.countryAbbrMap["scot."] = "SCT";
        StringUtils.countryAbbrMap["sctl"] = "SCT";
        StringUtils.countryAbbrMap["somalia"] = "SOM";
        StringUtils.countryAbbrMap["suriname"] = "SUR";
        StringUtils.countryAbbrMap["slovenia"] = "SVN";
        StringUtils.countryAbbrMap["sudan"] = "SDN";
        StringUtils.countryAbbrMap["south africa"] = "ZAF";
        StringUtils.countryAbbrMap["sri lanka"] = "LKA";
        StringUtils.countryAbbrMap["sweden"] = "SWE";
        StringUtils.countryAbbrMap["swaziland"] = "SWZ";
        StringUtils.countryAbbrMap["switzerland"] = "CHE";
        StringUtils.countryAbbrMap["togo"] = "TGO";
        StringUtils.countryAbbrMap["thailand"] = "THA";
        StringUtils.countryAbbrMap["tajikistan"] = "TJK";
        StringUtils.countryAbbrMap["tokelau"] = "TKL";
        StringUtils.countryAbbrMap["tonga"] = "TON";
        StringUtils.countryAbbrMap["transylvania"] = "TRN";
        StringUtils.countryAbbrMap["tunisia"] = "TUN";
        StringUtils.countryAbbrMap["trinidad and tobago"] = "TTO";
        StringUtils.countryAbbrMap["turkey"] = "TUR";
        StringUtils.countryAbbrMap["tuvalu"] = "TUV";
        StringUtils.countryAbbrMap["taiwan"] = "TWN";
        StringUtils.countryAbbrMap["uganda"] = "UGA";
        StringUtils.countryAbbrMap["ukraine"] = "UKR";
        StringUtils.countryAbbrMap["uruguay"] = "URY";
        StringUtils.countryAbbrMap["uzbekistan"] = "UZB";
        StringUtils.countryAbbrMap["united arab emirates"] = "ARE";
        StringUtils.countryAbbrMap["united kingdom"] = "UK";
        StringUtils.countryAbbrMap["uk"] = "UK";
        StringUtils.countryAbbrMap["venezuela"] = "VEN";
        StringUtils.countryAbbrMap["virgin island"] = "VGBG";
        StringUtils.countryAbbrMap["vanuatu"] = "VUT";
        StringUtils.countryAbbrMap["wales"] = "WLS";
        StringUtils.countryAbbrMap["western sahara"] = "ESH";
        StringUtils.countryAbbrMap["western samoa"] = "ESM";
        StringUtils.countryAbbrMap["yemen"] = "YEM";
        StringUtils.countryAbbrMap["yugoslavia"] = "YUG";
        StringUtils.countryAbbrMap["zaire"] = "ZAR";
        StringUtils.countryAbbrMap["zambia"] = "ZMB";
        StringUtils.countryAbbrMap["zimbabwe"] = "ZWE";
    }

}