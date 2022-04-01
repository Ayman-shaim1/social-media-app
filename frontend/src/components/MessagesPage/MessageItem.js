import React from "react";

const MessageItem = ({ message }) => {
  return (
    <div className={`message-container other-user-message`}>
      <div className={`message`}>
        <button className="message-btn-remove">
          <i className="fas fa-times"></i>
        </button>
        <div className="message-content">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate
            doloribus voluptas, corrupti accusamus voluptate earum reiciendis
            adipisci eius labore ullam nihil, provident quos nisi? Dolor
            recusandae dolore harum autem dolores.
          </p>
        </div>
        <div className="message-inf">
          <small>{new Date().toDateString()}</small>
          <small>seen</small>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
