import React from "react";

const MessageItem = ({message}) => {
  return (
    <div className={`message-container connected-user-message`}>
      <div className={`message`}>
        <div className="message-content">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate
            doloribus voluptas, corrupti accusamus voluptate earum reiciendis
            adipisci eius labore ullam nihil, provident quos nisi? Dolor
            recusandae dolore harum autem dolores.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
