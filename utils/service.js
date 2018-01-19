/**
 * Created by Jeromeyang on 2018/1/19.
 */

let UUID = require('uuid/v4');
let crypto = require('crypto');
let hash = crypto.createHash('md5');
let baiduAuth = require('./middleware/baiduAuth');


let systemServices = {

    generateUniqueID : function () {
        let seed = new Date().toUTCString()+UUID();
        hash.update(seed,'utf-8');
        return hash.digest('hex');
    },

    refreshBDToken:function (next) {

        baiduAuth.request(function (token) {
            if (token){
                next(token);
            }else {
                next(null);
            }
        });

    },
};


module.exports = systemServices;

