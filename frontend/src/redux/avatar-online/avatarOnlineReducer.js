import { AVATAR_ONLINE_PUSH } from "./avatarOnlineTypes";

const avatarOnlineReducer = (state = { avatars: [] }, action) => {
  const { payload, type } = action;
  switch (type) {
    case AVATAR_ONLINE_PUSH:
      return {
        avatars: [payload, ...state.avatars],
      };
    default:
      return state;
  }
};

export default avatarOnlineReducer;
