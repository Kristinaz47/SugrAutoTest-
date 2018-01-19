/**
 * Created by dora on 2017/5/19.
 *
 */

let path = require('path');


module.exports = {


    session_secret: 'sugrats',
    auth_cookie_name: 'sugrats',
    encrypt_key: 'sugr',
    cache_maxAge: Math.floor(Date.now() / 1000) + 24 * 60 * 60, //1 hours

    // 数据库配置
    URL: 'mongodb://127.0.0.1:27017/sugrats',
    DB: 'sugrats',
    HOST: '120.1.1.10',
    PORT: 27017,
    USERNAME: 'sugrats',
    PASSWORD: 'password',

    upload: {
        path: process.cwd() + '/uploads'
    }

};



