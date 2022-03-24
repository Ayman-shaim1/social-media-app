import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_GET_BY_ID_FAIL,
  USER_GET_BY_ID_REQUEST,
  USER_GET_BY_ID_RESET,
  USER_GET_BY_ID_SUCCESS,
  USER_CHANGE_NAME_FAIL,
  USER_CHANGE_NAME_REQUEST,
  USER_CHANGE_NAME_RESET,
  USER_CHANGE_NAME_SUCCESS,
  USER_CHANGE_AVATAR_FAIL,
  USER_CHANGE_AVATAR_REQUEST,
  USER_CHANGE_AVATAR_RESET,
  USER_CHANGE_AVATAR_SUCCESS,
  USER_CHANGE_PASSWORD_FAIL,
  USER_CHANGE_PASSWORD_REQUEST,
  USER_CHANGE_PASSWORD_RESET,
  USER_CHANGE_PASSWORD_SUCCESS,
  USER_FIND_FAIL,
  USER_FIND_REQUEST,
  USER_FIND_RESET,
  USER_FIND_SUCCESS,
  USER_FOLLOW_FAIL,
  USER_FOLLOW_REQUEST,
  USER_FOLLOW_RESET,
  USER_FOLLOW_SUCCESS,
  USER_GET_REQUESTS_FAIL,
  USER_GET_REQUESTS_REQUEST,
  USER_GET_REQUESTS_RESET,
  USER_GET_REQUESTS_SUCCESS,
  USER_GET_REQUESTS_UPDATE_REMOVE,
  USER_ACCEPT_FOLLOW_FAIL,
  USER_ACCEPT_FOLLOW_REQUEST,
  USER_ACCEPT_FOLLOW_RESET,
  USER_ACCEPT_FOLLOW_SUCCESS,
  USER_REJECT_FOLLOW_FAIL,
  USER_REJECT_FOLLOW_REQUEST,
  USER_REJECT_FOLLOW_RESET,
  USER_REJECT_FOLLOW_SUCCESS,
  USER_UNFOLLOW_FAIL,
  USER_UNFOLLOW_REQUEST,
  USER_UNFOLLOW_RESET,
  USER_UNFOLLOW_SUCCESS,
  USER_REMOVE_FOLLOWING_FAIL,
  USER_REMOVE_FOLLOWING_REQUEST,
  USER_REMOVE_FOLLOWING_RESET,
  USER_REMOVE_FOLLOWING_SUCCESS,
} from "./userTypes";

export const userLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true };
    case USER_LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case USER_LOGIN_FAIL:
      return { loading: false, error: action.payload };
    case USER_LOGOUT:
      return {};
    default:
      return state;
  }
};

export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return { loading: true };
    case USER_REGISTER_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case USER_REGISTER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userByIdReducer = (state = {}, action) => {
  const { payload, type } = action;

  switch (type) {
    case USER_GET_BY_ID_REQUEST:
      return { loading: true };
    case USER_GET_BY_ID_SUCCESS:
      return { loading: false, user: payload };
    case USER_GET_BY_ID_FAIL:
      return { error: payload, loading: false };
    case USER_GET_BY_ID_RESET:
      return {};
    default:
      return state;
  }
};

export const userFindReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case USER_FIND_REQUEST:
      return { loading: true };
    case USER_FIND_SUCCESS:
      return { loading: false, users: payload };

    case USER_FIND_FAIL:
      return { loading: false, error: payload };
    case USER_FIND_RESET:
      return {};
    default:
      return state;
  }
};

export const userFollowReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case USER_FOLLOW_REQUEST:
      return { loading: true };
    case USER_FOLLOW_SUCCESS:
      return {
        loading: false,
        success: true,
        resFollow: payload,
      };
    case USER_FOLLOW_FAIL:
      return { loading: false, error: payload };
    case USER_FOLLOW_RESET:
      return {};
    default:
      return state;
  }
};

export const userUnFollowReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case USER_UNFOLLOW_REQUEST:
      return { loading: true };
    case USER_UNFOLLOW_SUCCESS:
      return {
        loading: false,
        success: true,
        resUnFollow: payload,
      };
    case USER_UNFOLLOW_FAIL:
      return {
        loading: false,
        error: payload,
      };
    case USER_UNFOLLOW_RESET:
      return {};
    default:
      return state;
  }
};

const userRequestsUpdate = (state, payload) => {
  const newUsers = [];
  for (let i = 0; i < state.users.length; i++) {
    if (String(state.users[i]._id) !== String(payload))
      newUsers.push(state.users[i]);
  }
  
  state.users = newUsers;
  return state.users;
};

export const userRequestsReducer = (state = { users: [] }, action) => {
  const { type, payload } = action;
  switch (type) {
    case USER_GET_REQUESTS_REQUEST:
      return { loading: true, users: [] };
    case USER_GET_REQUESTS_SUCCESS:
      return { loading: false, success: true, users: payload };
    case USER_GET_REQUESTS_UPDATE_REMOVE:
      return {
        users: userRequestsUpdate(state, payload),
      };
    case USER_GET_REQUESTS_FAIL:
      return { loading: false, error: payload, users: [] };
    case USER_GET_REQUESTS_RESET:
      return { users: [] };

    default:
      return state;
  }
};

export const userAcceptFollowReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case USER_ACCEPT_FOLLOW_REQUEST:
      return { loading: true };
    case USER_ACCEPT_FOLLOW_SUCCESS:
      return { loading: false, success: true };
    case USER_ACCEPT_FOLLOW_FAIL:
      return { loading: false, error: payload };
    case USER_ACCEPT_FOLLOW_RESET:
      return {};

    default:
      return state;
  }
};

export const userRejectFollowReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case USER_REJECT_FOLLOW_REQUEST:
      return { loading: true };
    case USER_REJECT_FOLLOW_SUCCESS:
      return { loading: false, success: true };
    case USER_REJECT_FOLLOW_FAIL:
      return { loading: false, error: payload };
    case USER_REJECT_FOLLOW_RESET:
      return {};
    default:
      return state;
  }
};

export const userRemoveFollowReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case USER_REMOVE_FOLLOWING_REQUEST:
      return { loading: true };
    case USER_REMOVE_FOLLOWING_SUCCESS:
      return { loading: false, success: true, resRemoveUser: payload };
    case USER_REMOVE_FOLLOWING_FAIL:
      return { loading: false, error: payload };
    case USER_REMOVE_FOLLOWING_RESET:
      return {};
    default:
      return state;
  }
};

export const userChangeNameReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case USER_CHANGE_NAME_REQUEST:
      return { loading: true };
    case USER_CHANGE_NAME_SUCCESS:
      return { loading: false, success: true, user: payload };
    case USER_CHANGE_NAME_FAIL:
      return { loading: false, error: payload };
    case USER_CHANGE_NAME_RESET:
      return {};
    default:
      return state;
  }
};

export const userChangePasswordReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case USER_CHANGE_PASSWORD_REQUEST:
      return { loading: true };
    case USER_CHANGE_PASSWORD_SUCCESS:
      return { loading: false, success: true, user: payload };
    case USER_CHANGE_PASSWORD_FAIL:
      return { loading: false, error: payload };
    case USER_CHANGE_PASSWORD_RESET:
      return {};
    default:
      return state;
  }
};

export const userChangeAvatarReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case USER_CHANGE_AVATAR_REQUEST:
      return { loading: true };
    case USER_CHANGE_AVATAR_SUCCESS:
      return { loading: false, success: true, user: payload };
    case USER_CHANGE_AVATAR_FAIL:
      return { loading: false, error: payload };
    case USER_CHANGE_AVATAR_RESET:
      return {};
    default:
      return state;
  }
};
