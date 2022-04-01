import {
  MESSAGE_GET_CONVERTATIONS_FAIL,
  MESSAGE_GET_CONVERTATIONS_REQUEST,
  MESSAGE_GET_CONVERTATIONS_RESET,
  MESSAGE_GET_CONVERTATIONS_SUCCESS,
  MESSAGE_GET_NOTSEEN_COUNT_FAIL,
  MESSAGE_GET_NOTSEEN_COUNT_REQUEST,
  MESSAGE_GET_NOTSEEN_COUNT_RESET,
  MESSAGE_GET_NOTSEEN_COUNT_SUCCESS,
  MESSAGE_GET_LIST_FAIL,
  MESSAGE_GET_LIST_REQUEST,
  MESSAGE_GET_LIST_RESET,
  MESSAGE_GET_LIST_SUCCESS,
} from "./messageTypes";

export const messageGetNotSeenReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case MESSAGE_GET_NOTSEEN_COUNT_REQUEST:
      return { loading: true };
    case MESSAGE_GET_NOTSEEN_COUNT_SUCCESS:
      return { loading: false, nbr: payload, success: true };
    case MESSAGE_GET_NOTSEEN_COUNT_FAIL:
      return { error: payload };
    case MESSAGE_GET_NOTSEEN_COUNT_RESET:
      return {};
    default:
      return state;
  }
};

export const messageGetConvertationsReducer = (
  state = { convertations: [] },
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case MESSAGE_GET_CONVERTATIONS_REQUEST:
      return { loading: true, convertations: [] };
    case MESSAGE_GET_CONVERTATIONS_SUCCESS:
      return { loading: false, convertations: payload, success: true };
    case MESSAGE_GET_CONVERTATIONS_FAIL:
      return { convertations: [], error: payload };
    case MESSAGE_GET_CONVERTATIONS_RESET:
      return { convertations: [] };
    default:
      return state;
  }
};

export const messageListReducer = (state = { messages: [] }, action) => {
  const { type, payload } = action;
  switch (type) {
    case MESSAGE_GET_LIST_REQUEST:
      return { messages: [], loading: true };
    case MESSAGE_GET_LIST_SUCCESS:
      return { messages: payload };
    case MESSAGE_GET_LIST_FAIL:
      return { error: payload };
    case MESSAGE_GET_LIST_RESET:
      return { messages: [] };
    default:
      return state;
  }
};
