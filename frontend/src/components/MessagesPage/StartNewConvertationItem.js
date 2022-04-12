import React from "react";
import { ListGroup } from "react-bootstrap";
import { openConvertation } from "../../redux/convertation/convertationActions";
import {
  resetGetMessages,
  getMessages,
} from "../../redux/message/messageActions";
import Avatar from "../Avatar";
import { connect } from "react-redux";

const StartNewConvertationItem = ({
  user,
  openConvertation,
  getMessages,
  messageList,
}) => {
  // redux states:
  const { loading: messageListLoading } = messageList;

  const openConvHandler = () => {
    if (!messageListLoading) {
      resetGetMessages();
      getMessages(user.user._id);
      openConvertation({
        _id: user.user._id,
        name: user.user.name,
        avatar: user.user.avatar,
      });
    }
  };

  return (
    <ListGroup.Item
      className="start-new-conv-user-item"
      onClick={openConvHandler}>
      <div className="d-flex align-items-center">
        <Avatar image={user.user.avatar} userId={user.user._id} />
        <div className="d-flex flex-column">
          <h6 className="m-0">{user.user.name}</h6>
          <small>{user.user.email}</small>
        </div>
      </div>
    </ListGroup.Item>
  );
};

const mapStateToProps = (state) => {
  return { messageList: state.messageList };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openConvertation: (data) => dispatch(openConvertation(data)),
    getMessages: (id) => dispatch(getMessages(id)),
    resetGetMessages: () => dispatch(getMessages()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StartNewConvertationItem);
