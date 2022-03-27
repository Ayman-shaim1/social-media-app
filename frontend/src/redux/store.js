import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import alertReducer from "./alert/alertReducer";
import dialogReducer from "./dialog/dialogReducer";

import {
  userLoginReducer,
  userRegisterReducer,
  userByIdReducer,
  userFindReducer,
  userFollowReducer,
  userRequestsReducer,
  userAcceptFollowReducer,
  userRemoveFollowReducer,
  userRejectFollowReducer,
  userUnFollowReducer,
  userChangeNameReducer,
  userChangeAvatarReducer,
  userChangePasswordReducer,
  userCheckFollowReducer,
} from "./user/userReducers";

import {
  postListReducer,
  postCreateReducer,
  postAddCommentReducer,
  postByIdReducer,
  postDeleteCommentReducer,
  postDeleteReducer,
  postLikeReducer,
  postUnlikeReducer,
} from "./post/postReducers";

import {
  notificationDeleteReducer,
  notificationListReducer,
  notificationSeenReducer,
  notificationSendReducer,
} from "./notification/notificationReducers";

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};

const reducer = combineReducers({
  alert: alertReducer,
  dialog: dialogReducer,

  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userById: userByIdReducer,
  userFind: userFindReducer,
  userFollow: userFollowReducer,
  userRequests: userRequestsReducer,
  userAcceptFollow: userAcceptFollowReducer,
  userRejectFollow: userRejectFollowReducer,
  userUnFollow: userUnFollowReducer,
  userChangeName: userChangeNameReducer,
  userRemoveFollow: userRemoveFollowReducer,
  userChangePassword: userChangePasswordReducer,
  userChangeAvatar: userChangeAvatarReducer,
  userCheckFollow: userCheckFollowReducer,
  
  postList: postListReducer,
  postCreate: postCreateReducer,
  postAddComment: postAddCommentReducer,
  postById: postByIdReducer,
  postDeleteComment: postDeleteCommentReducer,
  postDelete: postDeleteReducer,
  postLike: postLikeReducer,
  postUnlike: postUnlikeReducer,

  notificationDelete: notificationDeleteReducer,
  notificationList: notificationListReducer,
  notificationSeen: notificationSeenReducer,
  notificationSend: notificationSendReducer,
});

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(thunk))
);
export default store;
