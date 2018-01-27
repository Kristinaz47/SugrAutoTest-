/**
 * Created by Jeromeyang on 2018/1/20.
 */


let dut_list = [];
let dut_name = [];


$(document).ready(function () {


    initSocket();
    getOnlineDevices();
    // $('.startbutton').bind('click',startTest(),function () {
    //
    // });
});

function initSocket() {

    socket = io.connect(satCommon.socketAddress);

    socket.on("connect", function () {
        console.log("connected");
        socket.on("register", function (obj) {
            let online = obj.onlineNumber;
            console.log("web receiver : online number {" + online + "}");
//                $('#online_number').text("在线设备数量:" + online);
        });
        socket.emit("register", {"name": "web_index", "type": "web"});
    });


    socket.on("online", function (obj) {

        if (obj.type == 'speaker') {
            if (obj.name == 'SS_90_9')
                $('#nss_90_9_container').show();
            else if (obj.name == 'SS_90_3')
                $('#nss_90_3_container').show();
            else if (obj.name == 'SS_30_3')
                $('#nss_30_3_container').show();
        } else if (obj.type == 'dut') {
            if (!(obj.uniqueId in dut_list)) {
                addDut(obj);
            }
        }

        console.log("receive online device :" + JSON.stringify(obj));
    });

    socket.on("offline", function (obj) {

        console.log("receive offline device :" + JSON.stringify(obj));
        if (obj.type == 'speaker') {
            if (obj.name == 'SS_90_9')
                $('#nss_90_9_container').hide();
            else if (obj.name == 'SS_90_3')
                $('#nss_90_3_container').hide();
            else if (obj.name == 'SS_30_3')
                $('#nss_30_3_container').hide();
        } else if (obj.type == 'dut') {
            let uniqueId = obj.uniqueId;
            console.log("remove device unique Id: " + obj.uniqueId);
            if (dut_list.indexOf(uniqueId) != -1) {
                removeDut(uniqueId);
            }
        }

    });
}


function getOnlineDevices() {
    $.ajax({
        url: satCommon.ipAddress + '/socket/getOnlineDevices',
        type: "get",
        async: true,
        dataType: "json",
        success: function (resultData) {
            console.log(JSON.stringify(resultData));
            if (resultData.socket909) {
                $('#nss_90_9_container').show();
            }
            if (resultData.socket903) {
                $('#nss_90_3_container').show();
            }
            if (resultData.socket303) {
                $('#nss_30_3_container').show();
            }

            initDuts(resultData.dut);

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        }
    });
}

function initDuts(duts) {

    console.log(JSON.stringify(duts));
    $.each(duts, function (index, value) {
        addDut(value)
    });

    // if ($('#checkbox-id').attr('checked')) {
    //     // do something
    // }
}

function addDut(value) {
    if (value == null || value == undefined) {
        return;
    }
    let item = "<div class='dut0' id=" + value.uniqueId + "dut ><div class='dut00'><span class='span2'>" + value.name + "</span><br/><input id=" + value.uniqueId + " type='checkbox' checked></div></div>"
    $('.onlinedevice3').append(item);
    dut_list.push(value.uniqueId);

}

function removeDut(uniqueId) {
    $('#' + uniqueId + 'dut').remove();
}

function startTest() {
    //查看哪些speaker显示
    let ss_list = [];
    if ($('#nss_90_9_container').is(':visible')){
        ss_list.push("SS_90_9");
    }
    if ($('#nss_90_3_container').is(':visible')){
        ss_list.push("SS_90_3");
    }
    if ($('#nss_30_3_container').is(':visible')){
        ss_list.push("SS_30_3");
    }


    //查看哪些场景显示
    let sense_list = [];

    if ($('#silence_cb').attr('checked')){
        sense_list.push("silence");
    }
    if ($('#kitchen_cb').attr('checked')){
        sense_list.push("kitchen");
    }
    if ($('#music_cb').attr('checked')){
        sense_list.push("music");
    }
    if ($('#playback_cb').attr('checked')){
        sense_list.push("playback");
    }

    // console.log(sense_list);
    name = $('#name').val();

    let data_ = {
        name,
            ss_list,
            sense_list,
            dut_list };

    console.log(JSON.stringify(data_));

    $.ajax({
        type: "POST",
        url: satCommon.ipAddress + '/start',
        data:data_,
        dataType: "json",
        async:true,
        cache:false,
        traditional:true,
        success: function (resultData) {
            alert(JSON.stringify(resultData));

            window.location.replace(satCommon.ipAddress+"?testId="+resultData.testId);

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        }
    });


}






