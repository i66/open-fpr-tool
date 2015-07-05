/**
 * Created by san on 6/30/15.
 */
var fpr = window.fpr || {};

(function () {
    'use strict';
    $(document).ready(function(){
        $("#caseConfig").click(function(evt){
            $('#main_content').load("config.html");
        });

    });

})();
