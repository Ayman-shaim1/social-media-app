import { SHARE_POST_CLOSE, SHARE_POST_OPEN } from "./sharePostTypes";

const sharePostReducer = (state = { isOpen: false }, action) => {
  const { type ,payload} = action;
  switch (type) {
    case SHARE_POST_OPEN:
      return { isOpen: true, postId: payload };
    case SHARE_POST_CLOSE:
      return { isOpen: false };
    default:
      return state;
  }
};

export default sharePostReducer;
