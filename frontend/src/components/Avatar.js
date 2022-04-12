import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { pushAvatar } from "../redux/avatar-online/avatarOnlineActions";
import { v4 as uuidv4 } from "uuid";
const Avatar = ({ size, image, userId, showOnline, pushAvatar }) => {
  
  const [isCallApi, setIsCallApi] = useState(false);
  const [isPushAvatar, setIsPushAvatar] = useState(false);

  useEffect(() => {
    if (showOnline) {
      if (!isCallApi) {
        setIsCallApi(true);
      }
    }

    if (!isPushAvatar) {
      pushAvatar({
        id: uuidv4(),
        userId: userId,
        isOnline: false,
      });
      setIsPushAvatar(true);
    }
  }, [isPushAvatar, isCallApi, showOnline, userId,pushAvatar]);

  return (
    <div className={`avatar-container avatar-${size}`}>
      <img src={image} alt="user-avatar" className="avatar" />
      {showOnline && (
        <>
          <span className="online"></span>
        </>
      )}
    </div>
  );
};
Avatar.defaultProps = {
  showOnline: true,
};

const mapDispatchToProps = (dispatch) => {
  return {
    pushAvatar: (avatar) => dispatch(pushAvatar(avatar)),
  };
};

export default connect(null, mapDispatchToProps)(Avatar);
