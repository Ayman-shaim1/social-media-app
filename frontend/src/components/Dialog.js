import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { hideDialog } from "../redux/dialog/dialogActions";

const Dialog = ({ dialog, hideDialog }) => {
  const [top, setTop] = useState(0);
  const yesHandler = () => {
    hideDialog();
    if (dialog.onYes) dialog.onYes();
  };
  const noHandler = () => {
    hideDialog();
    if (dialog.onNo) dialog.onNo();
  };

  useEffect(() => {
    if (dialog.show) {
      setTop(document.documentElement.scrollTop);
    } else {
      setTop(0);
    }
  }, [dialog.show]);

  return (
    <>
      <div className={`m-dialog-overlay ${dialog.show ? "open" : ""}`}></div>
      <div
        className={`m-dialog ${dialog.show ? "open" : ""}`}
        style={{
          top: `calc(${top}px + 50%)`,
        }}>
          
        <div className="d-flex justify-content-center">
          <span className="m-dialog-icon text-primary">
            <i className="fa-solid fa-question"></i>
          </span>
        </div>
        <div className="d-flex justify-content-center mt-2">
          <h3 className="mb-0">{dialog.title}</h3>
        </div>
        <div className="d-flex justify-content-center mt-1">
          <p>{dialog.content}</p>
        </div>
        <div className="d-flex justify-content-center">
          <Button variant="primary" className="m-1" onClick={yesHandler}>
            yes
          </Button>
          <Button variant="danger" className="m-1" onClick={noHandler}>
            no
          </Button>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  const { dialog } = state;
  return { dialog };
};

const mapDispatchToProps = (dispatch) => {
  return { hideDialog: () => dispatch(hideDialog()) };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dialog);
