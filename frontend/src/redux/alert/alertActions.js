import { SHOW_ALERT, HIDE_ALERT } from "./alertTypes";

export const showAlert = (obj) => {
  return { type: SHOW_ALERT, payload: obj };
};

export const hideAlert = () => {
  return {
    type: HIDE_ALERT,
  };
};
