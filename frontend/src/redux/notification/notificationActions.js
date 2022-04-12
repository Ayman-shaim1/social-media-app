import {
  NOTIFICATION_SEND_REQUEST,
  NOTIFICATION_SEND_SUCCESS,
  NOTIFICATION_SEND_FAIL,
  NOTIFICATION_SEND_RESET,
  NOTIFICATION_GET_LIST_REQUEST,
  NOTIFICATION_GET_LIST_SUCCESS,
  NOTIFICATION_GET_LIST_FAIL,
  NOTIFICATION_GET_LIST_RESET,
  NOTIFICATION_GET_LIST_DELETE_UPDATE,
  NOTIFICATION_DELETE_REQUEST,
  NOTIFICATION_DELETE_FAIL,
  NOTIFICATION_DELETE_RESET,
  NOTIFICATION_DELETE_SUCCESS,
  NOTIFICATION_SEEN_ALL_FAIL,
  NOTIFICATION_SEEN_ALL_REQUEST,
  NOTIFICATION_SEEN_ALL_RESET,
  NOTIFICATION_SEEN_ALL_SUCCESS,
} from "./notificationTypes";

import axios from "axios";
import { io } from "socket.io-client";

const SERVER = "http://localhost:5000";
const socket = io(SERVER);

export const sendNotification = (id, title, text_content) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: NOTIFICATION_SEND_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/notifications/${id}`,
        { title, text_content },
        config
      );
      dispatch({ type: NOTIFICATION_SEND_SUCCESS, payload: data });
      const obj = {
        receivedUserId: id,
        notification: data,
      };
      socket.emit("send-notification", obj);
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;

      dispatch({ type: NOTIFICATION_SEND_FAIL, payload: err });
    }
  };
};

export const getListNotifications = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: NOTIFICATION_GET_LIST_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();
      const config = {
        headers: {
          authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get("/api/notifications", config);
      dispatch({ type: NOTIFICATION_GET_LIST_SUCCESS, payload: data });
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;

      dispatch({ type: NOTIFICATION_GET_LIST_FAIL, payload: err });
    }
  };
};

export const deleteNotification = (id) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: NOTIFICATION_DELETE_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put(`/api/notifications/${id}`, {}, config);
      dispatch({ type: NOTIFICATION_DELETE_SUCCESS, payload: data });
      dispatch({ type: NOTIFICATION_GET_LIST_DELETE_UPDATE, payload: id });
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;

      dispatch({ type: NOTIFICATION_DELETE_FAIL, payload: err });
    }
  };
};

export const seenAllNotifications = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: NOTIFICATION_SEEN_ALL_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put(`/api/notifications/seen`, {}, config);
      dispatch({ type: NOTIFICATION_SEEN_ALL_SUCCESS, payload: data });
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;

      dispatch({ type: NOTIFICATION_SEEN_ALL_FAIL, payload: err });
    }
  };
};

export const resetSendNotification = () => {
  return { type: NOTIFICATION_SEND_RESET };
};

export const resetGetListNotification = () => {
  return { type: NOTIFICATION_GET_LIST_RESET };
};

export const resetDeleteNotification = () => {
  return { type: NOTIFICATION_DELETE_RESET };
};

export const resetSeenAllNotification = () => {
  return { type: NOTIFICATION_SEEN_ALL_RESET };
};
