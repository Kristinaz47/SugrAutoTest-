let service = require('./service');
let testManager = require('./testManager');
let online_number = 0; //当前在线总数
let deviceName = ["SS_90_9", "SS_90_3", "SS_30_3", "NS", "DUT_"];
let SS_90_9;
let SS_90_3;
let SS_30_3;

let WEB_INDEX;
let WEB_RUNNING;

let SS_LIST;

let NS;

let DUTLIST = {};
let DUT_SOCKET_LIST = {};



let socketManager = {

    /**
     * 初始化socket
     * @param io
     */
    init: function (io) {

        // io.use(function (socket,next) {
        //     let handshakeData = socket.request;
        //     console.log(handshakeData);
        // });

        // io.engine.generateId = function (req) {
        //     return "customid:"+ socketManager.getOnlineNum();
        // };


        io.on('connection', function (socket) {
            let device;
            // console.log(socket.request.headers.cookie);
            console.log('a user connected id:' + socket.id);
            // change.change();
            // io.emit("message", "yangjun111","yangjun222");
            // socket.broadcast.emit('message', "yangjun111", "yangjun222");
            socket.on("disconnect", function () {
                console.log(device.name + " has gone!");
                socketManager.remove(device);
                io.emit("register", {"onlineNumber": socketManager.getOnlineNum()});
                if (device != undefined && device != null) {
                    socket.broadcast.emit('offline', device);
                }
            });


            socket.on("register", function (obj) {
                socketManager.add(obj, socket);
                device = obj;
                console.log("one device come: " + obj.name + "," + obj.type);
                io.emit("register", {"onlineNumber": socketManager.getOnlineNum()});
            });

            socket.on("message", function (obj) {
                socketManager.dispatchMessage(obj,socket);
                console.log(JSON.stringify(obj));
            });
        });
    },


    add: function (device, socket) {
        let name = device.name;
        let type = device.type;
        if (type == 'speaker') {
            if ("SS_90_9" == name && !SS_90_9) {
                SS_90_9 = socket;

                online_number++;
            } else if ("SS_90_3" == name && !SS_90_3) {
                SS_90_3 = socket;
                online_number++;
            } else if ("SS_30_3" == name && !SS_30_3) {
                SS_30_3 = socket;
                online_number++;
            }

            SS_LIST[name] = socket;

        } else if (type == 'dut') {//DUT
            let id = service.generateUniqueID();
            device.uniqueId = id;
            console.log("dut generate id : " + id);
            DUTLIST[name] = new Dut(name, device.sn, id);
            DUT_SOCKET_LIST[name] = socket;

            online_number++;
            socket.emit('register',{uniqueId:id})
        } else if (type == "web") {
            if ('web_index' == name && !WEB_INDEX) {
                WEB_INDEX = socket;
                online_number++;
            } else if ('running' == name && !WEB_RUNNING) {
                WEB_RUNNING = socket;
                online_number++;
            }
        }

        socket.broadcast.emit('online', device);

    },
    remove: function (device) {
        let name = device.name;
        let type = device.type;
        if (type == 'speaker') {
            if ("SS_90_9" == device.name && SS_90_9) {
                SS_90_9 = undefined;
                online_number--;
            } else if ("SS_90_3" == device.name && SS_90_3) {
                SS_90_3 = undefined;
                online_number--;
            } else if ("SS_30_3" == device.name && SS_30_3) {
                SS_30_3 = undefined;
                online_number--;
            }

            SS_LIST[name] = undefined;

        } else if (type == "dut") {
            DUTLIST[name] = undefined;
            DUT_SOCKET_LIST[name] = undefined;
            online_number--;
        } else if (type == "web") {
            if ('web_index' == name && !WEB_INDEX) {
                WEB_INDEX = undefined;
                online_number--;
            } else if ('running' == name && !WEB_RUNNING) {
                WEB_RUNNING = undefined;
                online_number--;
            }
        }
    },
    getOnlineNum: function () {
        return online_number;
    },
    getSS_90_9Socket: function () {
        return SS_90_9;
    },
    getSS_90_3Socket: function () {
        return SS_90_3;
    },
    getSS_30_3Socket: function () {
        return SS_30_3;
    },

    getRunningSocket:function () {
        return WEB_RUNNING;
    },

    getDUTList: function () {
        return DUTLIST;
    },
    getDUT_SOCKET_LIST: function () {
        return DUT_SOCKET_LIST;
    },

    sendBroadcastMsg : function (socket,event,message) {
        socket.emit(event,message);
        socket.broadcast.emit(event,message);
    },

    sendMsg: function (socket,event,message) {
        if (socket == undefined || socket == null){
            return;
        }
        socket.emit(event,message);
    },

    dispatchMessage : function (message,socket) {
        if (message.who == 'speaker'){
            testManager.handleSpeakerMessage(message,socket);
        }else if (message.who == 'dut'){
            testManager.handleDutMessage(message,socket);
        }else if(message.who == 'web'){
            testManager.handleWebMessage(message,socket);
        }
    },



};

function Dut(name, sn, id) {
    this.name = name;
    this.sn = sn;
    this.uniqueId = id;
}


module.exports = socketManager;





