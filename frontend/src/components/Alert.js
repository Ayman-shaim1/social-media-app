import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { hideAlert } from "../redux/alert/alertActions";

const Alert = ({ alert, hideAlert }) => {
  const [top, setTop] = useState(0);

  const [icons] = useState({
    success: <i className="fa-solid fa-check"></i>,
    danger: <i className="fas fa-times"></i>,
    warning: <i className="fa-solid fa-exclamation"></i>,
    info: <i className="fa-solid fa-info"></i>,
  });

  useEffect(() => {
    if (alert.show) {
      setTop(document.documentElement.scrollTop);
    } else {
      setTop(0);
    }
  }, [alert.show]);

  return (
    <>
      <div className={`m-alert-overlay ${alert.show ? "open" : ""}`}></div>
      <div
        className={`m-alert ${alert.show ? "open" : ""}`}
        style={{
          top: `calc(${top}px + 50%)`,
        }}>
        <div className="d-flex justify-content-center mt-2">
          <span className={`m-alert-icon text-${alert.type}`}>
            {icons[alert.type]}
          </span>
        </div>
        <div className="d-flex justify-content-center">
          <h3 className="mb-0">{alert.title}</h3>
        </div>
        <div className="d-flex justify-content-center mt-1">
          <p>{alert.content}</p>
        </div>
        <div className="d-flex justify-content-center">
          <Button variant={alert.type} onClick={hideAlert}>
            ok
          </Button>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  const { alert } = state;
  return { alert };
};

const mapDispatchToProps = (dispatch) => {
  return {
    hideAlert: () => dispatch(hideAlert()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Alert);
