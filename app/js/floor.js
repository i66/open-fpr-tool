var fpr = window.fpr || {};

(function(){
    "use strict";
    var FloorData = fpr.FloorData;

    // ref. from: http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    function createFloorId(){
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4();
    };

    //
    if (!fpr.currentFloor){
        //TODO: this is the new pages.
        var tempId  = createFloorId();
        //TODO:
        while (FloorData.hasOwnProperty(tempId)){
            //re-create Id again.
            tempId = createFloorId();
        }
        // create the new property.
        FloorData[tempId] = undefined;
        fpr.currentFloor = tempId;
     }else{
        //TODO: this is the loader.
     }

})();