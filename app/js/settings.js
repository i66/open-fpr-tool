/**
 * Created by san on 6/30/15.
 */
var fpr = window.fpr || {};

(function () {
    'use strict';
    $(document).ready(function(){
        $("#configPage").click(function(evt){
            //TODO:

            $('#main_content').load("config.html");
        });

        $("#addFloor").click(function(evt){
           //TODO: Store the local settings
            $("#main_content").load("floor.html");
        });

    });

})();
