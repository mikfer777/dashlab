import { ADD_MAIL } from "../constants/action-types";

const addMailcounter = (state = [], action) => {
  switch (action.type) {
    case ADD_MAIL:
    var x = action.payload
    console.log("mailcounter reducer.. :counter=" + x.counterNotif);
    console.log("mailcounter reducer. :type=" + x.type);
      return [...state, action.payload];
    default:
      return state;
  }
};


export default addMailcounter;
