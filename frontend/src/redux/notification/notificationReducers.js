import {
  NOTIFICATION_SEND_REQUEST,
  NOTIFICATION_SEND_SUCCESS,
  NOTIFICATION_SEND_FAIL,
  NOTIFICATION_SEND_RESET,
  NOTIFICATION_GET_LIST_REQUEST,
  NOTIFICATION_GET_LIST_SUCCESS,
  NOTIFICATION_GET_LIST_FAIL,
  NOTIFICATION_GET_LIST_RESET,
  NOTIFICATION_GET_LIST_SEEN_UPDATE,
  NOTIFICATION_GET_LIST_DELETE_UPDATE,
  NOTIFICATION_GET_LIST_UPDATE_PUSH,
  NOTIFICATION_DELETE_REQUEST,
  NOTIFICATION_DELETE_FAIL,
  NOTIFICATION_DELETE_RESET,
  NOTIFICATION_DELETE_SUCCESS,
  NOTIFICATION_SEEN_ALL_FAIL,
  NOTIFICATION_SEEN_ALL_REQUEST,
  NOTIFICATION_SEEN_ALL_RESET,
  NOTIFICATION_SEEN_ALL_SUCCESS,
} from "./notificationTypes";

export const notificationSendReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case NOTIFICATION_SEND_REQUEST:
      return { loading: true };
    case NOTIFICATION_SEND_SUCCESS:
      return { loading: false, success: true, notification: payload };
    case NOTIFICATION_SEND_FAIL:
      return { loading: false, error: payload };
    case NOTIFICATION_SEND_RESET:
      return {};
    default:
      return state;
  }
};

export const notificationListReducer = (
  state = { notifications: [] },
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case NOTIFICATION_GET_LIST_REQUEST:
      return { loading: true, notifications: [] };
    case NOTIFICATION_GET_LIST_SUCCESS:
      return { loading: false, success: true, notifications: payload };
    case NOTIFICATION_GET_LIST_UPDATE_PUSH:
      return {
        notifications: [payload, ...state.notifications],
      };
    case NOTIFICATION_GET_LIST_SEEN_UPDATE:
      return {
        notifications: state.notifications.map((notification) => {
          if (!notification.notification.isSeen)
            notification.notification.isSeen = true;
          return notification;
        }),
      };
    case NOTIFICATION_GET_LIST_DELETE_UPDATE:
      return {
        notifications: state.notifications.filter(
          (n) => String(n.notification._id) !== String(payload)
        ),
      };
    case NOTIFICATION_GET_LIST_FAIL:
      return { loading: false, notifications: [], error: payload };
    case NOTIFICATION_GET_LIST_RESET:
      return { notifications: [] };
    default:
      return state;
  }
};

export const notificationDeleteReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case NOTIFICATION_DELETE_REQUEST:
      return { loading: true };
    case NOTIFICATION_DELETE_SUCCESS:
      return { loading: false, success: true, notification: payload };
    case NOTIFICATION_DELETE_FAIL:
      return { loading: false, error: payload };
    case NOTIFICATION_DELETE_RESET:
      return {};
    default:
      return state;
  }
};

export const notificationSeenReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case NOTIFICATION_SEEN_ALL_REQUEST:
      return { loading: true };
    case NOTIFICATION_SEEN_ALL_SUCCESS:
      return { loading: false, success: true, notification: payload };
    case NOTIFICATION_SEEN_ALL_FAIL:
      return { loading: false, error: payload };
    case NOTIFICATION_SEEN_ALL_RESET:
      return {};
    default:
      return state;
  }
};
