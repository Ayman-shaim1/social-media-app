import {
  MESSAGE_GET_CONVERTATIONS_FAIL,
  MESSAGE_GET_CONVERTATIONS_REQUEST,
  MESSAGE_GET_CONVERTATIONS_RESET,
  MESSAGE_GET_CONVERTATIONS_SUCCESS,
  MESSAGE_GET_CONVERTATIONS_UPDATE_MESSAGE,
  MESSAGE_GET_CONVERTATIONS_UPDATE_REMOVE_CONV,
  MESSAGE_GET_CONVERTATIONS_UPDATE_REMOVE_MESSAGE,
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
  MESSAGE_SEND_FAIL,
  MESSAGE_SEND_REQUEST,
  MESSAGE_SEND_SUCCESS,
  MESSAGE_SEND_RESET,
  MESSAGE_REMOVE_CONVERTATION_FAIL,
  MESSAGE_REMOVE_CONVERTATION_REQUEST,
  MESSAGE_REMOVE_CONVERTATION_RESET,
  MESSAGE_REMOVE_CONVERTATION_SUCCESS,
  MESSAGE_DELETE_FAIL,
  MESSAGE_DELETE_REQUEST,
  MESSAGE_DELETE_RESET,
  MESSAGE_DELETE_SUCCESS,
  MESSAGE_SEEN_ALL_REQUEST,
  MESSAGE_SEEN_ALL_SUCCESS,
  MESSAGE_SEEN_ALL_FAIL,
  MESSAGE_SEEN_ALL_RESET,
} from "./messageTypes";
import axios from "axios";
import { io } from "socket.io-client";

const SERVER = "http://localhost:5000";
const socket = io(SERVER);

export const getConvertations = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: MESSAGE_GET_CONVERTATIONS_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${userInfo.token} `,
        },
      };
      const { data } = await axios.get(`/api/messages`, config);
      dispatch({ type: MESSAGE_GET_CONVERTATIONS_SUCCESS, payload: data });
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: MESSAGE_GET_CONVERTATIONS_FAIL, payload: err });
    }
  };
};

export const getNotSeenMessagesCount = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: MESSAGE_GET_NOTSEEN_COUNT_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${userInfo.token} `,
        },
      };
      const { data } = await axios.get(`/api/messages/notseen/count`, config);
      dispatch({ type: MESSAGE_GET_NOTSEEN_COUNT_SUCCESS, payload: data });
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: MESSAGE_GET_NOTSEEN_COUNT_FAIL, payload: err });
    }
  };
};

export const getMessages = (id) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: MESSAGE_GET_LIST_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();
      const config = {
        headers: {
          authorization: `Bearer ${userInfo.token} `,
        },
      };
      const { data } = await axios.get(`/api/messages/${id}`, config);
      dispatch({
        type: MESSAGE_GET_LIST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({
        type: MESSAGE_GET_LIST_FAIL,
        payload: err,
      });
    }
  };
};

export const sendMessage = (
  id,
  message,
  isMessagePost = false,
  pushMessage = true
) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: MESSAGE_SEND_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const {
        convertation: { user },
      } = getState();

      const {
        messageGetConvertations: { convertations },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${userInfo.token} `,
        },
      };

      const objToSend = {};
      if (isMessagePost) {
        objToSend.message_post = message;
      } else {
        objToSend.message_text = message;
      }

      const { data } = await axios.post(
        `/api/messages/${id}`,
        objToSend,
        config
      );

      const obj = {
        senderUser: {
          _id: userInfo._id,
          name: userInfo.name,
          avatar: userInfo.avatar,
        },
        receivedUserId: id,
        message: data,
      };

      socket.emit("send-message", obj);

      dispatch({
        type: MESSAGE_SEND_SUCCESS,
        payload: data,
      });
      if (pushMessage) {
        let index = convertations.findIndex(
          (c) => String(c.user._id) === String(user._id)
        );
        dispatch({
          type: MESSAGE_GET_CONVERTATIONS_UPDATE_MESSAGE,
          payload: {
            message: data,
            user: user,
            isConvExiste: index !== -1 ? true : false,
          },
        });

        dispatch({ type: MESSAGE_GET_LIST_UPDATE_PUSH, payload: data });
      }
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({
        type: MESSAGE_SEND_FAIL,
        payload: err,
      });
    }
  };
};

export const removeConvertation = (id) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: MESSAGE_REMOVE_CONVERTATION_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${userInfo.token} `,
        },
      };
      const { data } = await axios.put(
        `/api/messages/convertation/${id}`,
        {},
        config
      );

      dispatch({
        type: MESSAGE_REMOVE_CONVERTATION_SUCCESS,
        payload: data,
      });
      dispatch({
        type: MESSAGE_GET_CONVERTATIONS_UPDATE_REMOVE_CONV,
        payload: id,
      });

      dispatch({
        type: MESSAGE_GET_NOTSEEN_COUNT_UPDATE,
        payload: data,
      });
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({
        type: MESSAGE_REMOVE_CONVERTATION_FAIL,
        payload: err,
      });
    }
  };
};

export const deleteMessage = (id) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: MESSAGE_DELETE_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${userInfo.token} `,
        },
      };

      const {
        messageList: { messages },
      } = getState();

      const { data } = await axios.put(`/api/messages/${id}`, {}, config);
      dispatch({
        type: MESSAGE_DELETE_SUCCESS,
        payload: data,
      });

      dispatch({
        type: MESSAGE_GET_LIST_UPDATE_REMOVE,
        payload: id,
      });

      let index = messages.findIndex((m) => String(m._id) === String(id));

      if (index !== -1) {
        const message1 = messages[index];
        const message2 = messages[index - 1] || null;

        if (message2 !== null) {
          if (String(message2.message_from) === String(userInfo._id)) {
            message2.isConnectedUserSeend = true;
          } else {
            message2.isConnectedUserSeend = false;
          }
        }

        dispatch({
          type: MESSAGE_GET_CONVERTATIONS_UPDATE_REMOVE_MESSAGE,
          payload: {
            message1,
            message2,
          },
        });
      }
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({
        type: MESSAGE_DELETE_FAIL,
        payload: err,
      });
    }
  };
};

export const seenAllMessages = (id) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: MESSAGE_SEEN_ALL_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${userInfo.token} `,
        },
      };

      const { data } = await axios.put(`/api/messages/seen/${id}`, {}, config);
      dispatch({
        type: MESSAGE_SEEN_ALL_SUCCESS,
        payload: data,
      });

      dispatch({
        type: MESSAGE_GET_NOTSEEN_COUNT_UPDATE,
        payload: data,
      });
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({
        type: MESSAGE_SEEN_ALL_FAIL,
        payload: err,
      });
    }
  };
};

export const resetGetConvertations = () => {
  return { type: MESSAGE_GET_CONVERTATIONS_RESET };
};

export const resetGetNotSeenCountMessages = () => {
  return { type: MESSAGE_GET_NOTSEEN_COUNT_RESET };
};

export const resetGetMessages = () => {
  return { type: MESSAGE_GET_LIST_RESET };
};

export const resetSendMessage = () => {
  return { type: MESSAGE_SEND_RESET };
};

export const resetRemoveConvertation = () => {
  return { type: MESSAGE_REMOVE_CONVERTATION_RESET };
};

export const resetDeleteMessage = () => {
  return { type: MESSAGE_DELETE_RESET };
};

export const resetSeenAllMessages = () => {
  return { type: MESSAGE_SEEN_ALL_RESET };
};
