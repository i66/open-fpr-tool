/**
 * Created by san on 6/30/15.
 */
var fpr = window.fpr || {};
(function () {
    'use strict';
    // reference from: http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    function createUUID() {
        // http://www.ietf.org/rfc/rfc4122.txt
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    }

    // onCaseLoad change
    $("#caseLoad").change(function(evt){
        var url = $(this).val();
        fpr.CurrentProject = url;
        $("#projName").text(url);
        //TODO: loading the config files.
        console.log("Success to load~!!!");
    });
    // onCaseSave change
    $("#configSave").click(function(evt){
        //TODO: Save the Config Settings.
        console.log("hello worlddddd");
        var ownData = fpr.OwnData;
        var caseData = fpr.CaseData;
        ////TODO: ID generation.
        //if (!ownData.id){
        //    var tempID = createUUID();
        //    console.log("[San] create the temp ID:"+ tempID);
        //}
        //if (!caseData.id){
        //    var tempID = createUUID();
        //    console.log("[San] create the temp ID:"+ tempID);
        //}


    });

    // onCaseGen change
    $("#configGen").click(function(evt){
        var url = $(this).val();
        //TODO: Case Generation
        console.log("[San] On Open file"+ url);
    });

})();
