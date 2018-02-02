/**
 * Created by Jeromeyang on 2018/1/18.
 */

let systemService = require('./service');
let settings = require('./settings');
let TestRecord = require('../server/lib/models/TestRecord');
let DutItemResult = require('../server/lib/models/DutItemResult');
let socketManager = require('./socketManager');
let async = require('async');
let fs = require('fs');
let moment = require('moment');
moment.locale('zh-cn');
let _today;

const TotalUtterances = 30;


//现在是否运行
let running = false;
//现在的噪声条件（共 4 种）
let serverSense;
//现在SpeechSpeaker的拜访位置（共 3 种）
let serverPosition;
//现在的配置
let serverconfig;
//当前位置下标
let currentPosIndex = 0;
//当前场景下表
let currentSenseIndex = 0;
//当前播放的问题
let currentUtteranceIndex = -1;

let baiduAccesstoken;

//当前测试的ID
let currentTestId;

//当前测试的DUT socket
let currentDutList;

let currentDutListId;//array

//当前日志文件流
let currentLogWrite;

//定时器
let timer;

let expect = false;

let no_response = false;

let speaker_finish = false;

let channel_break = false;

let speaking = false;

let asr = false;


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
        // 请求baiduToken
        systemService.refreshBDToken(function (token) {
            console.log("baiduToken : " + token);
            baiduAccesstoken = token;
        });
        serverconfig = data.config;
        console.log(JSON.stringify(serverconfig));
        serverPosition = data.ss_list.split(',');
        serverSense = data.sense_list.split(',');
        currentDutListId = data.dut_list.split(',');
        //通知所有speaker 和 dut 这次的测试Id，也表示即将开始测试
        let record = new TestRecord({
            'id': currentTestId,
            'name': data.name == undefined ? " " : data.name,
            'position': data.ss_list == undefined ? "" : data.ss_list,
            'sense': data.sense_list,
            'duts': data.dut_list == undefined ? "" : data.dut_list,
        });

        let promise = record.save();
        promise.then(function (doc) {
            console.log(doc);
        });
        let socketManager1 = require('./socketManager');
        socketManager = socketManager1;
        //创建文件log，记录log展示
        currentLogWrite = fs.createWriteStream('./testlog/' + currentTestId + '.log', 'utf-8');
        testManager.writeLog('测试开始');
        currentDutList = socketManager1.getDUT_SOCKET_LIST();
        testManager.sendTestIdToEveryDut();


        next(currentTestId);

        testManager.nextSpeech(true);

    },
    //stop
    stop: function () {
        running = false;
        currentLogWrite.end('测试结束');
        //通知running界面跳转到界面
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

    sendTestIdToEveryDut: function () {

        //获取当前的speaker的socket
        console.log(1);
        let ss_socket = testManager.getCurrentPosSocket();
        console.log(2);

        socketManager.sendMsg(ss_socket, JSON.stringify(
            {
                type: settings.NOTIFY_TEST_ID,
                content: {
                    testId: currentTestId
                }
            }));
        console.log(3);

        testManager.writeLog('发送当前测试ID给每个待测设备...');
        console.log(4);

        for (let name in currentDutList) {
            let dut = currentDutList[name];
            if (dut != undefined && dut != null) {
                //发送本次测试的ID
                socketManager.sendMsg(dut, JSON.stringify({
                    type: settings.NOTIFY_TEST_ID,
                    content: {testId: currentTestId}
                }))
            }
        }
        console.log(5);

    },

    handleSpeakerMessage: function (message, socket) {
        if (message.type == settings.EVENT_SPEAKER_NOTIFY_ACK) { //receive testId ack
            //这里可以发送第一条
            // socket.emit("message",{type:2,content:{item:currentUtteranceIndex}});
            //并告诉所有的DUT id

        } else if (message.type == settings.EVENT_SPEAKER_PLAY_START) { //接受到speech start event
            testManager.writeLog('开始播放第' + (currentUtteranceIndex + 1) + '条用例');

        } else if (message.type == settings.EVENT_SPEAKER_PLAY_FINISH) { //接受到speech finish event
            speaker_finish = true;
            testManager.writeLog('播放第' + (currentUtteranceIndex + 1) + '条用例结束');

            //这里判断是否唤醒时处于通道未连接
            if (channel_break) {
                //重复播放
                testManager.writeLog('检测到待测设备通道断开，重复该测试用例!');
                testManager.nextSpeech(false);
                return;
            }

            //查看是否被唤醒，如果没有被唤醒则跳到一下的语音，记录结果，如果被唤醒了，设置定时器，如果upload那边过来了，则取消定时器，并且分析完成之后切换下一条
            let dutid = currentDutListId[0];
            DutItemResult.findOne({
                id: dutid,
                position: serverPosition[currentPosIndex],
                sense: serverSense[currentSenseIndex],
                item: currentUtteranceIndex
            }, function (err, dbResult) {
                console.log(err);
                if (err) {
                    return;
                }
                if (dbResult.FRR == -1) { //未被唤醒
                    //更改FRR,FAR值为0
                    DutItemResult.update({
                        id: dutid,
                        item: currentUtteranceIndex,
                        position: serverPosition[currentPosIndex],
                        sense: serverSense[currentSenseIndex]
                    }, {FRR: 0, FAR: 0}, function (err) {
                        testManager.writeLog('未被唤醒，保存记录');
                        testManager.nextSpeech(true);
                    });
                } else {//被唤醒
                    // if (!expect) { //设置定时器 忽略多轮对话
                    //     timer = setTimeout(function () {
                    //         testManager.nextSpeech();
                    //     }, 10000);
                    // }
                    if (no_response){
                        DutItemResult.update({
                            id: dutid,
                            item: currentUtteranceIndex,
                            position: serverPosition[currentPosIndex],
                            sense: serverSense[currentSenseIndex]
                        }, { FAR: 0}, function (err) {
                            testManager.writeLog('第' + (currentUtteranceIndex + 1) + '条测试用例无响应！');
                            testManager.nextSpeech(true);
                        });
                    }
                }
            })

        } else if (message.type == settings.EVENT_SPEAKER_PLAY_STOP_START) {
            testManager.writeLog('播放STOP语音指令开始');
        } else if (message.type == settings.EVENT_SPEAKER_PLAY_STOP_FINISH) {
            testManager.writeLog('STOP语音指令播放结束');
        }
    },

    handleDutMessage: function (message, socket) {
        let dutid = message.id;
        let content = message.content;
        let position = content.position;
        let sense = content.sense;
        let item = content.item;
        let name = content.name;
        if (message.type == settings.EVENT_DUT_WAKE_UP) {//收到了唤醒事件

            testManager.writeLog(name + ' 唤醒成功 【 item:' + (item + 1) + ' position:' + position + ',sense:' + sense + ' 】');
            //将唤醒记录
            DutItemResult.update({id: dutid, item: item, position: position, sense: sense}, {FRR: 1}, function (err) {
                if (err) {
                    testManager.writeLog('保存失败!')
                } else {
                    testManager.writeLog('保存成功!')
                }
            });
        } else if (message.type == settings.EVENT_DUT_THINKING) {

        } else if (message.type == settings.EVENT_DUT_SPEAK_FINISH) {
            //在这里检测是否有对轮对话被触发，如果被触发则播放stop,检测一些状态，若无其他状态则执行下一条
            speaking = false;
            if (asr){

                timer = setTimeout(function () {
                    if (!expect){
                    testManager.nextSpeech(true);}
                }, 1000);
            }


        } else if (message.type == settings.EVENT_DUT_EXPECT) {
            expect = true;
            testManager.cancelTimer();
            testManager.writeLog('检测到多轮对话!!! ');
            //播放stop
            testManager.notifySpeakerSpecial(3);
        } else if (message.type == settings.EVENT_DUT_IDLE) {
            // testManager.nextSpeech();
        } else if (message.type == settings.EVENT_DUT_NO_RESPONSE) {
            //没有任何响应更改数据
            if (!expect) {
                no_response = true;
                if (speaker_finish) {
                    testManager.writeLog('第' + (item + 1) + '条测试用例无响应！');
                    DutItemResult.update({
                        id: dutid,
                        item: item,
                        position: position,
                        sense: sense
                    }, {FAR: 0}, function (err) {
                        //播放下一条
                        testManager.nextSpeech(true);
                    });
                }
            } else {
                testManager.writeLog('多轮对话结束');
                testManager.nextSpeech(true);
            }
        } else if (message.type == settings.EVENT_DUT_CHANNEL_BREAK) {
            channel_break = true;
        } else if (message.type == settings.EVENT_DUT_SPEAKING) {
                //如果有speaking 则要等待识别完成，才能下一个
            speaking = true;
            asr = false;
        }else if (message.type == settings.EVENT_DUT_REQUEST_ERROR){

            testManager.writeLog('请求出错，回答错误！');

            DutItemResult.update({
                id: dutid,
                item: item,
                position: position,
                sense: sense
            }, {FAR: 0}, function (err) {
                //播放下一条
                testManager.nextSpeech(true);
            });
            //请求出错也代表是失败

        }
    },

    handleWebMessage: function (message, socket) {
        if (message.id = "running") {

        }
    },


    cancelTimer: function () {
        // clearTimeout(timer);
    },

    trigger: function () {
        running = true;

    },

    getRunningLog: function (testId, next) {

        fs.readFile('./testlog/' + testId + '.log', 'utf-8', function (err, data) {

            next(err, data);
        })
    },

    getCurrentPosSocket: function () {
        let socketManager1 = require('./socketManager');
        console.log(currentPosIndex);
        console.log(serverPosition);
        console.log(serverPosition[currentPosIndex]);
        return socketManager1.getSS_Socket(serverPosition[currentPosIndex]);
    },

    asrFinish : function () {
        asr = true;
       if (!expect && !speaking){
           testManager.nextSpeech(true);
       }
    },

    nextSpeech: function (noRepeat) {
        expect = false;
        channel_break = false;
        no_response = false;
        speaker_finish = false;
        if (noRepeat) {

            currentUtteranceIndex++;

            if (currentUtteranceIndex == TotalUtterances){
                //用例已全部测试完毕,继续下一个位置的测试或者测试结束  发送邮件
                testManager.writeLog('测试结束');
                running = false;
                return;
            }


            setTimeout(function () {
                //为每个dut成产当前场景，位置，第几条的数据
                currentDutListId.forEach(function (item, index) {
                    let dutItemResult = new DutItemResult({
                        id: item,
                        item: currentUtteranceIndex,
                        position: serverPosition[currentPosIndex],
                        sense: serverSense[currentSenseIndex],
                    });

                    let promise = dutItemResult.save();
                    promise.then(function (doc) {
                        console.log("nextSpeech index: " + index);
                        console.log(doc);
                        //生成完毕后去做
                        //通知所有dut当前的位置，场景，第几条
                        if (index == (currentDutListId.length - 1)) {

                            testManager.notifyDut();
                            setTimeout(function () {
                                testManager.notifySpeaker();
                            }, 1500);

                        }
                    });

                });

                //通知当前speaker去播放

            }, 2000);
        } else {
            testManager.notifySpeaker();
        }
    },

    notifySpeaker: function () {

        let volume;
        if (serverSense[currentSenseIndex] == 'silence') {
            volume = serverconfig.silenceSPL;
        } else {
            volume = serverconfig.noiseSPL;
        }

        socketManager.sendMsg(testManager.getCurrentPosSocket(),
            {
                type: settings.NOTIFY_SPEAKER_PLAY,
                content: {
                    item: currentUtteranceIndex,
                    config: {
                        volume: volume
                    }
                }
            });
    },

    /**
     * 通知播放特殊的音频，比如stop ，loop mode on
     * @param type
     */
    notifySpeakerSpecial: function (type) {

        let itemIndex;
        if (type == settings.NOTIFY_SPEAKER_SP_STOP){
            itemIndex = 30;
        }

        socketManager.sendMsg(testManager.getCurrentPosSocket(),
            {
                type: type,
                content: {
                    item: itemIndex,
                    config: {volume: 1}
                }
            });
    },

    notifyNoiseSpeaker: function (type) {

        let volume;

        if (type == settings.NOTIFY_SPEAKER_NS_KITCHEN) {
            volume = serverconfig.kitchenSPL;
        } else if (type == settings.NOTIFY_SPEAKER_NS_MUSIC) {
            volume = serverconfig.externalSPL;
        } else {
            volume = 1;
        }

        socketManager.sendMsg(testManager.getCurrentPosSocket(),
            {
                type: type,
                content: {
                    item: (100 + type),
                    config: {
                        volume: volume
                    }
                }
            });

    },

    notifyDut: function () {
        console.log("notifyDut broadcast");
        socketManager.sendBroadcastMsg(testManager.getCurrentPosSocket(),
            {
                type: settings.NOTIFY_DUT_CUR_INFO,
                content: {
                    position: serverPosition[currentPosIndex],
                    sense: serverSense[currentSenseIndex],
                    item: currentUtteranceIndex
                }
            });
    },
    writeLog: function (log) {
        let logg;
        if (currentLogWrite != undefined) {
            _today = moment();
            logg = '<p>[' + _today.format('YYYY-MM-DD HH:mm:ss') + "]:" + log + "\n</p>";
            currentLogWrite.write(logg);
        }


    }


};


module.exports = testManager;