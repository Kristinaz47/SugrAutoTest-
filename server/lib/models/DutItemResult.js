/**
 * Created by Jeromeyang on 2018/1/24.
 */

let mongoose = require('../../../db'),
    Schema = mongoose.Schema;
//VS : volume setting
let DutItemResult = new Schema({
    id:{type:String},
    FAR : { type: Number ,default :-1},
    FRR: {type: Number,default:-1},
    responseSpd:{type:Number,default:0},
    item:{type:Number},
    position:{type:String},
    sense:{type:String},
    responseText:{type:String,default:null},
    pcmPath:{type:String,default:null}
},{ versionKey: false });

module.exports = mongoose.model('dut_item_result',DutItemResult);