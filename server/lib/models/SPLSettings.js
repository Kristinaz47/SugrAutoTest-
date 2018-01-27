/**
 * Created by Jeromeyang on 2018/1/18.
 */
let mongoose = require('../../../db'),
    Schema = mongoose.Schema;
//VS : volume setting
let SPLSettings = new Schema({
    id:{type:String,unique:true},
    ambientNoise : { type: Number },
    silenceVS: {type: String},
    noiseVS:{type:String},
    kitchenVS:{type:String},
    musicVS:{type:String},
    playbackVS:{type:String},
    audioFileVS:{type:String}
},{ versionKey: false });

module.exports = mongoose.model('spl_settings',SPLSettings);