import React from "react";

const Avatar = ({ size, image }) => {
  return (
    <div className={`avatar-container avatar-${size}`}>
      <img src={image} alt="user-avatar" className="avatar" />
    </div>
  );
};

export default Avatar;
