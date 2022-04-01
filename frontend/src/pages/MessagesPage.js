import React from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";

import ConvertationsContainer from "../components/MessagesPage/ConvertationsContainer";
import StartNewConvertationContainer from "../components/MessagesPage/StartNewConvertationContainer";
import MessagesConv from "../components/MessagesPage/MessagesConv";
import StartChattingAlert from "../components/MessagesPage/StartChattingAlert";

import { connect } from "react-redux";

const MessagesPage = ({ convertation }) => {
  // redux states:
  const { isOpen } = convertation;

  return (
    <Row>
      <Col xl={4} lg={4} md={12} sm={12}>
        <Card className="convertations-container">
          <Card.Header>
            <div className="d-flex justify-content-start">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>start new convertations</Tooltip>}>
                <Button size="sm" className="btn-new-convertation">
                  <i className="fas fa-message"></i>
                </Button>
              </OverlayTrigger>
            </div>
          </Card.Header>
          <Card.Body>
            <ConvertationsContainer />
            {/* <StartNewConvertationContainer /> */}
          </Card.Body>
        </Card>
      </Col>
      <Col xl={8} lg={8} md={12} sm={12}>
        {isOpen ? <MessagesConv /> : <StartChattingAlert />}
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
