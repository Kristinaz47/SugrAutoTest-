/**
 * Created by Jeromeyang on 2018/1/18.
 */

let systemService = require('./service');
let TestRecord = require('../server/lib/models/TestRecord');
let socketManager = require('./socketManager');
let fs = require('fs');

const TotalUtterances = 30;
const TestingScenario = [0, 0, 0];

//现在是否运行
let running = false;
//现在的噪声条件（共 4 种）
let serverSense;
//现在SpeechSpeaker的拜访位置（共 3 种）
let serverPosition;
//当前位置下标
let currentPosIndex = 0;
//当前场景下表
let currentSenseIndex = 0;
//当前播放的问题
let currentUtteranceIndex = 0;

let baiduAccesstoken;

//当前测试的ID
let currentTestId;

//当前测试的DUT信息
let currentDutList;

//当前日志文件流
let currentLogWrite;

let testManager = {

    //clear
    clear: function () {

    },
    //start
    start: function (data, next) {
        //生成唯一id
        running = true;
        //记录当前测试的信息
        currentTestId = systemService.generateUniqueID();
        //请求baiduToken
        // systemService.refreshBDToken(function (token) {
        //     console.log("baiduToken : " + token);
        //     baiduAccesstoken = token;
        // });

        serverPosition = data.ss_list;
        serverSense = data.sense_list;

        //通知所有speaker 和 dut 这次的测试Id，也表示即将开始测试
        let record = new TestRecord({
            'id': currentTestId,
            'name': data.name == undefined ? " " : data.name,
            'position': data.ss_list == undefined ? "":data.ss_list,
            'sense': data.sense_list,
            'duts': data.dut_list == undefined ? "":data.dut_list,
        });

        let promise = record.save();
        promise.then(function (doc) {
            console.log(doc);
        });
        let socketManager1 = require('./socketManager');
        socketManager = socketManager1;
        currentDutList = socketManager1.getDUT_SOCKET_LIST();
        testManager.sendTestIdToEveryDut();

        // let ss909 = socketManager1.getSS_90_9Socket();
        // socketManager1.sendMsg(ss909, 'message', JSON.stringify({type: 1, content: {testId: currentTestId}}));

        //创建文件log，记录log展示
        currentLogWrite = fs.createWriteStream('./testlog/'+currentTestId+'.log','utf-8');
        currentLogWrite.write('测试开始');
        next(currentTestId);



    },
    //stop
    stop: function () {
        running = false;

        currentLogWrite.end('测试结束');

    },

    getCurrentTestId: function () {
        return currentTestId;
    },


    getBaiduAccesstoken: function () {

        return baiduAccesstoken;
    },

    isRunning: function () {
        return running;
    },

    sendTestIdToEveryDut : function () {
        currentLogWrite.write('发送当前测试ID给每个待测设备...');
        for (let name in currentDutList) {
            let dut = currentDutList[name];
            if (dut != undefined && dut != null) {
                //发送本次测试的ID
                socketManager.sendMsg(dut, 'message', JSON.stringify({type: 1, content: {testId: currentTestId}}))
            }
        }
    },

    handleSpeakerMessage: function (message, socket) {
        if (message.type == 1) { //receive testId ack
            //这里可以发送第一条
            socket.emit("message",{type:2,content:{item:currentUtteranceIndex}});
            //并告诉所有的DUT id
            currentUtteranceIndex++;
        }else if (message.type == 2){ //接受到speech start event

        }else if (message.type == 3){ //接受到speech finish event

        }
    },

    handleDutMessage: function (message, socket) {
        if (message.type == 2){//收到了唤醒事件
            let dutid = message.id;
            let content = message.content;

        }
    },

    handleWebMessage: function (message, socket) {
        if (message.id = "running") {

        }
    },

    notifyAllSpeakInfo : function (socket,) {

    },

    trigger: function () {
        running = true;
    
    },

    getRunningLog : function (next) {
        
        fs.readFile('../testlog/'+currentTestId+'.log','utf-8',function (err, data) {
            next(data);
        })
    }

};


module.exports = testManager;