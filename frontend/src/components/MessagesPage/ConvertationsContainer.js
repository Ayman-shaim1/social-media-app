import React from "react";
import { ListGroup, Form } from "react-bootstrap";
import ConvertationItem from "./ConvertationItem";
const ConvertationsContainer = () => {
  return (
    <>
      <div className="mb-2">
        <Form>
          <Form.Control size="sm" placeholder="search convertation ..." />
        </Form>
      </div>
      <ListGroup>
        <ConvertationItem />
        <ConvertationItem />
        <ConvertationItem />
        <ConvertationItem />
        <ConvertationItem />
      </ListGroup>
    </>
  );
};

export default ConvertationsContainer;
