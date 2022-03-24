import { SHOW_DIALOG, HIDE_DIALOG } from "./dialogTypes";

export const showDialog = (obj) => {
  return { type: SHOW_DIALOG, payload: obj };
};

export const hideDialog = () => {
  return { type: HIDE_DIALOG };
};
