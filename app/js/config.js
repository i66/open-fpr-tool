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
        var ownData = fpr.OwnData;
        var caseData = fpr.CaseData;

        //Fill in the ownData
        if (!ownData.id){
            var tempID = createUUID();
            ownData.id = tempID;
        }
        ownData.description = $("#configOwnDes").val();
        ownData.tel = $("#configOwnTel").val();
        ownData.email = $("#configOwnEmail").val();

        //Fill in the caseData
        if (!caseData.id){
            var tempID = createUUID();
            caseData.id = tempID;
        }
        caseData.description = $("#configCaseDes").val();
        caseData.district = $("#configCaseDict").val();
        caseData.address = $("#configCaseAddr").val();
        caseData.tel = $("#configCaseTel").val();
        caseData.owner = $("#configCaseOwner").val();
    });


    // onCaseGen change
    $("#configGen").click(function(evt){
        var createJsonFileAsync = fpr.createJsonFileAsync;
        var generateZipFile = fpr.generateZipFile;
        var ownData = fpr.OwnData;
        var caseData = fpr.CaseData;

        if (!createJsonFileAsync)
        {
            console.log("Cannot gen the target file due to the error message.");
            return;
        }
        var joinList =[];
        var ownPromise = createJsonFileAsync(ownData, 'own.json');
        joinList.push(ownPromise);
        var casePromise = createJsonFileAsync(caseData, 'case.json');
        joinList.push(casePromise);

        WinJS.Promise.join(joinList).then(function finishJSON(evt){
            console.log("Gen. the related json finished.\n Start to gen. the config.zip");
            generateZipFile();
            console.log("Gen. the config zip finished");
        }).then(null, function error(evt){
            console.log("Gen. the config file failed. Reason: "+ JSON.stringify(evt));
        });
    });

    $("#configTest").click(function(evt){

        $("#configOwnDes").val("瑞德測試");
        $("#configOwnTel").val("02-12345678");
        $("#configOwnEmail").val("qoo@hexsave.com");

        $("#configCaseDes").val("瑞德測試案場");
        $("#configCaseDict").val("中正區");
        $("#configCaseAddr").val("瑞德辦公室25F");
        $("#configCaseTel").val("02-353424252");
        $("#configCaseOwner").val("Qoo");
    });

})();
