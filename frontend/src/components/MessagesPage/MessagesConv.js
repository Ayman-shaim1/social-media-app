import React, { useEffect, useRef, useState } from "react";
import { InputGroup } from "react-bootstrap";
import { Card, Dropdown, Form, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import MessageItem from "./MessageItem";
import MessagePostItem from "./MessagePostItem";

import Avatar from "../Avatar";
import { connect, useDispatch } from "react-redux";
import Loader from "../Loader";

import {
  sendMessage,
  removeConvertation,
  seenAllMessages,
  resetSendMessage,
  resetRemoveConvertation,
  resetGetMessages,
} from "../../redux/message/messageActions";

import {
  MESSAGE_GET_CONVERTATIONS_UPDATE_SEEN_ALL,
  MESSAGE_GET_LIST_UPDATE_SEEN_ALL,
} from "../../redux/message/messageTypes";

import { Link } from "react-router-dom";

import { closeConvertation } from "../../redux/convertation/convertationActions";

import useDialog from "../../hooks/useDialog";
import useAlert from "../../hooks/useAlert";

const MessagesConv = ({
  convertation,
  messageList,
  messageRemoveConvertation,
  showConv,

  sendMessage,
  removeConvertation,
  closeConvertation,
  seenAllMessages,

  resetSendMessage,
  resetRemoveConvertation,
  resetGetMessages,
}) => {
  const dispatch = useDispatch();
  // hooks :
  const showDialog = useDialog();
  const showAlert = useAlert();

  // states :
  const [text, setText] = useState("");
  const [isSeenAll, setIsSeenAll] = useState(false);

  // redux states :
  const { messages, loading: messageListLoading } = messageList;
  const { user } = convertation;
  const {
    loading: messageRemoveConvertationLoading,
    error: messageRemoveConvertationError,
    success: messageRemoveConvertationSuccess,
  } = messageRemoveConvertation;

  // Ref's :
  const convBodyRef = useRef();

  const submitHandler = (e) => {
    e.preventDefault();
    if (text !== "") {
      sendMessage(user._id, text);
      setText("");
      resetSendMessage();
      showConv();
    }
  };

  const removeConvHandler = (e) => {
    e.preventDefault();
    showDialog({
      title: "confirmation",
      content: "Are you sure you want to delete this convertation ?",
      onYes: () => {
        removeConvertation(convertation.user._id);
      },
    });
  };

  useEffect(() => {
    convBodyRef.current.scrollTo(0, convBodyRef.current.scrollHeight * 100000);
    if (messageRemoveConvertationError) {
      showAlert({
        type: "danger",
        title: "error",
        content: messageRemoveConvertationError,
      });
    }

    if (messageRemoveConvertationSuccess) {
      resetRemoveConvertation();
      closeConvertation();
    }
    if (messages.length > 0) {
      if (!isSeenAll) {
        setIsSeenAll(true);
        seenAllMessages(user._id);
        dispatch({
          type: MESSAGE_GET_LIST_UPDATE_SEEN_ALL,
        });

        dispatch({
          type: MESSAGE_GET_CONVERTATIONS_UPDATE_SEEN_ALL,
          payload: user._id,
        });
      }
    }
  }, [
    dispatch,
    isSeenAll,
    resetRemoveConvertation,
    user._id,
    seenAllMessages,
    closeConvertation,
    showAlert,
    messageRemoveConvertationSuccess,
    messageRemoveConvertationError,
    messages,
  ]);

  return (
    <Card className="conv">
      <Card.Header className="conv-header">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <Link to={`/profile/${user._id}`}>
              <Avatar image={user.avatar} size="md" />
            </Link>
            <div className="d-flex flex-column">
              <h6 className="m-0">{user.name}</h6>
              {/* <small>online</small> */}
            </div>
          </div>
          <Dropdown>
            <Dropdown.Toggle
              size="sm"
              id="drp-conv-header-btn"></Dropdown.Toggle>
            <Dropdown.Menu>
              <LinkContainer to={`/profile/${user._id}`}>
                <Dropdown.Item>
                  <i className="fa-solid fa-user "></i> show profile
                </Dropdown.Item>
              </LinkContainer>
              <Dropdown.Item onClick={removeConvHandler}>
                <i className="fa-solid fa-trash"></i> delete convertation
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Card.Header>
      <Card.Body className="conv-body" ref={convBodyRef}>
        {messageListLoading || messageRemoveConvertationLoading ? (
          <div className="mt-5 pt-2">
            <div className="mt-5 pt-3">
              <div className="mt-5">
                <Loader size="md" />
              </div>
            </div>
          </div>
        ) : (
          messages &&
          messages.length > 0 &&
          messages.map((message) =>
            message.message_text !== null ? (
              <MessageItem key={message._id} message={message} />
            ) : (
              <MessagePostItem key={message._id} message={message} />
            )
          )
        )}
      </Card.Body>
      <Card.Footer className="conv-footer">
        <Form onSubmit={submitHandler}>
          <InputGroup>
            <Form.Control
              size="sm"
              disabled={messageListLoading || messageRemoveConvertationLoading}
              placeholder="enter message ..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button
              size="sm"
              type="submit"
              disabled={messageListLoading || messageRemoveConvertationLoading}>
              <i className="fa-solid fa-paper-plane"></i>
            </Button>
          </InputGroup>
        </Form>
      </Card.Footer>
    </Card>
  );
};

const mapStateToProps = (state) => {
  return {
    messageList: state.messageList,
    convertation: state.convertation,
    messageRemoveConvertation: state.messageRemoveConvertation,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendMessage: (id, text_content) => dispatch(sendMessage(id, text_content)),
    seenAllMessages: (id) => dispatch(seenAllMessages(id)),
    removeConvertation: (id) => dispatch(removeConvertation(id)),
    closeConvertation: () => dispatch(closeConvertation()),

    resetRemoveConvertation: () => dispatch(resetRemoveConvertation()),
    resetSendMessage: () => dispatch(resetSendMessage()),
    resetGetMessages: () => dispatch(resetGetMessages()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MessagesConv);
