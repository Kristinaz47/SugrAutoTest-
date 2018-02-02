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
    },

    NOTIFY_TEST_ID: 1,
    NOTIFY_SPEAKER_PLAY: 2,
    NOTIFY_SPEAKER_SP_STOP: 3,
    NOTIFY_SPEAKER_SP_MUSIC: 4,
    NOTIFY_SPEAKER_SP_LOOP: 5,
    NOTIFY_SPEAKER_NS_KITCHEN: 6,
    NOTIFY_SPEAKER_NS_MUSIC: 8,
    NOTIFY_SPEAKER_NS_STOP: 9,


    NOTIFY_DUT_CUR_INFO: 7,

    EVENT_DUT_WAKE_UP: 10,
    EVENT_DUT_SPEAK_FINISH: 11,
    EVENT_DUT_EXPECT: 12,
    EVENT_DUT_REQUEST_ERROR: 13,
    EVENT_DUT_PLAY_MUSIC: 14,
    EVENT_DUT_THINKING: 15,
    EVENT_DUT_NOTIFY_ACK: 16,
    EVENT_DUT_IDLE: 17,
    EVENT_DUT_NO_RESPONSE : 18,
    EVENT_DUT_CHANNEL_BREAK : 19,
    EVENT_DUT_SPEAKING : 50,

    EVENT_SPEAKER_PLAY_FINISH: 21,
    EVENT_SPEAKER_NOTIFY_ACK: 20,
    EVENT_SPEAKER_PLAY_START: 22,
    EVENT_SPEAKER_PLAY_STOP_START: 23,
    EVENT_SPEAKER_PLAY_STOP_FINISH: 24,

    EVENT_RUNNING_2_RESULT_LIST :70,



};



