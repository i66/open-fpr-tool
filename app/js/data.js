var fpr = window.fpr || {};

(function () {
    'use strict';

    var CurrentProject = undefined;

    var OwnerData = {
        "id": undefined, //"<string>",
        "description": undefined, //"<string>",
        "tel": undefined, //"<?string>",
        "email": undefined //"<?string>"
    };

    var CaseData = {
        "id": undefined, // <string>
        "description": undefined, // <string>
        "district": undefined, // <string>
        "address": undefined, // <string>
        "tel": undefined, // <string>
        "owner": undefined, // <string>
        "floors": []
        //    {
        //        "id": "<string> floor_id",
        //        ....
        //    }
    };

    // for the global namespace
    fpr.OwnData = OwnerData;
    fpr.CaseData = CaseData;
    fpr.CurrentProject = CurrentProject;

})();


