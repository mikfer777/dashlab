import ReconnectingWebSocket from 'reconnectingwebsocket';
import {addNotifcounterCam, addMailcounter} from "../actions/index";
import uuidv1 from "uuid";


const SOCKET_CONNECTION_INIT = 'SOCKET_CONNECTION_INIT';
const SOCKET_CONNECTION_SUCCESS = 'SOCKET_CONNECTION_SUCCESS';
const SOCKET_CONNECTION_ERROR = 'SOCKET_CONNECTION_ERROR';
const SOCKET_CONNECTION_CLOSED = 'SOCKET_CONNECTION_CLOSED';
const SOCKET_MESSAGE = 'SOCKET_MESSAGE';
const SOCKET_SEND_MESSAGE = 'SOCKET_SEND_MESSAGE';
const initialState = {
    connected: false,
    readyState: null,
    socket: null,
};

const counter = {};

export default function sensorSocket(state = initialState, action = {}) {
    switch (action.type) {
        case SOCKET_CONNECTION_INIT:
            console.log("SOCKET_CONNECTION_INIT action.socket=" + action.socket);

            return Object.assign({}, state, {
                connected: false,
                socket: action.socket,
            });

        case SOCKET_CONNECTION_SUCCESS:
            console.log("SOCKET_CONNECTION_SUCCESS action.socket=" + state.socket);
            return Object.assign({}, state, {
                connected: true,
            });

        case SOCKET_CONNECTION_ERROR:
            return Object.assign({}, state, {
                connected: false,
            });

        case SOCKET_CONNECTION_CLOSED:
            return Object.assign({}, state, {
                connected: false,
                c: null,
            });

        case SOCKET_MESSAGE:
            // Do your logic here with action.data
            // example handleIncomingMessage(action.data)
            console.log("SOCKET_MESSAGE=" + action.data);

            return state;

        case SOCKET_SEND_MESSAGE:
            console.log("SOCKET_SEND_MESSAGE=" + action.payload);
            state.socket.send(action.payload);
            return state;

        default:
            return state;
    }
}

export function initializeSocket() {
    return (dispatch) => {
        console.log("initializeSocket Websock");
        const ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
        const socket = new WebSocket(ws_scheme + '://' + window.location.host + "/sensor/sock/");
        socket.debug = true;
        socket.timeoutInterval = 1000;
        dispatch(socketConnectionInit(socket));


        socket.onopen = function () {
            dispatch(socketConnectionSuccess());
        };

        socket.onerror = function () {
            dispatch(socketConnectionError());
        };

        socket.onmessage = function (event) {

            var jsonobj = JSON.parse(event.data);
            console.log("jsonobj=" + jsonobj['sensor']['type']);
            console.log("event.data=" + event.data);
            if (jsonobj['sensor']['type'] == 'data') {
                console.log("in data");
                var counterNotif = 1;
                var id = jsonobj['sensor']['pkid'];
                var uuid = jsonobj['sensor']['uuid'];
                var payload = jsonobj['payload'];
                var type = 'cam';
                dispatch(addNotifcounterCam({counterNotif, type, id, uuid, payload}));
            } else if (jsonobj['sensor']['type'] == 'init') {
                console.log("in init");
                // storeOrUpdateSensorModule(jsonobj['sensor']);
            }
            // dispatch(socketMessage(event.data));
            // check type of data and call REST api to store
            //storeXbeeData(jsonobj);
            // var counterNotif = parseInt(jsonobj.id, 10)
            // const id = uuidv1();
            // const type = 'mail';
            // dispatch(addMailcounter({counterNotif, type, id}));
        };

        socket.onclose = function () {
            dispatch(socketConnectionClosed());
        };
    };
}

function storeSensorData(sensordata) {
    setTimeout(() => {
        {
            var url = '/api/xbeemodules/'
            url += xbeedata.xbeeid + '/xbeedata/'
            const conf = {
                method: "post",
                body: JSON.stringify({
                    xbeeid: xbeedata.xbeeid,
                    vbatt: xbeedata.vbatt,
                    ptrans: xbeedata.ptrans,
                    pcheck: xbeedata.pcheck,
                    created_at: new Date()
                }),
                headers: new Headers({"Content-Type": "application/json"})
            };
            fetch(url, conf).then(response => console.log(response));
        }
    }, 100)
}


function storeXbeeData(xbeedata) {
    setTimeout(() => {
        {
            console.log("xbeedata=" + JSON.stringify({
                xbeeid: xbeedata.xbeeid,
                vbatt: xbeedata.vbatt,
                ptrans: xbeedata.ptrans,
                pcheck: xbeedata.pcheck
            }));
            var url = '/api/xbeemodules/'
            url += xbeedata.xbeeid + '/xbeedata/'
            const conf = {
                method: "post",
                body: JSON.stringify({
                    xbeeid: xbeedata.xbeeid,
                    vbatt: xbeedata.vbatt,
                    ptrans: xbeedata.ptrans,
                    pcheck: xbeedata.pcheck,
                    created_at: new Date()
                }),
                headers: new Headers({"Content-Type": "application/json"})
            };
            fetch(url, conf).then(response => console.log(response));
        }
    }, 100)
}

function storeOrUpdateSensorModule(sensordata) {
    console.log(sensordata);
    var url = '/api/sensormodules/'
    fetch(url)
        .then(resp => {
            if (resp.status !== 200) {
                console.log("error on fetch " + url)
            }
            return resp.json();
        }).then(function (data) {
        if (data.lentgh == 0) {
            // pas de data sensor module on insere
            var url = '/api/sensormodules/'
            const conf = {
                method: "post",
                body: JSON.stringify({
                    sensor_uuid: sensordata.uid,
                    name: sensordata.os,
                    type: sensordata.os,
                    description: sensordata.os,
                    created_at: new Date(),
                    updated_at: new Date(),
                    techdata: sensordata.os
                }),
                headers: new Headers({"Content-Type": "application/json"})
            };
            fetch(url, conf).then(response => console.log(response));
        } else {
            // recherche si uuid existant
            for (var i = 0; i < data.length; i++) {
                if (data[i].sensor_uuid == sensordata.uid) {
                    // existe on update
                    var url = '/api/sensormodules/' + data[i].id + '/'
                    const conf = {
                        method: "put",
                        body: JSON.stringify({
                            sensor_uuid: sensordata.uid,
                            name: sensordata.os,
                            type: sensordata.os,
                            description: sensordata.os,
                            created_at: new Date(),
                            updated_at: new Date(),
                            techdata: sensordata.os
                        }),
                        headers: new Headers({"Content-Type": "application/json"})
                    };
                    fetch(url, conf).then(response => console.log(response));
                    break;
                }
                if (i = data.length -1){
                    console.log("not found");
                    var url = '/api/sensormodules/'
                    const conf = {
                        method: "post",
                        body: JSON.stringify({
                            sensor_uuid: sensordata.uid,
                            name: sensordata.os,
                            type: sensordata.os,
                            description: sensordata.os,
                            created_at: new Date(),
                            updated_at: new Date(),
                            techdata: sensordata.os
                        }),
                        headers: new Headers({"Content-Type": "application/json"})
                    };
                    fetch(url, conf).then(response => console.log(response));
                }

            }

        }


    }).catch(function (error) {
        // If there is any error you will catch them here
    });

    // url += xbeedata.xbeeid + '/xbeedata/'
    // const conf = {
    //     method: "post",
    //     body: JSON.stringify({ xbeeid: xbeedata.xbeeid , vbatt: xbeedata.vbatt, ptrans: xbeedata.ptrans, pcheck: xbeedata.pcheck, created_at: new Date()}),
    //     headers: new Headers({"Content-Type": "application/json"})
    // };
    // fetch(url, conf).then(response => console.log(response));

}

function socketConnectionInit(socket) {
    return {
        type: SOCKET_CONNECTION_INIT,
        socket,
    };
}

function socketConnectionSuccess() {
    return {
        type: SOCKET_CONNECTION_SUCCESS,
    };
}

function socketConnectionError() {
    return {
        type: SOCKET_CONNECTION_ERROR,
    };
}

function socketConnectionClosed() {
    return {
        type: SOCKET_CONNECTION_CLOSED,
    };
}

function socketMessage(data) {
    return {
        type: SOCKET_MESSAGE,
        data,
    };
}