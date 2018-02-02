/**
 * Created by Jeromeyang on 2018/1/18.
 */
let express = require('express');
let router = express.Router();
let fs = require('fs');
let service = require('../../utils/service');
let ffmpeg  = require('../../utils/ffmpegutlis');
let asr = require('../../utils/middleware/baiduASR');
let testManager = require('../../utils/testManager');
let DutItemResult = require('../../server/lib/models/DutItemResult');
let judgeService = require('../../utils/judgeService');
//24.ac8c29fb1b2bc62bc7c9bf781e1418ad.2592000.1518861990.282335-10706026

let multer  = require('multer');
let upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('speak_audio'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    // console.log(req.file.path);
    console.log(req.body.position);
    let position = req.body.position;
    let sense = req.body.sense;
    let item = req.body.item;
    let name = req.body.name;
    let dutid = req.body.id;

    let outName = 'uploads/'+service.generateUniqueID();
    ffmpeg.mp3ToPcm(req.file.path,outName,function () {
            asr.baiduASR(outName,testManager.getBaiduAccesstoken(),function (result) {
                fs.unlink(req.file.path,function (err) {
                    console.log('delete successful file :' + req.file.path);
                });
                fs.unlink(outName,function (err) {
                    console.log('delete successful file :' + outName);

                });

                console.log(result);

                if (result.result == undefined){
                    result.result = ['null','null']
                }
                let log = name +'  【 item:'+(parseInt(item)+1)+' position:' +position+',sense:'+sense +' 】'+'回复的语音结果为：['+result.result[0]+']'+',['+result.result[1]+']';
                let responseText = '['+result.result[0]+']'+',['+result.result[1]+']';
                DutItemResult.update({id:dutid,item:item,position:position,sense:sense},{responseText:responseText},function (err) {
                    testManager.writeLog(log);

                    judgeService.judge(parseInt(item),result.result[0],function (correct) {
                        let FAR = 0;
                        if(!err){
                            if (correct){//回答正确
                                testManager.writeLog('系统判定第'+(parseInt(item)+1)+'的回答 正确！');
                                FAR = 1;
                            }else {
                                testManager.writeLog('系统判定第'+(parseInt(item)+1)+'的回答 错误！');

                            }
                        }
                        DutItemResult.update({id:dutid,item:item,position:position,sense:sense},{FAR:FAR},function (err) {
                            // testManager.cancelTimer();
                            testManager.asrFinish();


                        });
                    });

                });






            });
    });

    res.json({'error':0});
    res.end();

});

module.exports = router;
