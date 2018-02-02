/**
 * Created by Jeromeyang on 2017/12/20.
 */
(function (root) {
    let satCommon = root.satCommon = {};

    let socketAddress = "ws://127.0.0.1:3000";
    let ipAddress = "http://127.0.0.1:3000";


    /**
     *     获取查询字符串 并保存到queryArgs 中
     */
    function urlArgs() {
        let args = {};
        let query = window.location.search.substring(1); //获取除? 的查询串
        let pairs = query.split('&');
        for (let i = 0; i < pairs.length; i++) {
            let pair = pairs[i];
            let index = pair.indexOf('=');
            if (index != -1) {
                let name = pair.substring(0, index);
                let value = pair.substring(index + 1);

                value = decodeURIComponent(value);

                console.log(name + ':' + value);
                args[name] = value;
            }
        }

        return args;
    }


    satCommon.ipAddress = ipAddress;
    satCommon.soketAddress = socketAddress;
    satCommon.queryArgs = urlArgs();



})(window);