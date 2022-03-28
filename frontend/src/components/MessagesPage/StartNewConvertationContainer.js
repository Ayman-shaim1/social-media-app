import React from "react";
import { ListGroup, Form } from "react-bootstrap";
import StartNewConvertationItem from "./StartNewConvertationItem";

const StartNewConvertationContainer = () => {
  return (
    <>
      <div className="mb-2">
        <Form>
          <Form.Control size="sm" placeholder="search users ..." />
        </Form>
      </div>
      <ListGroup className="start-new-conv-container">
        <StartNewConvertationItem />
        <StartNewConvertationItem />
        <StartNewConvertationItem />
        <StartNewConvertationItem />
      </ListGroup>
    </>
  );
};

export default StartNewConvertationContainer;
