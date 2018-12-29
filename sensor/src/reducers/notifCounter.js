import { ADD_NOTIF } from "../constants/action-types";

const addNotifcounter = (state = [], action) => {
  switch (action.type) {
    case ADD_NOTIF:
    var x = action.payload
    console.log("notifcounter reducer.. :counter=" + x.counterNotif);
    console.log("notifcounter reducer. :id=" + x.id);
      return [...state, action.payload];
    default:
      return state;
  }
};


export default addNotifcounter;
