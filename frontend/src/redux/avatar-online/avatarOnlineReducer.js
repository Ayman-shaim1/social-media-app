import {
  AVATAR_ONLINE_PUSH,
  AVATAR_ONLINE_LOGIN_UPDATE,
  AVATAR_ONLINE_LOGOUT_UPDATE,
} from "./avatarOnlineTypes";

const avatarOnlineReducer = (state = { avatars: [] }, action) => {
  const { payload, type } = action;
  switch (type) {
    case AVATAR_ONLINE_PUSH:
      return {
        avatars: [payload, ...state.avatars],
      };
    case AVATAR_ONLINE_LOGIN_UPDATE:
      return {
        avatars: state.avatars.map((avatar) => {
          if (String(avatar.userId) === String(payload)) {
            avatar.isOnline = true;
          }
          return avatar;
        }),
      };
    case AVATAR_ONLINE_LOGOUT_UPDATE:
      return {
        avatars: state.avatars.map((avatar) => {
          if (String(avatar.userId) === String(payload)) {
            avatar.isOnline = false;
          }
          return avatar;
        }),
      };
    default:
      return state;
  }
};

export default avatarOnlineReducer;
