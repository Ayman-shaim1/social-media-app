import React from "react";
import { ListGroup, Badge } from "react-bootstrap";
import Avatar from "../Avatar";
const ConvertationItem = () => {
  return (
    <ListGroup.Item className="convertation-item py-2">
      <div className="d-flex justify-content-between">
        <Avatar image="/images/user.png"></Avatar>
        <div className="d-flex flex-column">
          <h6 className="m-0">John Doe</h6>
          <p>
            <span className="me">Me :</span> Lorem ipsum dolor sit amet
            consectetur adipisicing.
          </p>
        </div>
        <div className="d-flex flex-column">
          <Badge>1</Badge>
          <small>17:20</small>
        </div>
      </div>
    </ListGroup.Item>
  );
};

export default ConvertationItem;
