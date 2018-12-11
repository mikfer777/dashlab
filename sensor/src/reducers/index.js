import { combineReducers } from "redux";;
import notifCounter from "./notifCounter";
import mailCounter from "./mailCounter";
import socket from './socket';
export default combineReducers({notifcounters:notifCounter,mailcounters:mailCounter});
