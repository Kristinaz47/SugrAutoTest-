/**
 * Created by Jeromeyang on 2018/1/16.
 */

let express = require('express');
let router = express.Router();
let socketManager = require("../../utils/socketManager.js");

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;