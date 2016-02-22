function JSONREADER(gedData){
    var indiMap = {};
    var famMap = {};
    var youngestDate = 0;;
    var youngestIndi = {};
    var oldestDate = 2015;
    var oldestIndi = {};

    function getYoungestIndividual(){
        return youngestIndi
    }
    this.getYoungestIndividual = getYoungestIndividual

    function getIndividuals(){

        //console.log(gedData)
        readJSON();
        makeDescendantsAndAscendants()

        indiMap.latestIndi = youngestIndi
        indiMap.oldestIndi = oldestIndi

        //console.log(indiMap)
        return indiMap;
    }
    this.getIndividuals = getIndividuals;

    function readJSON(){
        for(var i = 0; i < gedData.length; i++){
            var entry = gedData[i];

            if(entry["tag"] == "INDI"){
                readIndividual(entry)
            } else if (entry["tag"] == "FAM"){
                readFamily(entry)
            }
        }


    }

    function readFamily(entry){

        var family = {};
        family.id = entry["pointer"]
        var members = entry["tree"]
        readMembers(family,members)
        famMap[family.id] = family;

    }

    function readMembers(family,members){

        var children = []

        for(var i = 0; i < members.length; i++){

            var member = members[i]

            if(member["tag"] == "HUSB"){
                family.husband = member["data"]
            }else if (member["tag"] == "WIFE"){
                family.wife = member["data"]
            }else if (member["tag"] == "CHIL"){
                children.push(member["data"])
            }else if (member["tag"] == "MARR"){
                var marriageFacts = member["tree"]
                for(var k = 0; k < marriageFacts.length;k++){
                    var fact = marriageFacts[k];
                    if(fact["tag"] == "DATE"){
                        family.marriageDate = fact["data"]
                    }else if (fact["tag"] == "PLAC"){
                        family.marriagePlace = fact["data"]
                    }
                }
            }

        }
        family.children = children
    }

    function readIndividual(entry){
        var person = {};
        person.pid = entry["pointer"]
        var facts = entry["tree"]
        readFacts(person,facts);
        //console.log(person)
        indiMap[person.pid] = person;
    }

    function readFacts(person, facts){

        for (var i = 0; i < facts.length; i++){

            var fact = facts[i];
            switch(fact["tag"]){
                case "NAME":
                    person.name = fact["data"]
                    if(fact["tree"].length!=0){
                        var names = fact["tree"]
                        for(var k = 0; k < names.length; k++){
                            var aName = names[k];
                            //console.log(aName)

                            if(aName["tag"] == "SURN"){
                                person.surname = aName["data"]
                            }else if (aName["tag"] == "GIVN"){
                                person.given = aName["data"]
                            }else if (aName["tag"] == "NICK"){
                                person.nickname = aName["data"]
                            }else if (aName["tag"] == "NSFX"){
                                person.suffixname = aName["data"]
                            }else if (aName["tag"] == "NPFX"){
                                person.prefixname = aName["data"]
                            }

                        }

                    }
                    break
                case "SEX":
                    person.gender = fact["data"]
                    break
                case "BIRT":
                    getBirthInfo(person,fact);
                    break
                case "DEAT":
                    getDeathInfo(person,fact);
                    break
                case "FAMS":
                    if (person.hasOwnProperty("familySpouse")){
                        person.familySpouse.push(fact["data"])
                    }else{
                        person.familySpouse = []
                        person.familySpouse.push(fact["data"])
                    }
                    break
                case "FAMC":
                    if(person.hasOwnProperty("familyChild")){
                        person.familyChild.push(fact["data"])
                    }else{
                        person.familyChild = []
                        person.familyChild.push(fact["data"])
                    }
                    break
                case "BAPL":
                    getBaptismInfo(person,fact)
                    break
                case "ENDL":
                    getEndowmentInfo(person,fact)
                    break
                default:
                    break
            }

        }


    }

    function getBaptismInfo(person,fact){

        var baptizeObject = {}
        var facts = fact["tree"]
        for (var i = 0; i < facts.length; i++) {

            var aFact = facts[i];
            //console.log(aFact)

            if(aFact["tag"] == "DATE"){
                baptizeObject.date = aFact["data"]
            }else if (aFact["tag"] == "TEMP"){
                baptizeObject.temple = aFact["data"]
            }else if (aFact["tag"] == "PLAC"){
                baptizeObject.place = aFact["data"]
            }

        }
        person.baptized = baptizeObject


    }

    function getEndowmentInfo(person,fact){

        var endowmentObject = {}
        var facts = fact["tree"]
        for (var i = 0; i < facts.length; i++) {

            var aFact = facts[i];
            if(aFact["tag"] == "DATE"){
                endowmentObject.date = aFact["data"]
            }else if (aFact["tag"] == "TEMP"){
                endowmentObject.temple = aFact["data"]
            }else if (aFact["tag"] == "PLAC"){
                endowmentObject.place = aFact["data"]
            }

        }
        person.endowment = endowmentObject


    }

    function getBirthInfo(person,fact){

        for(var j = 0; j < fact.tree.length; j++){

            var birthFact = fact.tree[j];

            if (birthFact["tag"] == "DATE"){
                //checkYear(birthFact["data"], person)
                person.birthdate = birthFact["data"]
            } else if (birthFact["tag"] == "PLAC"){
                person.birthplace = birthFact["data"]
            }

        }
    }

    function getDeathInfo(person,fact){

        for(var j = 0; j < fact.tree.length; j++){

            var deathFact = fact.tree[j];

            if (deathFact["tag"] == "DATE"){
                //checkYear(deathFact["data"], person)
                person.deathdate = deathFact["data"]
            } else if (deathFact["tag"] == "PLAC"){
                person.deathplace = deathFact["data"]
            }

        }
    }


    function checkYear(date, person){

        var dateArray = date.split(" ")
        var year = dateArray[dateArray.length-1].toString();
        var re = new RegExp("[0-9]{4}");
        //  if(!(year.match(re))){console.log(year)}
        // && person.hasOwnProperty("ascBranchIds")
        if ((year.match(re))&&(parseInt(year) > youngestDate)&& person.hasOwnProperty("ascBranchIds")){
            youngestDate = parseInt(year);
            youngestIndi = person.pid;
        }else if ((year.match(re))&&(parseInt(year) < oldestDate)&& person.hasOwnProperty("dscBranchIds")){
            oldestDate = parseInt(year);
            oldestIndi = person.pid;
        }
    }

    function handleMarriageFacts(person,spouse,thisFamily){
        var factBundle = {}
        if(thisFamily.hasOwnProperty("marriageDate")){
            factBundle.marriageDate = thisFamily.marriageDate
        }
        if(thisFamily.hasOwnProperty("marriagePlace")){
            factBundle.marriagePlace = thisFamily.marriagePlace
        }
        if(!person.hasOwnProperty("marriageFacts")){
            person.marriageFacts = {}
        }
        //console.log(spouse)
        indiMap[person.pid].marriageFacts[spouse] = factBundle
    }


    function makeDescendantsAndAscendants(){

        for(var key in indiMap){
            var person = indiMap[key]

            if(person.hasOwnProperty("familySpouse")){
                indiMap[key].spouses = [];
                var familySpouses = person.familySpouse
                for(var j = 0; j < familySpouses.length; j++){
                    var family = familySpouses[j]
                    var spouses = []
                    var thisFamily= famMap[family]
                    if(thisFamily.husband){
                        if(thisFamily.husband != null){
                            spouses.push(thisFamily.husband)
                        }
                    }
                    if(thisFamily.wife){
                        if(thisFamily.wife != null){
                            spouses.push(thisFamily.wife)
                        }
                    }

                    for (var k = 0; k < spouses.length; k++){
                        if(spouses[k] != key){
                            indiMap[key].spouses.push(spouses[k])
                            handleMarriageFacts(person,spouses[k],thisFamily)
                        }
                    }
                }

            }

            if(person.hasOwnProperty("familyChild")){

                person.ascBranchIds = {};
                var familyChild = person.familyChild

                for(var i = 0; i < familyChild.length; i++){

                    var family = familyChild[i]
                    person.ascBranchIds[family] = []
                    person.ascBranchIds[family].push(famMap[family].husband)
                    person.ascBranchIds[family].push(famMap[family].wife)

                }

            }

            if(person.hasOwnProperty("familySpouse")){

                person.dscBranchIds = {};
                var familySpouse = person.familySpouse
                for(var i = 0; i < familySpouse.length; i++){

                    var family = familySpouse[i]
                    var children = famMap[family].children

                    if(children.length != 0){
                        person.dscBranchIds[family] = children
                    }

                }

                if(person.hasOwnProperty("dscBranchIds")){
                    if((Object.keys(person.dscBranchIds).length == 0)){
                        delete person["dscBranchIds"]
                    }

                }

            }

            //var person = indiMap[key]
            if(person.hasOwnProperty("ascBranchIds")||person.hasOwnProperty("dscBranchIds")){
                if(person.hasOwnProperty("deathdate")){
                    checkYear(person.deathdate,person)
                }
                if(person.hasOwnProperty("birthdate")){
                    checkYear(person.birthdate,person)
                }
            }


        }//end for every key in indi map

    }//end make dsc/asc function







}
