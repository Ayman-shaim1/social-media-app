import {
  POST_LIST_FAIL,
  POST_LIST_REQUEST,
  POST_LIST_SUCCESS,
  POST_CREATE_FAIL,
  POST_CREATE_REQUEST,
  POST_CREATE_SUCCESS,
  POST_CREATE_RESET,
  POST_LIST_UPDATE_ADD_POST,
  POST_GET_LIST_UPDATE_COMMENT,
  POST_GET_LIST_UPDATE_DELETE_COMMENT,
  POST_LIST_UPDATE_DELETE_POST,
  POST_LIST_UPDATE_LIKE,
  POST_LIST_UPDATE_UNLIKE,
  POST_ADD_COMMENT_FAIL,
  POST_ADD_COMMENT_REQUEST,
  POST_ADD_COMMENT_RESET,
  POST_ADD_COMMENT_SUCCESS,
  POST_DELETE_COMMENT_FAIL,
  POST_DELETE_COMMENT_REQUEST,
  POST_DELETE_COMMENT_RESET,
  POST_DELETE_COMMENT_SUCCESS,
  POST_DELETE_FAIL,
  POST_DELETE_REQUEST,
  POST_DELETE_RESET,
  POST_DELETE_SUCCESS,
  POST_GET_BY_ID_FAIL,
  POST_GET_BY_ID_REQUEST,
  POST_GET_BY_ID_RESET,
  POST_GET_BY_ID_SUCCESS,
  POST_GET_BY_ID_UPDATE_COMMENT,
  POST_GET_BY_ID_UPDATE_DELETE_COMMENT,
  POST_LIKE_FAIL,
  POST_LIKE_REQUEST,
  POST_LIKE_RESET,
  POST_LIKE_SUCCESS,
  POST_UNLIKE_FAIL,
  POST_UNLIKE_REQUEST,
  POST_UNLIKE_RESET,
  POST_UNLIKE_SUCCESS,
} from "./postTypes";

import { sendNotification } from "../notification/notificationActions";

import axios from "axios";



export const getPosts = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: POST_LIST_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get("/api/posts", config);
      dispatch({ type: POST_LIST_SUCCESS, payload: data });
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;

      dispatch({ type: POST_LIST_FAIL, payload: err });
    }
  };
};

export const createPost = (text, media) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: POST_CREATE_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${userInfo.token}`,
        },
      };

      if (media === null) {
        const { data } = await axios.post("/api/posts", { text }, config);
        dispatch({ type: POST_CREATE_SUCCESS, payload: data });
        dispatch({ type: POST_LIST_UPDATE_ADD_POST, payload: data });
      } else {
        const uploadConfig = {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${userInfo.token}`,
          },
        };

        const formData = new FormData();
        formData.append("media", media);

        const { data: uploadData } = await axios.post(
          "/api/upload/posts",
          formData,
          uploadConfig
        );

        if (uploadData === "") {
          dispatch({
            type: POST_CREATE_FAIL,
            payload: "you have to add you media",
          });
        } else {
          const { data } = await axios.post(
            "/api/posts",
            { text: text, media_url: uploadData },
            config
          );
          dispatch({ type: POST_CREATE_SUCCESS, payload: data });
          dispatch({ type: POST_LIST_UPDATE_ADD_POST, payload: data });
        }
      }
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;

      dispatch({ type: POST_CREATE_FAIL, payload: err });
    }
  };
};
export const resetCreatePost = () => {
  return (dispatch) => dispatch({ type: POST_CREATE_RESET });
};
export const getByIdPost = (id) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: POST_GET_BY_ID_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          authorization: `Bearer ${userInfo.token} `,
        },
      };

      const { data } = await axios.get(`/api/posts/${id}`, config);
      dispatch({ type: POST_GET_BY_ID_SUCCESS, payload: data });
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: POST_GET_BY_ID_FAIL, payload: err });
    }
  };
};

export const resetGetByIdPost = () => {
  return { type: POST_GET_BY_ID_RESET };
};

export const removePost = (id) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: POST_DELETE_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          authorization: `Bearer ${userInfo.token} `,
        },
      };

      const { data } = await axios.delete(`/api/posts/${id}`, config);
      dispatch({ type: POST_DELETE_SUCCESS, payload: data });
      dispatch({ type: POST_LIST_UPDATE_DELETE_POST, payload: id });
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: POST_DELETE_FAIL, payload: err });
    }
  };
};

export const resetRemovePost = () => {
  return { type: POST_DELETE_RESET };
};

export const likePost = (id) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: POST_LIKE_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          authorization: `Bearer ${userInfo.token} `,
        },
      };

      const { data } = await axios.put(`/api/posts/like/${id}`, {}, config);
      dispatch({ type: POST_LIKE_SUCCESS, payload: data });
      dispatch({
        type: POST_LIST_UPDATE_LIKE,
        payload: { id: id, likes: data.likes },
      });

      if (String(data._id) !== String(userInfo._id)) {
        dispatch(
          sendNotification(
            data._id,
            `${userInfo.name} liked your post`,
            `<a href="/profile/${userInfo._id}">${userInfo.name}</a> liked your <a href="/post/${id}">Post</a>`
          )
        );
       
      }
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: POST_LIKE_FAIL, payload: err });
    }
  };
};

export const resetLikePost = () => {
  return { type: POST_LIKE_RESET };
};

export const unLikePost = (id) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: POST_UNLIKE_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          authorization: `Bearer ${userInfo.token} `,
        },
      };

      const { data } = await axios.put(`/api/posts/unlike/${id}`, {}, config);
      dispatch({ type: POST_UNLIKE_SUCCESS, payload: data });
      dispatch({
        type: POST_LIST_UPDATE_UNLIKE,
        payload: { id: id, likes: data },
      });
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: POST_UNLIKE_FAIL, payload: err });
    }
  };
};

export const resetUnlikePost = () => {
  return { type: POST_UNLIKE_RESET };
};

export const commentPost = (id, text) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: POST_ADD_COMMENT_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${userInfo.token} `,
        },
      };

      const { data } = await axios.post(
        `/api/posts/comment/${id}`,
        { text },
        config
      );
      dispatch({ type: POST_ADD_COMMENT_SUCCESS, payload: data });
      dispatch({ type: POST_GET_BY_ID_UPDATE_COMMENT, payload: data.comments });
      dispatch({
        type: POST_GET_LIST_UPDATE_COMMENT,
        payload: { id: id, comments: data.comments },
      });
      if (String(data._id) !== String(userInfo._id)) {
        dispatch(
          sendNotification(
            data._id,
            `${userInfo.name} commented on your post`,
            `<a href="/profile/${userInfo._id}">${userInfo.name}</a> commented on your <a href="/post/${id}">Post</a>`
          )
        );
      }
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: POST_ADD_COMMENT_FAIL, payload: err });
    }
  };
};

export const resetCommentPost = () => {
  return { type: POST_ADD_COMMENT_RESET };
};

export const deleteCommentFromPost = (idPost, idComment) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: POST_DELETE_COMMENT_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${userInfo.token} `,
        },
      };

      const { data } = await axios.delete(
        `/api/posts/comment/${idPost}/${idComment}`,
        config
      );
      dispatch({ type: POST_DELETE_COMMENT_SUCCESS, payload: data });
      dispatch({
        type: POST_GET_BY_ID_UPDATE_DELETE_COMMENT,
        payload: data,
      });
      dispatch({
        type: POST_GET_LIST_UPDATE_DELETE_COMMENT,
        payload: { id: idPost, comments: data },
      });
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: POST_DELETE_COMMENT_FAIL, payload: err });
    }
  };
};

export const resetDeleteCommentFromPost = () => {
  return { type: POST_DELETE_COMMENT_RESET };
};
