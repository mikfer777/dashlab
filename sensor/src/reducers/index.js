import {combineReducers} from "redux";
import notifCounter from "./notifCounter";
import mailCounter from "./mailCounter";
import notifCounterCAM from "./notifCounterCam";
import notifSelectedSensor from "./notifSelectedSensor";
import sensorSocket from './socket';

export default combineReducers({
    sensorSocket,
    notifcounters: notifCounter,
    mailcounters: mailCounter,
    notifCAMcounters: notifCounterCAM,
    notifSelectedSensors: notifSelectedSensor
});
