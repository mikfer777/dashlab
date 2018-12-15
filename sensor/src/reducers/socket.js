import ReconnectingWebSocket from 'reconnectingwebsocket';
import {addNotifcounter, addMailcounter} from "../actions/index";
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
        const socket = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/sensor/sock/");
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

            var obj = JSON.parse(event.data);
            console.log("socket.onmessage=" + obj.id);
            dispatch(socketMessage(event.data));
            var counterNotif = parseInt(obj.id, 10)
            const id = uuidv1();
            const type = 'mail';
            dispatch(addMailcounter({counterNotif, type, id}));
        };

        socket.onclose = function () {
            dispatch(socketConnectionClosed());
        };
    };
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