/**
 * Created by san on 7/6/15.
 */
var fpr = window.fpr || {};
(function(){
    'use strict';
    var fs = require('fs');
    if (!fs){
        fpr.createJsonFileAsync = undefined;
        fpr.generateZipFile = undefined;
        return;
    }
    var path = require('path');
    var projectPath = undefined;
    // if node-webkit
    if(global && global.require){
        projectPath = path.dirname(global.require.main.filename);
    }else{
        projectPath = process.cwd();
    }
    var outputPath = path.join(projectPath, "output");
    console.log("Setup the output file path:" + outputPath);

    var outputFileList = [];

    function createJsonFileAsync(myData, filename){
        return new WinJS.Promise(function(comp, err, prg){
            var filepath = path.join(outputPath, filename);
            outputFileList.push(filepath);
            fs.writeFile(filepath, JSON.stringify(myData, null, 4), function(error) {
                if(error) {
                    err({'msg':error});
                } else {
                    comp();
                }
            });
        });
    };

    function generateZipFile(){
        var AdmZip = require('adm-zip');
        var zip = new AdmZip();
        // add local file
        var file_lens = outputFileList.length;
        for(var i =0 ; i< file_lens; i++)
        {
            var tempFile = outputFileList[i];
            zip.addLocalFile(tempFile);
        }
        // or write everything to disk
        var configZipPath = path.join(outputPath, 'config.zip');
        zip.writeZip(configZipPath);
    };

    function saveImageFileAsync(sourceUrl, targetFile){
        var outputFilePath = path.join(outputPath, targetFile);
        var writeStream = fs.createWriteStream(outputFilePath);

        return new WinJS.Promise(function(compl, err){
            writeStream.on('finish', function() {
                compl(outputFilePath);
            });
            writeStream.on('error', function(){
                err(outputFilePath);
            });
            fs.createReadStream(sourceUrl).pipe(writeStream);
        });
    };

    // the export files
    fpr.createJsonFileAsync = createJsonFileAsync;
    fpr.generateZipFile = generateZipFile;
    fpr.saveImageFileAsync = saveImageFileAsync;

})();