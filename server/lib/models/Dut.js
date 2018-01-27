/**
 * Created by Jeromeyang on 2018/1/21.
 */



let mongoose = require('../../../db'),
    Schema = mongoose.Schema;

let Dut = new Schema({
    id:{type:String,unique:true},
    name : { type: String },
    posSense: {type: String},
    sn:{type:String},
    startTime:{type:Date,default:Date.now},
    endTime:{type:Date},
    result:{type:String},
    status:{type:String}
},{ versionKey: false });

module.exports = mongoose.model('dut',Dut);