/**
 * Created by Jeromeyang on 2018/1/18.
 */

const exec = require('child_process').exec;

exports.mp3ToPcm = function (inFile,outFile,next) {
    exec('./ffmpeg -y  -i '+inFile+' -acodec pcm_s16le -f s16le -ac 1 -ar 16000 '+outFile,function(error,stdout,stderr){
        if (error) {
            console.error(error);
            return;
        }

        console.log(stdout);
        if (stderr !== null && stderr !== undefined) {
                next();
        }
    });
};
