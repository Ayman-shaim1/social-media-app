import React, { useEffect } from "react";
import { connect } from "react-redux";
import {
  deleteMessage,
  resetDeleteMessage,
} from "../../redux/message/messageActions";
import useAlert from "../../hooks/useAlert";

const MessageItem = ({
  message,
  userLogin,
  messageDelete,

  deleteMessage,
  resetDeleteMessage,
}) => {
  // hooks :
  const showAlert = useAlert();

  // redux states :
  const { userInfo } = userLogin;
  const { loading, error, success } = messageDelete;

  useEffect(() => {
    if (error) {
      showAlert({
        type: "danger",
        title: "error",
        content: error,
      });
      resetDeleteMessage();
    }
    if (success) {
      resetDeleteMessage();
    }
  }, [error, success, showAlert, resetDeleteMessage]);

  return (
    <div
      className={`message-container ${
        String(userInfo._id) === String(message.message_from)
          ? "connected"
          : "other"
      }-user-message ${loading ? " message-loading" : ""}`}>
      <div className={`message`}>
        <button
          className="message-btn-remove"
          disabled={loading}
          onClick={() => deleteMessage(message._id)}>
          <i className="fas fa-times"></i>
        </button>
        <div className="message-content">
          <p>{message.message_text}</p>
        </div>
        <div className="message-inf">
          <small>{new Date(message.message_date).toDateString()}</small>
          {String(userInfo._id) === String(message.message_from) &&
            message.isSeen && <small>seen</small>}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userLogin: state.userLogin,
    messageDelete: state.messageDelete,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteMessage: (id) => dispatch(deleteMessage(id)),
    resetDeleteMessage: () => dispatch(resetDeleteMessage()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageItem);
