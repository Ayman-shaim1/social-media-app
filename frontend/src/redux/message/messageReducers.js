import {
  MESSAGE_GET_CONVERTATIONS_FAIL,
  MESSAGE_GET_CONVERTATIONS_REQUEST,
  MESSAGE_GET_CONVERTATIONS_RESET,
  MESSAGE_GET_CONVERTATIONS_SUCCESS,
  MESSAGE_GET_CONVERTATIONS_UPDATE_MESSAGE,
  MESSAGE_GET_CONVERTATIONS_UPDATE_REMOVE_CONV,
  MESSAGE_GET_CONVERTATIONS_UPDATE_REMOVE_MESSAGE,
  MESSAGE_GET_CONVERTATIONS_UPDATE_SEEN_ALL,
  MESSAGE_GET_NOTSEEN_COUNT_FAIL,
  MESSAGE_GET_NOTSEEN_COUNT_REQUEST,
  MESSAGE_GET_NOTSEEN_COUNT_RESET,
  MESSAGE_GET_NOTSEEN_COUNT_SUCCESS,
  MESSAGE_GET_NOTSEEN_COUNT_UPDATE,
  MESSAGE_GET_LIST_FAIL,
  MESSAGE_GET_LIST_REQUEST,
  MESSAGE_GET_LIST_RESET,
  MESSAGE_GET_LIST_SUCCESS,
  MESSAGE_GET_LIST_UPDATE_PUSH,
  MESSAGE_GET_LIST_UPDATE_REMOVE,
  MESSAGE_GET_LIST_UPDATE_SEEN_ALL,
  MESSAGE_SEND_FAIL,
  MESSAGE_SEND_REQUEST,
  MESSAGE_SEND_RESET,
  MESSAGE_SEND_SUCCESS,
  MESSAGE_REMOVE_CONVERTATION_FAIL,
  MESSAGE_REMOVE_CONVERTATION_REQUEST,
  MESSAGE_REMOVE_CONVERTATION_RESET,
  MESSAGE_REMOVE_CONVERTATION_SUCCESS,
  MESSAGE_DELETE_FAIL,
  MESSAGE_DELETE_REQUEST,
  MESSAGE_DELETE_RESET,
  MESSAGE_DELETE_SUCCESS,
  MESSAGE_SEEN_ALL_FAIL,
  MESSAGE_SEEN_ALL_REQUEST,
  MESSAGE_SEEN_ALL_RESET,
  MESSAGE_SEEN_ALL_SUCCESS,
  MESSAGE_GET_NOTSEEN_FAIL,
  MESSAGE_GET_NOTSEEN_REQUEST,
  MESSAGE_GET_NOTSEEN_RESET,
  MESSAGE_GET_NOTSEEN_SUCCESS,
  MESSAGE_GET_NOTSEEN_UPDATE_PUSH,
  MESSAGE_SEEN_TOAST_FAIL,
  MESSAGE_SEEN_TOAST_REQUEST,
  MESSAGE_SEEN_TOAST_RESET,
  MESSAGE_SEEN_TOAST_SUCCESS,
  MESSAGE_GET_CONVERTATIONS_UPDATE_USER_TYPING,
  MESSAGE_GET_CONVERTATIONS_UPDATE_USER_STOP_TYPING,
} from "./messageTypes";

export const messageGetNotSeenReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case MESSAGE_GET_NOTSEEN_COUNT_REQUEST:
      return { loading: true };
    case MESSAGE_GET_NOTSEEN_COUNT_SUCCESS:
      return { loading: false, nbr: payload, success: true };
    case MESSAGE_GET_NOTSEEN_COUNT_UPDATE:
      return { nbr: payload };
    case MESSAGE_GET_NOTSEEN_COUNT_FAIL:
      return { error: payload };
    case MESSAGE_GET_NOTSEEN_COUNT_RESET:
      return {};
    default:
      return state;
  }
};

// change state functions :
const messageGetConvertationUpdate = (state, payload) => {
  let newConvertations = [];
  console.log(payload);

  if (payload.isConvExiste) {
    for (let i = 0; i < state.convertations.length; i++) {
      if (
        String(state.convertations[i].user._id) ===
        String(payload.message.message_to)
      ) {
        newConvertations.push({
          user: state.convertations[i].user,
          message: {
            ...payload.message,
            nbr: state.convertations[i].message.nbr,
            isConnectedUserSeend: true,
          },
        });
      } else if (
        String(state.convertations[i].user._id) ===
        String(payload.message.message_from)
      ) {
        let nbr = 0;
        if (!payload.message.isSeen) {
          nbr = state.convertations[i].message.nbr + 1;
        }

        newConvertations.push({
          user: state.convertations[i].user,
          message: {
            ...payload.message,
            nbr: nbr,
            isConnectedUserSeend: false,
          },
        });
      } else {
        newConvertations.push(state.convertations[i]);
      }
    }
  } else {
    newConvertations = state.convertations;
    newConvertations.push({
      user: payload.user,
      message: { ...payload.message, nbr: 0, isConnectedUserSeend: true },
    });
  }
  newConvertations.sort((a, b) => {
    return new Date(b.message.message_date) - new Date(a.message.message_date);
  });

  console.log(newConvertations);

  return newConvertations;
};

const messageGetConvertationUpdateRemove = (state, payload) => {
  const newConvertations = [];

  for (let i = 0; i < state.convertations.length; i++) {
    if (
      String(payload.message1._id) ===
      String(state.convertations[i].message._id)
    ) {
      if (payload.message2 !== null) {
        newConvertations.push({
          user: state.convertations[i].user,
          message: {
            ...payload.message2,
            nbr: state.convertations[i].message.nbr,
          },
        });
      }
    } else {
      newConvertations.push(state.convertations[i]);
    }
  }

  newConvertations.sort((a, b) => {
    return new Date(b.message.message_date) - new Date(a.message.message_date);
  });

  return newConvertations;
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
    case MESSAGE_GET_CONVERTATIONS_UPDATE_MESSAGE:
      return {
        convertations: messageGetConvertationUpdate(state, payload),
        success: true,
      };
    case MESSAGE_GET_CONVERTATIONS_UPDATE_REMOVE_CONV:
      return {
        convertations: state.convertations.filter(
          (c) => String(c.user._id) !== String(payload)
        ),
        success: true,
      };
    case MESSAGE_GET_CONVERTATIONS_UPDATE_REMOVE_MESSAGE:
      return {
        convertations: messageGetConvertationUpdateRemove(state, payload),
        success: true,
      };
    case MESSAGE_GET_CONVERTATIONS_UPDATE_SEEN_ALL:
      return {
        success: true,
        convertations: state.convertations.map((convertation) => {
          if (String(convertation.user._id) === String(payload)) {
            convertation.message.isSeen = true;
            convertation.message.nbr = 0;
          }
          return convertation;
        }),
      };
    case MESSAGE_GET_CONVERTATIONS_UPDATE_USER_TYPING:
      return {
        success: true,
        convertations: state.convertations.map((convertation) => {
          if (String(convertation.user._id) === String(payload)) {
            convertation.user.isTyping = true;
          }
          return convertation;
        }),
      };
    case MESSAGE_GET_CONVERTATIONS_UPDATE_USER_STOP_TYPING:
      return {
        success: true,
        convertations: state.convertations.map((convertation) => {
          if (String(convertation.user._id) === String(payload)) {
            convertation.user.isTyping = false;
          }
          return convertation;
        }),
      };
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
      return { loading: true, messages: [] };
    case MESSAGE_GET_LIST_SUCCESS:
      return { loading: false, messages: payload, success: true };

    case MESSAGE_GET_LIST_FAIL:
      return { loading: false, messages: [], error: payload };
    case MESSAGE_GET_LIST_UPDATE_PUSH:
      return {
        messages: [...state.messages, payload],
        success: true,
      };
    case MESSAGE_GET_LIST_UPDATE_REMOVE:
      return {
        messages: state.messages.filter(
          (m) => String(m._id) !== String(payload)
        ),
        success: true,
      };
    case MESSAGE_GET_LIST_UPDATE_SEEN_ALL:
      return {
        messages: state.messages.map((message) => {
          message.isSeen = true;
          return message;
        }),
        success: true,
      };
    case MESSAGE_GET_LIST_RESET:
      return { messages: [] };
    default:
      return state;
  }
};

export const messageSendReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case MESSAGE_SEND_REQUEST:
      return { loading: true };
    case MESSAGE_SEND_SUCCESS:
      return { loading: false, message: payload, success: true };
    case MESSAGE_SEND_FAIL:
      return { loading: false, error: payload };
    case MESSAGE_SEND_RESET:
      return {};
    default:
      return state;
  }
};

export const messageRemoveConvertationReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case MESSAGE_REMOVE_CONVERTATION_REQUEST:
      return { loading: true };
    case MESSAGE_REMOVE_CONVERTATION_SUCCESS:
      return { loading: false, success: true, count: payload };
    case MESSAGE_REMOVE_CONVERTATION_FAIL:
      return { loading: false, error: payload };
    case MESSAGE_REMOVE_CONVERTATION_RESET:
      return {};
    default:
      return state;
  }
};

export const messageDeleteReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case MESSAGE_DELETE_REQUEST:
      return { loading: true };
    case MESSAGE_DELETE_SUCCESS:
      return { loading: false, success: true, message: payload };
    case MESSAGE_DELETE_FAIL:
      return { loading: false, error: payload };
    case MESSAGE_DELETE_RESET:
      return {};
    default:
      return state;
  }
};

export const messageSeenAllReducer = (state = {}, action) => {
  const { payload, type } = action;
  switch (type) {
    case MESSAGE_SEEN_ALL_REQUEST:
      return { loading: true };
    case MESSAGE_SEEN_ALL_SUCCESS:
      return { loading: false, nbr: payload, success: true };
    case MESSAGE_SEEN_ALL_FAIL:
      return { error: payload };
    case MESSAGE_SEEN_ALL_RESET:
      return {};
    default:
      return state;
  }
};

export const messageGetNotSeenListReducer = (
  state = { messages: [] },
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case MESSAGE_GET_NOTSEEN_REQUEST:
      return { loading: true, messages: [] };
    case MESSAGE_GET_NOTSEEN_SUCCESS:
      return { messages: payload };
    case MESSAGE_GET_NOTSEEN_FAIL:
      return { messages: [], error: payload };
    case MESSAGE_GET_NOTSEEN_UPDATE_PUSH:
      return { messages: [payload, ...state.messages] };
    case MESSAGE_GET_NOTSEEN_RESET:
      return { messages: [] };
    default:
      return state;
  }
};

export const messageSeenToastReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case MESSAGE_SEEN_TOAST_REQUEST:
      return { loading: true };
    case MESSAGE_SEEN_TOAST_SUCCESS:
      return { success: true, message: payload };
    case MESSAGE_SEEN_TOAST_FAIL:
      return { error: payload };
    case MESSAGE_SEEN_TOAST_RESET:
      return {};
    default:
      return state;
  }
};
