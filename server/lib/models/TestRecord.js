/**
 * Created by Jeromeyang on 2018/1/21.
 */

let mongoose = require('../../../db'),
    Schema = mongoose.Schema;

let moment = require('moment');
moment.locale('zh-cn');

let TestRecord = new Schema({
    id: {type: String, unique: true},
    name: {type: String, default: ' '},
    position: {type: String, default: ' '},
    sense: {type: String, default: ' '},
    duts: {type: String, default: ' '},
    startTime: {type: Date, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    endTime: {type: Date},
    tester: {type: String, default: 'admin'},
    status: {type: String, default: 'running'}
}, {versionKey: false});

module.exports = mongoose.model('test_record', TestRecord);