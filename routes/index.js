var express = require('express');
var router = express.Router();
var path = require('path');
var socketManager = require("../server/lib/socketManager.js");



/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile("index.html",{root:path.resolve(__dirname, '../views/')})
});

router.get('/start',function (req, res, next) {

    socketManager.p1.emit("register",{"onlineNumber":100});

    res.end()
})

module.exports = router;
