/**
 * Created by Jeromeyang on 2018/1/18.
 */
let socketManager = require('./socketManager');
let systemService = require('./service');

const TotalUtterances = 30;
const TestingScenario = {};

//现在是否运行
let running = false;
//现在的噪声条件（共 4 种）
let noiseCondition;
//现在SpeechSpeaker的拜访位置（共 3 种）
let speakPosition;
//当前播放的问题
let currentUtteranceIndex;

let baiduAccesstoken;


let testManager = {

    //clear
    clear: function () {

    },
    //start
    start: function () {

    },
    //stop
    stop: function () {

    }


};


module.exports = testManager;