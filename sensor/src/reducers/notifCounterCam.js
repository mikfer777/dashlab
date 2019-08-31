import {ADD_NOTIF_CAM} from "../constants/action-types";

const addNotifcounterCAM = (state = [], action) => {
    switch (action.type) {
        case ADD_NOTIF_CAM:
            var x = action.payload
            console.log("notifcounterCam reducer.. :counter=" + x.counterNotif);
            console.log("notifcounterCam reducer. :id=" + x.id);
            var payload = state[state.length - 1];
            if (typeof payload !== 'undefined'){
                action.payload.counterNotif += payload.counterNotif;
            }

            return [action.payload];
        default:
            return state;
    }
};


export default addNotifcounterCAM;
