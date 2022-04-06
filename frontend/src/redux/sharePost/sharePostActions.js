import { SHARE_POST_CLOSE, SHARE_POST_OPEN } from "./sharePostTypes";

export const openSharePost = (postId) => {
  return { type: SHARE_POST_OPEN, payload: postId };
};

export const closeSharePost = () => {
  return { type: SHARE_POST_CLOSE };
};
