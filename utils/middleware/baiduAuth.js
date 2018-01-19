/**
 * Created by Jeromeyang on 2018/1/17.
 */

let https = require("https");
let qs = require('querystring');
let data = {
    "grant_type": "client_credentials",
    "client_id": "mGTrAYmtjmFGuwyGhT7Avu7L",
    "client_secret": "vzwRQYWedd4dtVb7I3oGWK6Tm7CVQb2G"
};


exports.request = function (next) {

    data = qs.stringify(data);

    let opt = {
        host: 'aip.baidubce.com',
        path: '/oauth/2.0/token?' + data,
    };

    let body = '';

    https.get(opt, function (res) {
        console.log("response: " + res.statusCode);
        if (res.statusCode != 200) {
            next(null);
        }
        res.on('data', function (data) {
            body += data;
        }).on('end', function () {
            let result = JSON.parse(body);
            // console.log(result.access_token);
            next(result.access_token)

        });
    }).on('error', function (e) {
        console.log("error: " + e.message);
        next(null);
    })


};