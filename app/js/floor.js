var fpr = window.fpr || {};

(function(){
    "use strict";
    // ref. from: http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    function createFloorId(){
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4();
    };

    function setFloorImage(filePath){
        $("#floorInfoPath").val(filePath);
        var tempImage = new Image();
        tempImage.onload = function(result){
            var imageWidth = tempImage.width;
            var imageHeight = tempImage.height;
            var rateWidth = imageWidth / floorCanvas.width;
            var rateHight = imageHeight / floorCanvas.height;
            if (rateWidth > rateHight){
                scaleRate = 1/rateWidth;
            }else{
                scaleRate = 1/rateHight;
            }
            drawWidth = (imageWidth*scaleRate).toFixed(0);
            drawHeight = (imageHeight*scaleRate).toFixed(0);
            ctx.drawImage(tempImage, 0, 0, drawWidth, drawHight);

        };
        tempImage.src = filePath;
    };

    function initNodeInput(){
        $("#nodeID").val(fpr.GlobalNodeIdCount);
        $("#nodeType").val(0);
        $("#nodeDif").val(0.2);
        $("#nodeX").val(0);
        $("#nodeY").val(0);
        $("#nodeZ").val(0);
        $("#nodeFloor").val(fpr.CurrentFloor);
        $("#nodeFaceDir").val(0);
        $("#nodeExitDir").val(0);
    };

    function initEdgeInput(){
        $("#edgeID").val(fpr.GlobalEdgeIdCount);
        $("#edgeDis").val(1);
        $("#edgeSource").val(0);
        $("#edgeTarget").val(0);
    };

    function loadFloorSettings(){
        //load floor info.
        $("#floorInfoId").val(fpr.CurrentFloor);
        var tempInfo = fpr.getCurrentFloorInfo();
        var tempInfoLens = Object.keys(tempInfo).length;
        if (tempInfoLens > 0){
            $("#floorInfoDes").val(tempInfo["description"]);
            setFloorImage(tempInfo["filePath"]);
        }

        //TODO: load node info.
        //TODO: load remote info.
        //TODO: locd edge info.

    }

    function initEvents(){
        // onCaseLoad change
        $("#floorInfoLoad").change(function(evt){
            var url = $(this).val();
            var tempList = url.split(".");
            var fileType = tempList[tempList.length - 1];
            // save the target file into the output folder.
            var outputFile = fpr.CurrentFloor+"."+fileType;
            fpr.saveImageFileAsync(url, outputFile).then(function(outputPath){
                setFloorImage(outputPath);
            }).then(null, function(outputPath){
                console.log("Cannot Save the output file:"+outputPath+" from source:"+url);
            });
        });

        $("#floorSave").click(function(evt){
            var tempFloorID = $("#floorInfoId").val();
            var tempFloorDes = $("#floorInfoDes").val();
            //TODO: Finished me.
        });

        $("#nodeID").change(function(evt){
            var targetID = $(this).val();
            var tempDict = fpr.getNode(targetID);
            if (tempDict){
                $("#nodeID").val(tempDict['id']);
                $("#nodeType").val(tempDict['type']);
                $("#nodeDif").val(tempDict['diffusion']);
                $("#nodeX").val(tempDict['x']);
                $("#nodeY").val(tempDict['y']);
                $("#nodeZ").val(tempDict['z']);
                $("#nodeFloor").val(tempDict['floor']);
                $("#nodeFaceDir").val(tempDict['face_direction']);
                $("#nodeExitDir").val(tempDict['exit_direction']);
            }
        });

        $("#nodeAM").click(function(evt){
            var tempNodeID = $("#nodeID").val();
            var tempNodeType = $("#nodeType").val();
            var tempNodeDif = $("#nodeDif").val();
            var tempNodeX = $("#nodeX").val();
            var tempNodeY = $("#nodeY").val();
            var tempNodeZ = $("#nodeZ").val();
            var tempNodeFloor = $("#nodeFloor").val();
            var tempNodeFaceDir = $("#nodeFaceDir").val();
            var tempNodeExitDir = $("#nodeExitDir").val();
            var needAddRow = fpr.setNode(tempNodeID, tempNodeType, tempNodeDif, tempNodeX, tempNodeY,
                tempNodeZ, tempNodeFloor, tempNodeFaceDir, tempNodeExitDir);

            if (needAddRow){
                var floorNodeList =document.getElementById("floorNodeList");
                var curRowLens = floorNodeList.rows.length;
                var insertPos = curRowLens-1;

                for(var i= curRowLens-2 ; i >0 ; i--){
                    var handleID = floorNodeList.rows[i];
                    if (handleID.id){
                        handleID = handleID.id.split("_")[1];
                        if(handleID < tempNodeID){
                            insertPos = i+1;
                            break;
                        }
                    }
                }
                var tempRow = floorNodeList.insertRow(insertPos);
                tempRow.id = "NodeRow_"+ tempNodeID;
                tempRow.insertCell(0).innerHTML=tempNodeID;
                tempRow.insertCell(1).innerHTML=tempNodeType;
                tempRow.insertCell(2).innerHTML=tempNodeDif;
                tempRow.insertCell(3).innerHTML=tempNodeX;
                tempRow.insertCell(4).innerHTML=tempNodeY;
                tempRow.insertCell(5).innerHTML=tempNodeZ;
                tempRow.insertCell(6).innerHTML=tempNodeFloor;
                tempRow.insertCell(7).innerHTML=tempNodeFaceDir;
                tempRow.insertCell(8).innerHTML=tempNodeExitDir;
            }else{
                //Modify older row
                var targetRow =document.getElementById("NodeRow_"+tempNodeID);
                targetRow.cells[0].innerHTML=tempNodeID;
                targetRow.cells[1].innerHTML=tempNodeType;
                targetRow.cells[2].innerHTML=tempNodeDif;
                targetRow.cells[3].innerHTML=tempNodeX;
                targetRow.cells[4].innerHTML=tempNodeY;
                targetRow.cells[5].innerHTML=tempNodeZ;
                targetRow.cells[6].innerHTML=tempNodeFloor;
                targetRow.cells[7].innerHTML=tempNodeFaceDir;
                targetRow.cells[8].innerHTML=tempNodeExitDir;
            }
            if (fpr.GlobalNodeIdCount == tempNodeID){
                fpr.GlobalNodeIdCount += 1;
            }
            initNodeInput();
        });

        $("#nodeDel").click(function(evt){
            var tempNodeID = $("#nodeID").val();
            fpr.deleteNode(tempNodeID);
            var targetRow =document.getElementById("NodeRow_"+tempNodeID);
            if (targetRow){
                var floorNodeList =document.getElementById("floorNodeList");
                floorNodeList.deleteRow(targetRow.rowIndex);
            }
            if (fpr.GlobalNodeIdCount == tempNodeID){
                fpr.GlobalNodeIdCount -= 1;
            }
            initNodeInput();
        });

        // Edge Related functions
        $("#edgeID").change(function(evt){
            var targetID = $(this).val();
            var tempDict = fpr.getEdges(targetID);
            if (tempDict){
                $("#edgeDis").val(tempDict['distance']);
                $("#edgeSource").val(tempDict['sourceNode']);
                $("#edgeTarget").val(tempDict['targetNode']);
            }
        });

        $("#edgeAM").click(function(evt){
            var tempEdgeID = $("#edgeID").val();
            var tempEdgeDis = $("#edgeDis").val();
            var tempEdgeSource = $("#edgeSource").val();
            var tempEdgeTarget = $("#edgeTarget").val();

            var needAddRow = fpr.setEdges(tempEdgeID, tempEdgeDis, tempEdgeSource, tempEdgeTarget);


            if (needAddRow){
                var floorEdgeList =document.getElementById("floorEdgeList");
                var curRowLens = floorEdgeList.rows.length;
                var insertPos = curRowLens-1;

                for(var i= curRowLens-2 ; i >0 ; i--){
                    var handleID = floorEdgeList.rows[i];
                    if (handleID.id){
                        handleID = handleID.id.split("_")[1];
                        if(handleID < tempEdgeID){
                            insertPos = i+1;
                            break;
                        }
                    }
                }
                var tempRow = floorEdgeList.insertRow(insertPos);
                tempRow.id = "EdgeRow_"+ tempEdgeID;
                tempRow.insertCell(0).innerHTML=tempEdgeID;
                tempRow.insertCell(1).innerHTML=tempEdgeDis;
                tempRow.insertCell(2).innerHTML=tempEdgeSource;
                tempRow.insertCell(3).innerHTML=tempEdgeTarget;
            }else{
                //Modify older row
                var targetRow =document.getElementById("EdgeRow_"+tempEdgeID);
                targetRow.cells[0].innerHTML=tempEdgeID;
                targetRow.cells[1].innerHTML=tempEdgeDis;
                targetRow.cells[2].innerHTML=tempEdgeSource;
                targetRow.cells[3].innerHTML=tempEdgeTarget;
            }
            if (fpr.GlobalEdgeIdCount == tempEdgeID){
                fpr.GlobalEdgeIdCount += 1;
            }
            initEdgeInput();
        });

        $("#edgeDel").click(function(evt){
            var tempEdgeID = $("#edgeID").val();
            fpr.deleteEdges(tempEdgeID);
            var targetRow =document.getElementById("EdgeRow_"+tempEdgeID);
            if (targetRow){
                var floorNodeList =document.getElementById("floorEdgeList");
                floorNodeList.deleteRow(targetRow.rowIndex);
            }
            if (fpr.GlobalNodeIdCount == tempEdgeID){
                fpr.GlobalNodeIdCount -= 1;
            }
            initEdgeInput();
        });
    };


    //JS Init logic
    if (!fpr.CurrentFloor){
        var tempId  = createFloorId();
        while(!fpr.initFloor(tempId, true)){
            tempId = createFloorId();
        }
        fpr.CurrentFloor = tempId;
     }else{
        fpr.initFloor();
    }

    // canvas init
    var floorCanvas = document.getElementById("floorCanvas");
    var scaleRate = 1.0;
    var drawWidth = 0;
    var drawHeight = 0;
    var ctx = floorCanvas.getContext('2d');
    // init basic events
    initEvents();
    loadFloorSettings();
    //Init textarea
    initNodeInput();
    initEdgeInput();
})();