import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import ConvertationsContainer from "../components/MessagesPage/ConvertationsContainer";
import MessagesConv from "../components/MessagesPage/MessagesConv";
import StartChattingAlert from "../components/MessagesPage/StartChattingAlert";
import { connect, useDispatch } from "react-redux";

import StartNewConvertationContainer from "../components/MessagesPage/StartNewConvertationContainer";
import { closeConvertation } from "../redux/convertation/convertationActions";
import { resetGetMessages } from "../redux/message/messageActions";

import {
  MESSAGE_GET_CONVERTATIONS_UPDATE_USER_TYPING,
  MESSAGE_GET_CONVERTATIONS_UPDATE_USER_STOP_TYPING,
} from "../redux/message/messageTypes";

import socket from "../socket";

const MessagesPage = ({
  convertation,
  resetGetMessages,
  closeConvertation,
  userLogin,
}) => {
  // hooks :
  const dispatch = useDispatch();
  // states :
  const [showConv, setShowConv] = useState(true);
  const [isFirstCall, setIsFirstCall] = useState(false);
  // redux states:
  const { isOpen } = convertation;
  const { userInfo } = userLogin;

  const showConvHandler = () => {
    setShowConv(!showConv);
  };

  useEffect(() => {
    if (!isFirstCall) {
      resetGetMessages();
      closeConvertation();
      setIsFirstCall(true);
    }

    socket.removeListener("client-user-typing");
    socket.removeListener("client-user-stop-typing");

    socket.on("client-user-typing", (obj) => {
      const { senderUserId, receivedUserId } = obj;
      if (String(userInfo._id) === String(receivedUserId)) {
        dispatch({
          type: MESSAGE_GET_CONVERTATIONS_UPDATE_USER_TYPING,
          payload: senderUserId,
        });
      }
    });

    socket.on("client-user-stop-typing", (obj) => {
      const { senderUserId, receivedUserId } = obj;
      if (String(userInfo._id) === String(receivedUserId)) {
        dispatch({
          type: MESSAGE_GET_CONVERTATIONS_UPDATE_USER_STOP_TYPING,
          payload: senderUserId,
        });
      }
    });


  }, [userInfo, isFirstCall, resetGetMessages, closeConvertation,dispatch]);

  return (
    <Row>
      <Col xl={4} lg={4} md={12} sm={12}>
        <Card className="convertations-container">
          <Card.Header>
            <div className="d-flex justify-content-start">
              {showConv ? (
                <OverlayTrigger
                  placement="right"
                  overlay={<Tooltip>start new convertations</Tooltip>}>
                  <Button
                    size="sm"
                    className="btn-new-convertation"
                    onClick={showConvHandler}>
                    <i className="fas fa-message"></i>
                  </Button>
                </OverlayTrigger>
              ) : (
                <OverlayTrigger
                  placement="right"
                  overlay={<Tooltip>show convertations</Tooltip>}>
                  <Button
                    size="sm"
                    className="btn-new-convertation"
                    onClick={showConvHandler}>
                    <i className="fas fa-arrow-left"></i>
                  </Button>
                </OverlayTrigger>
              )}
            </div>
          </Card.Header>
          <Card.Body>
            <ConvertationsContainer show={showConv} />
            <StartNewConvertationContainer show={showConv} />
          </Card.Body>
        </Card>
      </Col>
      <Col xl={8} lg={8} md={12} sm={12}>
        {isOpen ? (
          <MessagesConv showConv={() => setShowConv(true)} />
        ) : (
          <StartChattingAlert />
        )}
      </Col>
    </Row>
  );
};

const mapStateToProps = (state) => {
  return {
    convertation: state.convertation,
    userLogin: state.userLogin,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeConvertation: () => dispatch(closeConvertation()),
    resetGetMessages: () => dispatch(resetGetMessages()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MessagesPage);
