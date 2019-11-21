import axios from 'axios';

let host = "http://127.0.0.1:2345/";

class Axios {

    post(api, bizData, pageData, callback) {
        let data = {
            base: {
                timestamp: 1234567,
                sign: "67ff54447b89f06fe4408b89902e585167abad291ec41118167017925e24e320",
            },
            biz: bizData,
            page: pageData,
        }
        axios.post(host + api, data).then(function (response) {
            let data = response.data
            if (callback) {
                callback(data);
            }
        }).catch(function (error) {

        })
    }

    postSeroRpc(_method, _params, callback) {
        let data = {
            id: 0,
            jsonrpc: "2.0",
            method: _method,
            params: _params,
        };
        axios.post(host + "rpc", data).then(function (response) {
            let data = response.data
            if (callback) {
                callback(data);
            }
        }).catch(function (error) {
            console.log("req error: ",error)
        })
    }

    postPullupRpc(_method, _params, callback) {
        let data = {
            id: 0,
            method: _method,
            params: _params,
        };
        axios.post(host + "pullup_rpc", data).then(function (response) {
            let data = response.data
            if (callback) {
                callback(data);
            }
        }).catch(function (error) {

        })
    }

}

export default Axios;