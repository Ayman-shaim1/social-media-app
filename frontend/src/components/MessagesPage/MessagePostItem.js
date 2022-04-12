import React, { useEffect } from "react";
import { Card, Dropdown, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import Avatar from "../Avatar";
import { connect } from "react-redux";
import {
  deleteMessage,
  resetDeleteMessage,
} from "../../redux/message/messageActions";
import useAlert from "../../hooks/useAlert";
import Video from "../Video";

const MessagePostItem = ({
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
      className={`message-post message-container ${
        String(userInfo._id) === String(message.message_from)
          ? "connected"
          : "other"
      }-user-message ${loading ? " message-loading" : ""}`}>
      <div className={`message`}>
        <Card className="w-100 message-content">
          <Card.Header bg="light" className="d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <Link to={`/profile/${message.message_post.user._id}`}>
                <Avatar
                  image={message.message_post.user.avatar}
                  userId={message.message_post.user._id}
                />
              </Link>
              <Link to={`/profile/${message.message_post.user._id}`}>
                <strong className="m-2">
                  {message.message_post.user.name}
                </strong>
              </Link>
            </div>
            <Dropdown>
              <Dropdown.Toggle size="sm" id="drp-post-btn"></Dropdown.Toggle>

              <Dropdown.Menu>
                <LinkContainer to={`/post/${message.message_post._id}`}>
                  <Dropdown.Item>
                    <i className="fa-solid fa-newspaper"></i> show post
                  </Dropdown.Item>
                </LinkContainer>

                <Dropdown.Divider></Dropdown.Divider>
                <Dropdown.Item onClick={() => deleteMessage(message._id)}>
                  <i className="fa-solid fa-trash-can"></i> delete message
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Card.Header>
          <Card.Body>
            {message.message_post.text && <p>{message.message_post.text}</p>}
            {message.message_post.media_url &&
            String(message.message_post.media_url).includes(".mp4") ? (
              <Video src={message.message_post.media_url} />
            ) : (
              <Link to={`/post/${message.message_post._id}`}>
                <Image
                  src={message.message_post.media_url}
                  className="media-post"
                  rounded
                />
              </Link>
            )}
          </Card.Body>
        </Card>

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

export default connect(mapStateToProps, mapDispatchToProps)(MessagePostItem);
