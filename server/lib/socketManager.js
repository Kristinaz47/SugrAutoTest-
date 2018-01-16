
var online_number = 0;



function socketManager() {

}

socketManager.add = function() {
    online_number++;
};

socketManager.remove = function() {
    online_number--;
};

socketManager.getOnlineNum = function () {
    return online_number;
};

module.exports = socketManager;





