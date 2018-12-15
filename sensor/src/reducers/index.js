import { combineReducers } from "redux";;
import notifCounter from "./notifCounter";
import mailCounter from "./mailCounter";
import sensorSocket from './socket';
export default combineReducers({sensorSocket,notifcounters:notifCounter,mailcounters:mailCounter});
