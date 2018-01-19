/**
 * Created by Jeromeyang on 2018/1/17.
 */

let http = require("http");
let fs = require('fs');
var exec = require('child_process').exec;

let opt = {
    host:'vop.baidu.com',
    method:'POST',
    path:'/server_api',
    headers:{
        "Content-Type": 'application/json'
    }
};


exports.baiduASR = function(filePath,token,next){

    let  bitmap = fs.readFileSync(filePath);

    console.log(bitmap.length);

    let base64 = new Buffer(bitmap).toString('base64');
// console.log(base64);
    let data = {
        "format":"pcm",
        "rate":16000,
        "channel":1,
        "token":token,
        "lan":"en",
        "cuid":"SugrAutoTest",
        "len":bitmap.length,
        "speech":base64
    };

    data = JSON.stringify(data);

    let body = '';
    let req = http.request(opt, function(res) {
        console.log("response: " + res.statusCode);
        if (res.statusCode != 200) {
            next(null);
        }
        res.on('data', function (data) {
            body += data;
        }).on('end', function () {
            let result = JSON.parse(body);
            // console.log(result.access_token);
            next(result);
        });
    }).on('error', function (e) {
        console.log("error: " + e.message);
        next(null);
    });
    req.write(data);
    req.end();
};

//{"corpus_no":"6512019347557598855","err_msg":"success.","err_no":0,"result":
// ["how do you spell that,","how you spell that,","how do you spell left,","how would you spell that,","how do you spell lengths,"],"sn":"110646760701516197656"}
//







