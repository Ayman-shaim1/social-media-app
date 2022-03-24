import { SHOW_DIALOG, HIDE_DIALOG } from "./dialogTypes";

const dialogReducer = (state = { show: false }, action) => {
  const { type, payload } = action;
  switch (type) {
    case SHOW_DIALOG:
      return {
        show: true,
        title: payload.title,
        content: payload.content,
        onYes: payload.onYes,
        onNo: payload.onNo,
      };
    case HIDE_DIALOG:
      return { show: false };
    default:
      return state;
  }
};

export default dialogReducer;
