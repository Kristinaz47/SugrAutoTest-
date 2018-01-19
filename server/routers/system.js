let express = require('express');
let router = express.Router();
let path = require('path');
let socketManager = require("../../utils/socketManager.js");



/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile("index.html",{root:path.resolve(__dirname, '../../views/')})
});


router.get('/login', function(req, res, next) {
    // socketManager.init();
    res.end()
});

router.get('/register', function(req, res, next) {
    // socketManager.init();
    res.redirect('/');
    // res.end()
});

router.get('/start',function (req, res, next) {

    // socketManager.p1.emit("register",{"onlineNumber":100});
    socketManager.getSS_90_9Socket().emit("register",{"onlineNumber":100});
    res.end()
});

module.exports = router;
