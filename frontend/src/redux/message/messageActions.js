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
import axios from "axios";

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
          "Content-Type": "application/json",
          authorization: `Bearer ${userInfo.token} `,
        },
      };

      const { data } = await axios.get(`/api/messages/${id}`, config);
      dispatch({ type: MESSAGE_GET_LIST_SUCCESS, payload: data });
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: MESSAGE_GET_LIST_FAIL, payload: err });
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
