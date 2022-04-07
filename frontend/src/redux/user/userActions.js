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
  USER_ACCEPT_FOLLOW_FAIL,
  USER_ACCEPT_FOLLOW_REQUEST,
  USER_ACCEPT_FOLLOW_RESET,
  USER_ACCEPT_FOLLOW_SUCCESS,
  USER_REJECT_FOLLOW_FAIL,
  USER_REJECT_FOLLOW_REQUEST,
  USER_REJECT_FOLLOW_RESET,
  USER_REJECT_FOLLOW_SUCCESS,
  USER_GET_REQUESTS_UPDATE_REMOVE,
  USER_UNFOLLOW_FAIL,
  USER_UNFOLLOW_REQUEST,
  USER_UNFOLLOW_RESET,
  USER_UNFOLLOW_SUCCESS,
  USER_CHANGE_NAME_FAIL,
  USER_CHANGE_NAME_REQUEST,
  USER_CHANGE_NAME_RESET,
  USER_CHANGE_NAME_SUCCESS,
  USER_CHANGE_ACCOUNT_STATE_FAIL,
  USER_CHANGE_ACCOUNT_STATE_REQUEST,
  USER_CHANGE_ACCOUNT_STATE_RESET,
  USER_CHANGE_ACCOUNT_STATE_SUCCESS,
  USER_CHANGE_AVATAR_FAIL,
  USER_CHANGE_AVATAR_REQUEST,
  USER_CHANGE_AVATAR_RESET,
  USER_CHANGE_AVATAR_SUCCESS,
  USER_CHANGE_PASSWORD_FAIL,
  USER_CHANGE_PASSWORD_REQUEST,
  USER_CHANGE_PASSWORD_RESET,
  USER_CHANGE_PASSWORD_SUCCESS,
  USER_REMOVE_FOLLOWING_FAIL,
  USER_REMOVE_FOLLOWING_REQUEST,
  USER_REMOVE_FOLLOWING_RESET,
  USER_REMOVE_FOLLOWING_SUCCESS,
  USER_CHECK_FOLLOW_FAIL,
  USER_CHECK_FOLLOW_REQUEST,
  USER_CHECK_FOLLOW_RESET,
  USER_CHECK_FOLLOW_SUCCESS,
  USER_GET_FOLLOWERS_REQUEST,
  USER_GET_FOLLOWERS_FAIL,
  USER_GET_FOLLOWERS_RESET,
  USER_GET_FOLLOWERS_SUCCESS,
} from "./userTypes";
import { POST_LIST_RESET } from "../post/postTypes";

import { sendNotification } from "../notification/notificationActions";

import axios from "axios";

export const login = (email, password) => {
  return (dispatch) => {
    dispatch({ type: USER_LOGIN_REQUEST });
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    axios
      .post("/api/users/login", { email, password }, config)
      .then((response) => {
        const data = response.data;
        dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
        localStorage.setItem("userInfo", JSON.stringify(data));
      })
      .catch((error) => {
        const err =
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message;

        dispatch({ type: USER_LOGIN_FAIL, payload: err });
      });
  };
};

export const logout = () => {
  return (dispatch) => {
    localStorage.removeItem("userInfo");
    dispatch({ type: USER_LOGOUT });
    dispatch({ type: POST_LIST_RESET });
  };
};

export const register = (name, email, avatar, password) => {
  return async (dispatch) => {
    try {
      dispatch({ type: USER_REGISTER_REQUEST });
      const config = {
        headers: { "Content-Type": "application/json" },
      };

      if (avatar !== null) {
        const configUpload = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };

        const formData = new FormData();
        formData.append("avatar", avatar);
        const { data: avatarSrc } = await axios.post(
          "/api/upload/avatars",
          formData,
          configUpload
        );

        const { data } = await axios.post(
          "/api/users",
          { name, email, avatarSrc, password },
          config
        );
        dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
        dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
        localStorage.setItem("userInfo", JSON.stringify(data));
        dispatch(
          sendNotification(
            data._id,
            `welcome ${data.name}`,
            `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet, autem eligendi! Tenetur excepturi quis enim doloribus repellat culpa facere ea?`
          )
        );
      } else {
        const { data } = await axios.post(
          "/api/users",
          { name, email, avatarSrc: null, password },
          config
        );
        dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
        dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
        localStorage.setItem("userInfo", JSON.stringify(data));

        dispatch(
          sendNotification(
            data._id,
            `welcome ${data.name}`,
            `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet, autem eligendi! Tenetur excepturi quis enim doloribus repellat culpa facere ea?`
          )
        );
      }
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: USER_REGISTER_FAIL, payload: err });
    }
  };
};

export const getByIdUser = (id) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: USER_GET_BY_ID_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          authorization: `Bearer ${userInfo.token} `,
        },
      };

      const { data } = await axios.get(`/api/users/${id}`, config);

      dispatch({ type: USER_GET_BY_ID_SUCCESS, payload: data });
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: USER_GET_BY_ID_FAIL, payload: err });
    }
  };
};

export const resetGetByIdUser = () => {
  return { type: USER_GET_BY_ID_RESET };
};

export const findUsers = (arg) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: USER_FIND_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          authorization: `Bearer ${userInfo.token} `,
        },
      };

      const { data } = await axios.get(`/api/users/find/${arg}`, config);
      dispatch({ type: USER_FIND_SUCCESS, payload: data });
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: USER_FIND_FAIL, payload: err });
    }
  };
};

export const resetFindUser = () => {
  return { type: USER_FIND_RESET };
};

export const followUser = (id) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: USER_FOLLOW_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          authorization: `Bearer ${userInfo.token} `,
        },
      };
      const { data } = await axios.post(`/api/users/follow/${id}`, {}, config);
      dispatch({ type: USER_FOLLOW_SUCCESS, payload: data });
      dispatch(
        sendNotification(
          id,
          `${userInfo.name} want to follow you`,
          `This user ${userInfo.name} want to follow you vist the <a href="/profile/${userInfo._id}">profile</a> of this user`
        )
      );
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: USER_FOLLOW_FAIL, payload: err });
    }
  };
};

export const checkFollowRequestUser = (id) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: USER_CHECK_FOLLOW_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          authorization: `Bearer ${userInfo.token} `,
        },
      };
      const { data } = await axios.get(
        `/api/users/followers/requests/check/${id}`,
        config
      );
      dispatch({ type: USER_CHECK_FOLLOW_SUCCESS, payload: data });
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: USER_CHECK_FOLLOW_FAIL, payload: err });
    }
  };
};

export const resetCheckFollowRequestUser = () => {
  return { type: USER_CHECK_FOLLOW_RESET };
};

export const unFollowUser = (id) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: USER_UNFOLLOW_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          authorization: `Bearer ${userInfo.token} `,
        },
      };
      const { data } = await axios.delete(`/api/users/unfollow/${id}`, config);
      dispatch({ type: USER_UNFOLLOW_SUCCESS, payload: data });
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: USER_UNFOLLOW_FAIL, payload: err });
    }
  };
};

export const resetFollowUser = () => {
  return { type: USER_FOLLOW_RESET };
};

export const getRequestsUsers = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: USER_GET_REQUESTS_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          authorization: `Bearer ${userInfo.token} `,
        },
      };
      const { data } = await axios.get(`/api/users/followers/requests`, config);
      dispatch({ type: USER_GET_REQUESTS_SUCCESS, payload: data });
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: USER_GET_REQUESTS_FAIL, payload: err });
    }
  };
};

export const resetRequestsUsers = () => {
  return { type: USER_GET_REQUESTS_RESET };
};

export const acceptRequestUser = (id) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: USER_ACCEPT_FOLLOW_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          authorization: `Bearer ${userInfo.token} `,
        },
      };
      const { data } = await axios.put(
        `/api/users/follow/accept/${id}`,
        {},
        config
      );

      dispatch({ type: USER_ACCEPT_FOLLOW_SUCCESS, payload: data });
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: USER_ACCEPT_FOLLOW_FAIL, payload: err });
    }
  };
};

export const rejectRequestUser = (id) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: USER_REJECT_FOLLOW_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          authorization: `Bearer ${userInfo.token} `,
        },
      };
      const { data } = await axios.put(
        `/api/users/follow/reject/${id}`,
        {},
        config
      );

      dispatch({ type: USER_REJECT_FOLLOW_SUCCESS, payload: data });
      dispatch({ type: USER_GET_REQUESTS_UPDATE_REMOVE, payload: id });
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: USER_REJECT_FOLLOW_FAIL, payload: err });
    }
  };
};

export const resetAcceptRequestUser = () => {
  return { type: USER_ACCEPT_FOLLOW_RESET };
};

export const resetRejectRequestUser = () => {
  return { type: USER_REJECT_FOLLOW_RESET };
};

export const removeFollowUser = (id) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: USER_REMOVE_FOLLOWING_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          authorization: `Bearer ${userInfo.token} `,
        },
      };
      const { data } = await axios.delete(
        `/api/users/follow/remove/${id}`,
        config
      );
      dispatch({ type: USER_REMOVE_FOLLOWING_SUCCESS, payload: data });
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: USER_REMOVE_FOLLOWING_FAIL, payload: err });
    }
  };
};
export const resetRemoveFollowing = () => {
  return { type: USER_REMOVE_FOLLOWING_RESET };
};

export const resetUnFollowUser = () => {
  return { type: USER_UNFOLLOW_RESET };
};

export const changeNameUser = (name) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: USER_CHANGE_NAME_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${userInfo.token} `,
        },
      };

      const { data } = await axios.put(`/api/users/name/`, { name }, config);
      dispatch({ type: USER_CHANGE_NAME_SUCCESS, payload: data });
      dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: USER_CHANGE_NAME_FAIL, payload: err });
    }
  };
};

export const resetChangeNameUser = () => {
  return { type: USER_CHANGE_NAME_RESET };
};

export const changePasswordUser = (currentPassword, newPassword) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: USER_CHANGE_PASSWORD_REQUEST });
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
        `/api/users/password`,
        { currentPassword, newPassword },
        config
      );
      dispatch({ type: USER_CHANGE_PASSWORD_SUCCESS, payload: data });
      dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: USER_CHANGE_PASSWORD_FAIL, payload: err });
    }
  };
};

export const resetChangePasswordUser = () => {
  return { type: USER_CHANGE_PASSWORD_RESET };
};

export const changeAvatarUser = (avatarFile) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: USER_CHANGE_AVATAR_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${userInfo.token} `,
        },
      };

      const configUpload = {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${userInfo.token} `,
        },
      };

      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const { data: avatarSrc } = await axios.post(
        "/api/upload/avatars",
        formData,
        configUpload
      );

      const { data } = await axios.put(
        `/api/users/avatar`,
        { avatar: avatarSrc },
        config
      );

      dispatch({ type: USER_CHANGE_AVATAR_SUCCESS, payload: data });
      dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: USER_CHANGE_AVATAR_FAIL, payload: err });
    }
  };
};

export const resetChangeAvatarUser = () => {
  return { type: USER_CHANGE_AVATAR_RESET };
};

export const changeAccountState = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: USER_CHANGE_ACCOUNT_STATE_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${userInfo.token} `,
        },
      };

      const { data } = await axios.put(`/api/users/state`, {}, config);

      dispatch({ type: USER_CHANGE_ACCOUNT_STATE_SUCCESS, payload: data });
      dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: USER_CHANGE_ACCOUNT_STATE_FAIL, payload: err });
    }
  };
};

export const resetChangeAccountState = () => {
  return { type: USER_CHANGE_ACCOUNT_STATE_RESET };
};

export const getFollowers = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: USER_GET_FOLLOWERS_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${userInfo.token} `,
        },
      };

      const { data } = await axios.get(
        `/api/users/followers/${userInfo._id}`,
        config
      );

      dispatch({ type: USER_GET_FOLLOWERS_SUCCESS, payload: data });
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: USER_GET_FOLLOWERS_FAIL, payload: err });
    }
  };
};

export const resetGetFollowers = () => {
  return { type: USER_GET_FOLLOWERS_RESET };
};
