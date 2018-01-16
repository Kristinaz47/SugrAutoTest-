/**
 * Created by Jeromeyang on 2018/1/13.
 */
var mongoose = require('../db'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    username : { type: String },                    //用户账号
    password: {type: String},                        //密码


},{ versionKey: false });

module.exports = mongoose.model('user',UserSchema);