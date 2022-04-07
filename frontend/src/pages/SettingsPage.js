import React from "react";
import { Tab, Row, Col, Nav } from "react-bootstrap";

import ChangeName from "../components/SettingsPage/ChangeName";
import ChangePassword from "../components/SettingsPage/ChangePassword";
import ChangeAvatar from "../components/SettingsPage/ChangeAvatar";
import ChangeAccountState from "../components/SettingsPage/ChangeAccountState";

const SettingsPage = () => {
  return (
    <Tab.Container defaultActiveKey="first">
      <Row className="mt-4">
        <Col sm={12} md={12} lg={3} xl={3}>
          <Nav
            variant="pills"
            className=" mb-5 flex-lg-column  flex-md-row flex-sm-row">
            <Nav.Item className="cursor-pointer">
              <Nav.Link eventKey="first">change your name</Nav.Link>
            </Nav.Item>
            <Nav.Item className="cursor-pointer">
              <Nav.Link eventKey="second">change your password</Nav.Link>
            </Nav.Item>
            <Nav.Item className="cursor-pointer">
              <Nav.Link eventKey="third">change your avatar</Nav.Link>
            </Nav.Item>
            <Nav.Item className="cursor-pointer">
              <Nav.Link eventKey="fourth">change account state</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={12} md={12} lg={7} xl={7}>
          <Tab.Content>
            <Tab.Pane eventKey="first">
              <ChangeName />
            </Tab.Pane>
            <Tab.Pane eventKey="second">
              <ChangePassword />
            </Tab.Pane>
            <Tab.Pane eventKey="third">
              <ChangeAvatar />
            </Tab.Pane>
            <Tab.Pane eventKey="fourth">
              <ChangeAccountState />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
};

export default SettingsPage;
