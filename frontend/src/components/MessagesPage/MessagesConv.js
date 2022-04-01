import React, { useState, useEffect } from "react";
import { InputGroup } from "react-bootstrap";
import { Card, Dropdown, Form, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import MessageItem from "./MessageItem";
import Avatar from "../Avatar";
import { connect } from "react-redux";
import Loader from "../Loader";
import {
  getMessages,
  resetGetMessages,
} from "../../redux/message/messageActions";
import useAlert from "../../hooks/useAlert";

const MessagesConv = ({ getMessages, convertation, messageList }) => {
  // hooks :
  const showAlert = useAlert();

  // states :
  const [isCallApi, setIsCallApi] = useState(false);

  // redux states :
  const { loading, error, messages } = messageList;
  const { user } = convertation;

  useEffect(() => {
    getMessages(user._id);
  }, []);

  return (
    <Card className="conv">
      <Card.Header className="conv-header">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <Avatar image={convertation.user.avatar} size="md" />
            <div className="d-flex flex-column">
              <h6 className="m-0">{convertation.user.name}</h6>
              {/* <small>online</small> */}
            </div>
          </div>
          <Dropdown>
            <Dropdown.Toggle
              size="sm"
              id="drp-conv-header-btn"></Dropdown.Toggle>
            <Dropdown.Menu>
              <LinkContainer to={`/profile/${convertation.user._id}`}>
                <Dropdown.Item>
                  <i className="fa-solid fa-user"></i> show profile
                </Dropdown.Item>
              </LinkContainer>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Card.Header>
      <Card.Body className="conv-body">
        {loading ? (
          <Loader />
        ) : (
          messages.length > 0 &&
          messages.map((message) => (
            <MessageItem key={message._id} message={message} />
          ))
        )}
      </Card.Body>
      <Card.Footer className="conv-footer">
        <Form>
          <InputGroup>
            <Form.Control size="sm" placeholder="enter message ..." />
            <Button size="sm">
              <i className="fa-solid fa-paper-plane"></i>
            </Button>
          </InputGroup>
        </Form>
      </Card.Footer>
    </Card>
  );
};

const mapStateToProps = (state) => {
  const { convertation, messageList } = state;
  return {
    convertation,
    messageList,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getMessages: (id) => dispatch(getMessages(id)),
    resetGetMessages: () => dispatch(resetGetMessages()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(MessagesConv);
