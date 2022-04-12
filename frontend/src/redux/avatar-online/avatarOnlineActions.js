import { AVATAR_ONLINE_PUSH } from "./avatarOnlineTypes";

export const pushAvatar = (avatar) => {
  return { type: AVATAR_ONLINE_PUSH, payload: avatar };
};
