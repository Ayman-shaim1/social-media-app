import {
  CONVERTATION_CLOSE,
  CONVERTATION_OPEN,
  CONVERTATION_UPDATE_SET_OFFLINE,
  CONVERTATION_UPDATE_SET_ONLINE,
  CONVERTATION_UPDATE_SET_DATE_DIFF_INC,
} from "./convertationTypes";

const convertationReducer = (state = { isOpen: false }, action) => {
  const { type, payload } = action;
  switch (type) {
    case CONVERTATION_OPEN:
      return { isOpen: true, user: payload };
    case CONVERTATION_UPDATE_SET_ONLINE:
      return {
        isOpen: true,
        user: { ...state.user, lastConnection: null, isOnline: true },
      };
    case CONVERTATION_UPDATE_SET_OFFLINE:
      return {
        isOpen: true,
        user: {
          ...state.user,
          lastConnection: new Date(),
          isOnline: false,
        },
      };
    case CONVERTATION_UPDATE_SET_DATE_DIFF_INC:
      return {
        isOpen: true,
        user: {
          ...state.user,
          isOnline: false,
          lastConnection: new Date(state.user.lastConnection),
        },
      };
    case CONVERTATION_CLOSE:
      return { isOpen: false };
    default:
      return state;
  }
};

export default convertationReducer;
