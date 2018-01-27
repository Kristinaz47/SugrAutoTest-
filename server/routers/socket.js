/**
 * Created by Jeromeyang on 2018/1/16.
 */

let express = require('express');
let router = express.Router();
let socketManager = require("../../utils/socketManager.js");

/* GET users listing. */
router.get('/getOnlineDevices', function(req, res, next) {

    let socket909 = socketManager.getSS_90_9Socket()
    let socket903 = socketManager.getSS_90_3Socket();
    let socket303 = socketManager.getSS_30_3Socket();

    let socket909online = true;
    let socket903online = true;
    let socket303online = true;

    if (socket909 == undefined){
        socket909online = false;
    }

    if (socket903 == undefined){
        socket903online = false;
    }

    if (socket303 == undefined){
        socket303online = false;
    }

    let dut_list = socketManager.getDUTList();
    let dut_result = [];
    for ( let attr in dut_list){
        if (dut_list.hasOwnProperty(attr) && typeof dut_list[attr] != "function"){
            dut_result.push(dut_list[attr]);
        }
    }

    console.log("dut_list size :" +dut_result.length);


    let result = {
        "socket909":socket909online,
        "socket903":socket903online,
        "socket303":socket303online,
        "dut":dut_result
    };
    res.json(result);

});


router.get('/', function(req, res, next) {



    res.end();
});

module.exports = router;