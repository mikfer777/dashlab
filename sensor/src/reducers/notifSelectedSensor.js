import { ADD_SELECTED_SENSOR } from "../constants/action-types";

const addSelectedSensor = (state = [], action) => {
  switch (action.type) {
    case ADD_SELECTED_SENSOR:
    var x = action.payload
    console.log("selectedsensor reducer.. :selected=" + x.name);
      return [...state, action.payload];
    default:
      return state;
  }
};


export default addSelectedSensor;
