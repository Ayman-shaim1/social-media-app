import React, { useState, useEffect } from "react";
import { ListGroup, Button } from "react-bootstrap";
import Avatar from "./Avatar";
import { sendMessage } from "../redux/message/messageActions";
import { connect } from "react-redux";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
const SharePostUserItem = ({ user, sendMessage, sharePost, messageSend }) => {
  // states :
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  // redux states :
  const { postId } = sharePost;
  const {
    success: messageSendSuccess,
    message,
    loading: messageSendLoading,
  } = messageSend;
  const sendMessageHandler = () => {
    sendMessage(user.user._id, postId, true, false);
    setLoading(true);
  };

  useEffect(() => {
    if (messageSendSuccess) {
      setLoading(false);
      if (String(message.message_to) === String(user.user._id)) {
        setSuccess(true);
      }
    }
  }, [messageSendSuccess, message, user]);

  return (
    <ListGroup.Item>
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <Link to={`/profile/${user.user._id}`}>
            <Avatar image={user.user.avatar} />
          </Link>
          <div className="d-flex flex-column m-2">
            <h6 className="m-0">{user.user.name}</h6>
            <strong>{user.user.email}</strong>
          </div>
        </div>
        {success ? (
          <Button size="sm" variant="success">
            <i className="fas fa-check"></i>
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={sendMessageHandler}
            disabled={messageSendLoading}>
            {loading ? (
              <Loader size="sm" />
            ) : (
              <i className="fa-solid fa-share-from-square"></i>
            )}
          </Button>
        )}
      </div>
    </ListGroup.Item>
  );
};

const mapStateToProps = (state) => {
  return {
    sharePost: state.sharePost,
    messageSend: state.messageSend,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendMessage: (id, message, isMessagePost, pushMessage) =>
      dispatch(sendMessage(id, message, isMessagePost, pushMessage)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SharePostUserItem);
