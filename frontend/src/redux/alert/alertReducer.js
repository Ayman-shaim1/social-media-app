import { SHOW_ALERT, HIDE_ALERT } from "./alertTypes";

const alertReducer = (state = { show: false }, action) => {
  const { type, payload } = action;
  switch (type) {
    case SHOW_ALERT:
      return {
        show: true,
        type: payload.type,
        title: payload.title,
        content: payload.content,
      };
    case HIDE_ALERT:
      return { show: false };
    default:
      return state;
  }
};

export default alertReducer;
