/**
 * Created by Jeromeyang on 2018/1/19.
 */

let UUID = require('uuid/v4');
let crypto = require('crypto');

let baiduAuth = require('./middleware/baiduAuth');
let nodemailer = require('nodemailer');

let systemServices = {

    generateUniqueID : function () {
        let hash = crypto.createHash('md5');
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

    notifyTestCompeleteOrError : function (sendTo,subject,text) {

        nodemailer.createTestAccount((err) => {

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: 'smtp.exmail.qq.com',
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: "jeromeyang@sugrsugr.com", // generated ethereal user
                    pass: "Sugr140331"  // generated ethereal password
                }
            });

            // setup email data with unicode symbols
            let mailOptions = {
                from: '<jeromeyang@sugrsugr.com>', // sender address
                to: sendTo, // list of receivers
                subject: subject, // Subject line
                text: text, // plain text body
                // html: '<b>Hello world?</b>' // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            });
        });

    }


};


module.exports = systemServices;

