export const addArticle = article => ({
  type: "ADD_ARTICLE",
  payload: article
});
export const addNotifcounter = value => ({
  type: "ADD_NOTIF",
  payload: value
});
export const addMailcounter = value => ({
  type: "ADD_MAIL",
  payload: value
});
export const sensorSocket = value => ({
    type: "SOCKET_SEND_MESSAGE",
    payload: value
});
export const addNotifcounterCam = value => ({
    type: "ADD_NOTIF_CAM",
    payload: value
});
export const addSelectedSensor = value => ({
    type: "ADD_SELECTED_SENSOR",
    payload: value
});
