import React, { useState, useEffect } from "react";
import { Toast } from "react-bootstrap";
const MessageToast = ({ message }) => {
  const [show, setShow] = useState(true);
  const hideToastHandler = () => setShow(false);
  useEffect(() => {
    setTimeout(() => setShow(false), 5000);
  });
  return (
    <Toast show={show} onClose={hideToastHandler}>
      <Toast.Header className="d-flex justify-content-between">
        <small className="text-muted">
          {new Date(message.message_date).toDateString()}
        </small>
      </Toast.Header>
      <Toast.Body>
        <h6>{message.message_from.name} sent to you a message</h6>

        <p>{message.message_text}</p>
      </Toast.Body>
    </Toast>
  );
};

export default MessageToast;
