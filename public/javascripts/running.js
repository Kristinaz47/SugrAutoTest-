/**
 * Created by Jeromeyang on 2018/1/23.
 */

$(document).ready(function () {

    let scroll = true;
    // initSocket();
    // getOnlineDevices();
    // $('.startbutton').bind('click',startTest(),function () {
    //
    // });

    getLog(scroll);

});


function getLog(scroll) {



    $.ajax({
        url: satCommon.ipAddress + '/getRunningLog?testId='+satCommon.queryArgs.testId,
        type: "get",
        async: true,
        success: function (resultData) {

            $('#runtimeRecord').empty().append(resultData);
            if (resultData.indexOf('测试结束')==-1&&scroll){
            $('html,body').animate({scrollTop:$('.bottom').offset().top}, 800);}
            // initSocket();
            setTimeout(function () {
                getLog(true);
            },1000);

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        }
    });
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
            $('#runtimeRecord').append(obj);
        });

        socket.emit("register", {"name": "running", "type": "web"});

    });



}