import { CONVERTATION_CLOSE, CONVERTATION_OPEN } from "./convertationTypes";

const convertationReducer = (state = { isOpen: false }, action) => {
  const { type, payload } = action;
  switch (type) {
    case CONVERTATION_OPEN:
      return { isOpen: true, user: payload };
    case CONVERTATION_CLOSE:
      return { isOpen: false };
    default:
      return { isOpen: false };
  }
};

export default convertationReducer;
