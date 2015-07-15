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
    //Global Floor Data mapping table in here.
    var FloorData = {};
    var GlobalNodeIdCount = 1;
    var GlobalEdgeIdCount = 1;
    var CurrentFloor = undefined;

    //Local variable
    var _currentFloorStruct = undefined;


    function initFloor(floorId, firstCreated){

        var tempDict = undefined;
        if (FloorData.hasOwnProperty(floorId))
        {
            if (firstCreated){
                return false;
            }
            tempDict = FloorData[floorId];
        }else{
            var tempDict = {
                "floor":{},
                "edges":{},
                "nodes":{},
                "remote-nodes":{}
            }
            FloorData[floorId] = tempDict;
        }
        _currentFloorStruct = tempDict;
        return true;
    };


    function setFloorInfo(floorId, des, planPath){

        if (!_currentFloorStruct){
            console.log("Cannot Set floor info before creating.");
            return;
        }
        if (_currentFloorStruct.floor){
            _currentFloorStruct.floor.id = floorId;
            _currentFloorStruct.floor.description = des;
            _currentFloorStruct.floor.plan_path = planPath;
        }else {
            _currentFloorStruct.floor = {
                "id": floorId,
                "description": des,
                "plan_path": planPath
            };
        }
    };

    function getCurrentFloorInfo(){
        return _currentFloorStruct.floor;
    }

    function getEdges(myId){
        if (!_currentFloorStruct){
            console.log("Cannot Get edge info before creating.");
            return undefined;
        }
        var edgeDict = _currentFloorStruct.edges;
        if (edgeDict.hasOwnProperty(myId)){
            return edgeDict[myId];
        }
        return undefined;
    };

    function setEdges(edgeId, distance, sourceNode, targetNode){

        if (!_currentFloorStruct){
            console.log("Cannot Set Edge due to the construct of the distance is no worked.");
            return false;
        }
        var edgeDict = _currentFloorStruct.edges;
        if (edgeDict.hasOwnProperty(edgeId)){
            edgeDict[edgeId].distance = distance;
            edgeDict[edgeId].sourceNode = sourceNode;
            edgeDict[edgeId].targetNode = targetNode;
        }else {
            edgeDict[edgeId] = {
                "distance": distance,
                "sourceNode": sourceNode,
                "targetNode": targetNode
            };
            return true;
        }
        return false;
    }

    function deleteEdges(edgeId){
        if (!_currentFloorStruct){
            console.log("Cannot delete edges info before creating.");
            return;
        }
        var edgeDict = _currentFloorStruct.edges;
        if (edgeDict.hasOwnProperty(edgeId)){
            delete edgeDict[edgeId];
        }
    }

    function getNode(myId){
        if (!_currentFloorStruct){
            console.log("Cannot Get node info before creating.");
            return undefined;
        }
        var nodeDict = _currentFloorStruct.nodes;
        if (nodeDict.hasOwnProperty(myId)){
            return nodeDict[myId];
        }
        return undefined;
    };

    function setNode(myId, myType, diffusion, x, y, z, floorId, faceDirection, exitDirection){
        if (!_currentFloorStruct){
            console.log("Cannot Set node info before creating.");
            return false;
        }
        var nodeDict = _currentFloorStruct.nodes;
        if (nodeDict.hasOwnProperty(myId)){
            var dataDict = nodeDict[myId];
            dataDict.id = myId;
            dataDict.type = myType;
            dataDict.disffusion = diffusion;
            dataDict.x = x;
            dataDict.y = y;
            dataDict.z = z;
            dataDict.floor = floorId;
            dataDict.face_direction = faceDirection;
            dataDict.exit_direction = exitDirection;
            return false;
        }else{
            nodeDict[myId] = {
                "id": myId,
                "type": myType,
                "diffusion": diffusion,
                "x": x,
                "y": y,
                "z": z,
                "floor": floorId,
                "face_direction": faceDirection,
                "exit_direction": exitDirection
            };
            return true;
        }
    };

    function deleteNode(nodeId){
        if (!_currentFloorStruct){
            console.log("Cannot delete node info before creating.");
            return;
        }
        var nodeDict = _currentFloorStruct.nodes;
        if (nodeDict.hasOwnProperty(nodeId)){
            delete nodeDict[nodeId];
        }
    }

    function getRemoteNode(myId){
        if (!_currentFloorStruct){
            console.log("Cannot Get remote info before creating.");
            return undefined;
        }
        var remoteDict = _currentFloorStruct['remote-nodes'];
        if (remoteDict.hasOwnProperty(myId)){
            return remoteDict[myId];
        }
        return undefined;
    };

    function setRemoteNode(distance, localNode, remoteFloor, remoteNodeid, remoteX, remoteY, remoteZ){
        if (!_currentFloorStruct){
            console.log("Cannot Set node info before creating.");
            return false;
        }
        var remoteDict = _currentFloorStruct['remote-nodes'];
        if (remoteDict.hasOwnProperty(localNode)){
            var dataDict = remoteDict[localNode];
            dataDict["distance"] = distance;
            dataDict["local-node"] = localNode;
            dataDict["remote-floor"] = remoteFloor;
            dataDict["remote-node_id"] = remoteNodeid;
            dataDict["remote-node_x"] = remoteX;
            dataDict["remote-node_y"] = remoteY;
            dataDict["remote-node_z"] = remoteZ;

        }else{
            remoteDict[localNode] = {
                "distance": distance,
                "local-node": localNode,
                "remote-floor": remoteFloor,
                "remote-node_id": remoteNodeid,
                "remote-node_x": remoteX,
                "remote-node_y": remoteY,
                "remote-node_z": remoteZ
            };
            return true;
        }
        return false;
    };

    function deleteRemoteNode(localNode){
        if (!_currentFloorStruct){
            console.log("Cannot delete remote Node info before creating.");
            return;
        }
        var remoteDict = _currentFloorStruct['remote-nodes'];
        if (remoteDict.hasOwnProperty(localNode)){
            delete remoteDict[localNode];
        }
    }

    // for the global namespace
    fpr.OwnData = OwnerData;
    fpr.CaseData = CaseData;
    fpr.FloorData = FloorData;
    // for the global current info.
    fpr.CurrentFloor = CurrentFloor;
    fpr.CurrentProject = CurrentProject;
    fpr.GlobalNodeIdCount = GlobalNodeIdCount;
    fpr.GlobalEdgeIdCount = GlobalEdgeIdCount;

    // floor related functions
    fpr.initFloor = initFloor;
    fpr.getCurrentFloorInfo = getCurrentFloorInfo;
    fpr.setFloorInfo = setFloorInfo;
    fpr.getEdges = getEdges;
    fpr.setEdges = setEdges;
    fpr.deleteEdges = deleteEdges;
    fpr.setNode = setNode;
    fpr.getNode = getNode;
    fpr.deleteNode = deleteNode;
    fpr.getRemoteNode = getRemoteNode;
    fpr.setRemoteNode = setRemoteNode;
    fpr.deleteRemoteNode = deleteRemoteNode;

})();

//
//{
//    "floor": {
//    "id": "{string}",
//        "description": "{string}",
//        "plan_path": "{string}"{
//        "floor": {
//            "id": "{string}",
//                "description": "{string}",
//                "plan_path": "{string}"
//        },
//        "edges": [
//            {
//                "distance": "{number}",
//                "source-node": "{string} node_id",
//                "target-node": "{string} node_id"
//            }
//        ],
//            "nodes": [
//            {
//                "id": "{string}",
//                "type": "{number}",
//                "diffusion": "{number}",
//                "x": "{number}",
//                "y": "{number}",
//                "z": "{number}",
//                "floor": "{string} floor_id",
//                "face-direction": "{?number}",
//                "exit-direction": "{?number}"
//            }
//        ],

//        ]
//    }
//
//
//},
//    "edges": [
//    {
//        "distance": "{number}",
//        "source-node": "{string} node_id",
//        "target-node": "{string} node_id"
//    }
//],
//    "nodes": [
//    {
//
//    }
//],
//    "remote-nodes": [
//    {
//        "distance": "{number}",
//        "local-node": "{string} node_id",
//        "remote-floor": "{string} floor_id"
//        "remote-node_id": "{string} node_id",
//        "remote-node_x": "{number} node_x",
//        "remote-node_y": "{number} node_y",
//        "remote-node_z": "{number} node_z"
//    }
//]
//}
//
//var dictionary = {
//    a: [1,2,3, 4],
//    b:[5,6,7]
//}
//var values = Object.keys(dictionary).map(function(key){
//    return dictionary[key];
//});
////will return [[1,2,3,4], [5,6,7]]

