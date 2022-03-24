import {
  POST_LIST_FAIL,
  POST_LIST_REQUEST,
  POST_LIST_RESET,
  POST_LIST_SUCCESS,
  POST_LIST_UPDATE_ADD_POST,
  POST_GET_LIST_UPDATE_COMMENT,
  POST_GET_LIST_UPDATE_DELETE_COMMENT,
  POST_LIST_UPDATE_DELETE_POST,
  POST_LIST_UPDATE_LIKE,
  POST_LIST_UPDATE_UNLIKE,
  POST_CREATE_FAIL,
  POST_CREATE_REQUEST,
  POST_CREATE_RESET,
  POST_CREATE_SUCCESS,
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

export const postListReducer = (state = { posts: [] }, action) => {
  const { type, payload } = action;
  switch (type) {
    case POST_LIST_REQUEST:
      return { loading: true, posts: [] };
    case POST_LIST_SUCCESS:
      return { loading: false, posts: payload, success: true };
    case POST_LIST_FAIL:
      return { loading: false, error: payload, posts: [] };
    case POST_LIST_RESET:
      return { posts: [] };
    case POST_LIST_UPDATE_ADD_POST:
      return { posts: [payload, ...state.posts] };
    case POST_LIST_UPDATE_LIKE:
      return {
        posts: state.posts.map((post) => {
          if (post._id === payload.id) {
            post.likes = payload.likes;
            return post;
          } else {
            return post;
          }
        }),
        success: true,
      };
    case POST_LIST_UPDATE_UNLIKE:
      return {
        success: true,
        posts: state.posts.map((post) => {
          if (post._id === payload.id) {
            post.likes = payload.likes;
            return post;
          } else {
            return post;
          }
        }),
      };
    case POST_LIST_UPDATE_DELETE_POST:
      return {
        success: true,
        posts: state.posts.filter(
          (post) => String(post._id) !== String(payload)
        ),
      };
    case POST_GET_LIST_UPDATE_COMMENT:
      return {
        success: true,
        posts: state.posts.map((post) => {
          if (String(post._id) === String(payload.id)) {
            post.comments = payload.comments;
            return post;
          } else {
            return post;
          }
        }),
      };
    case POST_GET_LIST_UPDATE_DELETE_COMMENT:
      return {
        success: true,
        posts: state.posts.map((post) => {
          if (String(post._id) === String(payload.id)) {
            post.comments = payload.comments;
            return post;
          } else {
            return post;
          }
        }),
      };

    default:
      return state;
  }
};

export const postCreateReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case POST_CREATE_REQUEST:
      return { loading: true };
    case POST_CREATE_SUCCESS:
      return { loading: false, post: payload,success:true };
    case POST_CREATE_FAIL:
      return { loading: false, error: payload };
    case POST_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const postByIdReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case POST_GET_BY_ID_REQUEST:
      return { loading: true };
    case POST_GET_BY_ID_SUCCESS:
      return { success: true, post: payload };
    case POST_GET_BY_ID_UPDATE_COMMENT:
      return { success: true, post: { ...state.post, comments: payload } };
    case POST_GET_BY_ID_UPDATE_DELETE_COMMENT:
      return { success: true, post: { ...state.post, comments: payload } };

    case POST_GET_BY_ID_FAIL:
      return { error: payload };
    case POST_GET_BY_ID_RESET:
      return {};
    default:
      return state;
  }
};

export const postDeleteReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case POST_DELETE_REQUEST:
      return { loading: true };
    case POST_DELETE_SUCCESS:
      return { success: true, message: payload };
    case POST_DELETE_FAIL:
      return { error: payload };
    case POST_DELETE_RESET:
      return {};
    default:
      return state;
  }
};

export const postLikeReducer = (state = { likes: [] }, action) => {
  const { type, payload } = action;
  switch (type) {
    case POST_LIKE_REQUEST:
      return { loading: true, likes: [] };
    case POST_LIKE_SUCCESS:
      return { success: true, likes: payload };
    case POST_LIKE_FAIL:
      return { error: payload, likes: [] };
    case POST_LIKE_RESET:
      return { likes: [] };
    default:
      return state;
  }
};

export const postUnlikeReducer = (state = { likes: [] }, action) => {
  const { type, payload } = action;
  switch (type) {
    case POST_UNLIKE_REQUEST:
      return { loading: true, likes: [] };
    case POST_UNLIKE_SUCCESS:
      return { success: true, likes: payload };
    case POST_UNLIKE_FAIL:
      return { error: payload, likes: [] };
    case POST_UNLIKE_RESET:
      return { likes: [] };
    default:
      return state;
  }
};

export const postAddCommentReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case POST_ADD_COMMENT_REQUEST:
      return { loading: true };
    case POST_ADD_COMMENT_SUCCESS:
      return { success: true, post: payload };
    case POST_ADD_COMMENT_FAIL:
      return { error: payload };
    case POST_ADD_COMMENT_RESET:
      return {};
    default:
      return state;
  }
};

export const postDeleteCommentReducer = (state = { comment: [] }, action) => {
  const { type, payload } = action;
  switch (type) {
    case POST_DELETE_COMMENT_REQUEST:
      return { loading: true, comment: [] };
    case POST_DELETE_COMMENT_SUCCESS:
      return { success: true, comment: payload };
    case POST_DELETE_COMMENT_FAIL:
      return { comment: [], error: payload };
    case POST_DELETE_COMMENT_RESET:
      return { comment: [] };
    default:
      return state;
  }
};
