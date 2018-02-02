let express = require('express');
let router = express.Router();
let path = require('path');
let socketManager = require("../../utils/socketManager.js");
let testManager = require('../../utils/testManager');


/* GET home page. */
router.get('/', function (req, res, next) {
    console.log(req.query.testId);
    if (testManager.getCurrentTestId()!=null || req.query.testId != undefined) {
        res.redirect('/running?testId=' + req.query.testId);
    } else {
        res.sendFile("index.html", {root: path.resolve(__dirname, '../../views/')})
    }
});

router.get('/dut_detail', function (req, res, next) {
    console.log(req.query.testId);

    res.sendFile("dut_detail.html", {root: path.resolve(__dirname, '../../views/')})
});

router.get('/dut_list', function (req, res, next) {
    res.sendFile("dut_list.html", {root: path.resolve(__dirname, '../../views/')})
});

router.get('/running', function (req, res, next) {
    if (req.query.testId){
        res.sendFile("running.html", {root: path.resolve(__dirname, '../../views/')})
    }else {
        res.end('非法请求','utf-8');
    }

});

router.get('/login', function (req, res, next) {
    // socketManager.init();
    res.end()
});

router.get('/register', function (req, res, next) {
    // socketManager.init();
    res.redirect('/');
    // res.end()
});

router.post('/start', function (req, res, next) {

    console.log(req.body);
    testManager.start(req.body, function (id) {
        res.json({testId: id});
        res.end();
    });

    // socketManager.p1.emit("register",{"onlineNumber":100});
    // socketManager.getSS_90_9Socket().emit("register",{"onlineNumber":100});

    // res.location('/');
    // console.log(req.body);
    // res.end();
});

/**
 * 获取测试列表
 * limit 个数
 */
router.get('/getTestList', function (req, res, next) {
    let limit = req.query.limit;
    if (limit == undefined){//获取全部

    }
});

router.get('/getRunningLog',function (req, res, next) {
     let testId = req.query.testId;

     testManager.getRunningLog(testId,function (err,runningLog) {
         if (err){
             res.send('找不到对应的测试记录！:' + err)
         }else {
             res.send(runningLog);
         }
         res.end();
    });

});

router.get('/test1',function (req, res, next) {

    socketManager.getRunningSocket().emit("running","hello");
    let tt = (socketManager.getRunningSocket()!=undefined);
    res.send(tt);
    res.end();
});

router.get('/getDutTestDetail',function (req, res, next) {

    let dut_id = req.query.uniqueId;




});



module.exports = router;
