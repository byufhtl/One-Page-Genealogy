///<reference path="../model/INode.ts"/>
///<reference path="../js/jsDeclarations.ts"/>
///<reference path="FSPerson.ts"/>
/**
 * Created by curtis on 3/16/15.
 */
class FSDownloader {

    private cache: {};
    private pending: {};

    constructor() {
        this.cache = {};
        this.pending = {};
        FamilySearch.init({
            app_key: "NQ3Q-PBD8-LL9N-RCLZ-MZCZ-X7P8-7SMX-RD6N",
            environment: 'production',
            auth_callback: 'http://localhost:8000/auth/login/return/',
            http_function: $.ajax,
            deferred_function: $.Deferred
        });
    }
    hasId(id: string): boolean {
        return this.cache.hasOwnProperty(id) || this.pending.hasOwnProperty(id);
    }
    //returns a jquery promise for a FSPerson, not sure how to express this
    //in typescript. This whole method is not going to follow typescript
    //because I'm pulling most of it from virtual pedigree. Could be rewritten
    //but should work for what we need for now.
    getId(id: string): any {
        if(this.pending.hasOwnProperty(id)){
            return this.pending[id];
        }
        var defer = $.Deferred();
        var self = this;

        FamilySearch.getPersonWithRelationships(id, {persons: true}).then(
            //success
            function(response) {
                if(!response){
                    defer.reject();
                    return;
                }
                var dscBranchIds = [];
                var ascBranchIds = [];
                var person = response.getPrimaryPerson();

                var relationships = response.getChildRelationships();
                var i, rel, len;
                var tempPersonMap = {};
                var children = response.getChildren();

                var tempPersonMap = {};
                for (i = 0, len = children.length; i < len; i++) {
                    var child = children[i];
                    dscBranchIds.push(child.id);
                    tempPersonMap[child.id] = child;
                }
                //sort by birthday
                dscBranchIds.sort(function(a, b) {
                    var personA = tempPersonMap[a];
                    var personB = tempPersonMap[b];
                    var dateA = new Date();
                    var dateB = new Date();
                    if(personA && personA.$getBirth() && personB.$getDisplayBirthDate()) {
                        dateA = new Date(personA.$getDisplayBirthDate());
                    }
                    if(personB && personB.$getBirth() && personB.$getDisplayBirthDate()) {
                        dateB = new Date(personB.$getDisplayBirthDate());
                    }
                    if(dateA.getTime() == dateB.getTime())
                        return 0;
                    if(dateA.getTime() > dateB.getTime())
                        return 1;
                    return -1;
                });

                var relationships = response.getParentRelationships();
                for (i = 0, len = relationships.length; i < len; i++) {
                    rel = relationships[i];
                    if(rel.$getFatherId()) {
                        ascBranchIds.push(rel.$getFatherId());
                    }
                    if(rel.$getMotherId()) {
                        ascBranchIds.push(rel.$getMotherId());
                    }
                }
                var fsPerson = new FSPerson(id, person, ascBranchIds, dscBranchIds,null,true);
                self.cache[id] = fsPerson;
                delete self.pending[id];
                defer.resolve(fsPerson);
            },
            //failed
            function() {
                delete self.pending[id];
                defer.reject();
            });

        return defer.promise();
    }


}