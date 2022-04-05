import React, { useState } from "react";
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
import { connect } from "react-redux";

import StartNewConvertationContainer from "../components/MessagesPage/StartNewConvertationContainer";

const MessagesPage = ({ convertation }) => {
  // states :
  const [showConv, setShowConv] = useState(true);
  // redux states:
  const { isOpen } = convertation;

  const showConvHandler = () => {
    setShowConv(!showConv);
  };

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
  };
};

export default connect(mapStateToProps, null)(MessagesPage);
