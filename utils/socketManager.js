
let online_number = 0; //当前在线总数
let deviceName = ["SS_90_9","SS_90_3","SS_30_3","NS","DUT_"];
let SS_90_9;
let SS_90_3;
let SS_30_3;
let NS;

let DUT = {};





let socketManager = {

    /**
     * 初始化socket
     * @param io
     */
    init:function (io) {

        // io.use(function (socket,next) {
        //     let handshakeData = socket.request;
        //     console.log(handshakeData);
        // });

        io.engine.generateId = function (req) {
            return "customid:"+ socketManager.getOnlineNum();
        };



        io.on('connection', function (socket) {

            let username;
            console.log(socket.request.headers.cookie);
            console.log('a user connected id:' + socket.id);
            // change.change();
            // io.emit("message", "yangjun111","yangjun222");
            // socket.broadcast.emit('message', "yangjun111", "yangjun222");
            socket.on("disconnect", function () {
                console.log(username +" has gone!");
                socketManager.remove(username);
                io.emit("register", {"onlineNumber":socketManager.getOnlineNum()});
            });



            socket.on("register", function (obj) {
                socketManager.add(obj,socket);
                username = obj.name;
                console.log("server receiver: " + obj.name);
                io.emit("register", {"onlineNumber":socketManager.getOnlineNum()});

            });

            socket.on("message", function (obj) {
                io.emit("message", obj + " from server");
                console.log(obj);
            });
        });
    },




    add:  function (data,socket) {
        let name = data.name;

        if("SS_90_9" == name && !SS_90_9){
            SS_90_9 = socket;
            online_number++;
        }else if ("SS_90_3" == name){
            SS_90_3 = socket;
            online_number++;
        }else if ("SS_30_3" == name) {
            SS_30_3 = socket;
            online_number++;
        }
    },
    remove:  function (name) {
        if("SS_90_9" == name && SS_90_9){
            SS_90_9 = undefined;
            online_number--;
        }else if ("SS_90_3" == name){
            SS_90_3 = undefined;
            online_number--;
        }else if ("SS_30_3" == name){
            SS_30_3 = undefined;
            online_number--;
        }
    },
    getOnlineNum: function () {
        return online_number;
    },
    getSS_90_9Socket: function () {
        return SS_90_9;
    }
};


module.exports = socketManager;





