/**
 * Created by Jeromeyang on 2018/1/23.
 */

$(document).ready(function () {


    // initSocket();
    // getOnlineDevices();
    // $('.startbutton').bind('click',startTest(),function () {
    //
    // });


});


function getLog() {

}


function initSocket() {
    socket = io.connect(satCommon.socketAddress);

    socket.on("connect", function () {
        console.log("connected");
        socket.on("register", function (obj) {
            let online = obj.onlineNumber;
            console.log("web receiver : online number {" + online + "}");
//                $('#online_number').text("在线设备数量:" + online);
        });

        socket.on("running",function (obj) {

        });

        socket.emit("register", {"name": "running", "type": "web"});

    });



}