/**
 * Created by Jeromeyang on 2018/1/18.
 */
let express = require('express');
let router = express.Router();
let fs = require('fs');
let service = require('../../utils/service');
let ffmpeg  = require('../../utils/ffmpegutlis');
let asr = require('../../utils/middleware/baiduASR');
//24.ac8c29fb1b2bc62bc7c9bf781e1418ad.2592000.1518861990.282335-10706026

let multer  = require('multer');
let upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('speak_audio'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    // console.log(req.file.path);
    let outName = 'uploads/'+service.generateUniqueID();

    ffmpeg.mp3ToPcm(req.file.path,outName,function () {
            asr.baiduASR(outName,"24.ac8c29fb1b2bc62bc7c9bf781e1418ad.2592000.1518861990.282335-10706026",function (result) {
                fs.unlink(req.file.path,function (err) {
                    console.log('delete successful file :' + req.file.path);
                });
                fs.unlink(outName,function (err) {
                    console.log('delete successful file :' + outName);

                });
                console.log(result);
            });
    });

    res.json({'error':0});
    res.end();

});

module.exports = router;
