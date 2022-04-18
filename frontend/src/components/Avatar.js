import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { pushAvatar } from "../redux/avatar-online/avatarOnlineActions";
import { v4 as uuidv4 } from "uuid";
const Avatar = ({
  size,
  image,
  userId,
  showOnline,
  isOnline,
  pushAvatar,
  userLogin,
  avatarOnline,
}) => {
  // states :
  const [isPushAvatar, setIsPushAvatar] = useState(false);
  const [avatarObjData] = useState({
    avatarId: uuidv4(),
    userId: userId,
    isOnline: isOnline,
  });
  // redux states :
  const { userInfo } = userLogin;
  const { avatars } = avatarOnline;

  useEffect(() => {
    if (!isPushAvatar) {
      setIsPushAvatar(true);
      pushAvatar(avatarObjData);
    }
  }, [isPushAvatar, pushAvatar, isOnline, userId, avatarObjData]);

  return (
    <div
      className={`avatar-container avatar-${size} ${avatarObjData.avatarId}`}>
      <img src={image} alt="user-avatar" className="avatar" />
      {showOnline && (
        <>
          {avatars.find(
            (a) => String(a.avatarId) === String(avatarObjData.avatarId)
          ) &&
            avatars.find(
              (a) => String(a.avatarId) === String(avatarObjData.avatarId)
            ).isOnline &&
            String(userInfo._id) !== String(userId) && (
              <span className="online"></span>
            )}
        </>
      )}
    </div>
  );
};

Avatar.defaultProps = {
  showOnline: true,
  size: "md",
};

const mapStateToProps = (state) => {
  return {
    userLogin: state.userLogin,
    avatarOnline: state.avatarOnline,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    pushAvatar: (avatar) => dispatch(pushAvatar(avatar)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Avatar);
