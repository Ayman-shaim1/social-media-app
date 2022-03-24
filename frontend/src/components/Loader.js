import React from "react";
import { Spinner } from "react-bootstrap";

function Loader({ size }) {
  return (
    <Spinner
      animation="border"
      role="status"
      style={{
        width:
          size === "sm"
            ? "20px"
            : size === "md"
            ? "35px"
            : size === "lg"
            ? "100px"
            : size === undefined && "100px",
        height:
          size === "sm"
            ? "20px"
            : size === "md"
            ? "35px"
            : size === "lg"
            ? "100px"
            : size === undefined && "100px",
        margin: "auto",
        display: "block",
      }}>
      <span className="sr-only">Loading...</span>
    </Spinner>
  );
}

export default Loader;
