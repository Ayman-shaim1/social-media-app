import React from "react";
import { ListGroup } from "react-bootstrap";
import Avatar from "../Avatar";
const StartNewConvertationItem = () => {
  return (
    <ListGroup.Item className="start-new-conv-user-item">
      <div className="d-flex align-items-center">
        <Avatar image="/images/user.png" />
        <div className="d-flex flex-column">
          <h6 className="m-0">John Doe</h6>
          <small>john@example.com</small>
        </div>
      </div>
    </ListGroup.Item>
  );
};

export default StartNewConvertationItem;
