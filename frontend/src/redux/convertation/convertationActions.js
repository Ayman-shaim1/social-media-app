import { CONVERTATION_CLOSE, CONVERTATION_OPEN } from "./convertationTypes";

export const openConvertation = (data) => {
  return { type: CONVERTATION_OPEN, payload: data };
};

export const closeConvertation = () => {
  return { type: CONVERTATION_CLOSE };
};
