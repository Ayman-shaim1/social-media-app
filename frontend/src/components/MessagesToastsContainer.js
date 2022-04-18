import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-bootstrap";
import MessageToast from "./MessageToast";
import { getNotSeenMessages } from "../redux/message/messageActions";
import { connect } from "react-redux";
import useAlert from "../hooks/useAlert";

const MessagesToastsContainer = ({
  messageGetNotSeenList,
  getNotSeenMessages,
}) => {
  // hooks :
  const showAlert = useAlert();
  // states :
  const [isCallApi, setIsCallApi] = useState(false);
  // redux states :
  const { error, messages } = messageGetNotSeenList;

  useEffect(() => {
    if (!isCallApi) {
      setIsCallApi(true);
      getNotSeenMessages();
    }
    if (error) {
      showAlert({
        type: "danger",
        title: "error",
        content: error,
      });
    }
  }, [error, isCallApi, getNotSeenMessages, showAlert]);

  return (
    <ToastContainer className="messages-toast-container">
      {messages.length > 0 &&
        messages.map((message) => (
          <MessageToast message={message} key={message._id} />
        ))}
    </ToastContainer>
  );
};

const mapStateToProps = (state) => {
  return {
    messageGetNotSeenList: state.messageGetNotSeenList,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getNotSeenMessages: () => dispatch(getNotSeenMessages()),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessagesToastsContainer);
