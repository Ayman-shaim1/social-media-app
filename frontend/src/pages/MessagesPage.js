import React from "react";
import { InputGroup } from "react-bootstrap";
import {
  Alert,
  Card,
  Row,
  Col,
  Dropdown,
  Form,
  Button,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import ConvertationsContainer from "../components/MessagesPage/ConvertationsContainer";
import StartNewConvertationContainer from "../components/MessagesPage/StartNewConvertationContainer";
import MessageItem from "../components/MessagesPage/MessageItem";
import Avatar from "../components/Avatar";
const MessagesPage = () => {
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
            {/* <ConvertationsContainer /> */}
            <StartNewConvertationContainer />
          </Card.Body>
        </Card>
      </Col>
      <Col xl={8} lg={8} md={12} sm={12}>
        <Card className="conv">
          <Card.Header className="conv-header">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <Avatar image="/images/user.png" size="md" />
                <div className="d-flex flex-column">
                  <h6 className="m-0">John Doe</h6>
                  <small>online</small>
                </div>
              </div>
              <Dropdown>
                <Dropdown.Toggle
                  size="sm"
                  id="drp-conv-header-btn"></Dropdown.Toggle>
                <Dropdown.Menu>
                  <LinkContainer to={`/profile/`}>
                    <Dropdown.Item>
                      <i className="fa-solid fa-user"></i> show profile
                    </Dropdown.Item>
                  </LinkContainer>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Card.Header>
          <Card.Body className="conv-body">
            <MessageItem />
            <MessageItem />
            <MessageItem />
            <MessageItem />
            <MessageItem />
            <MessageItem />
            <MessageItem />
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
      </Col>
    </Row>
  );
};

export default MessagesPage;
