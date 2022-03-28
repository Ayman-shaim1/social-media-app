import React from "react";
import { Card, Alert } from "react-bootstrap";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import Loader from "./Loader";
const UsersDropdown = ({ show, userFind, hide }) => {
  const { loading, users } = userFind;

  return (
    <div
      className={`drp-users position-absolute  ${show ? "d-block" : "d-none"}`}>
      {loading ? (
        <div className="mt-5 p-2">
          <Loader />
        </div>
      ) : users && users.length > 0 ? (
        users.map((user) => (
          <Link
            className="drp-user-item"
            to={`/profile/${user._id}`}
            onClick={hide}>
            <Card>
              <Card.Body>
                <div className="d-flex align-items-center">
                  <Avatar image={user.avatar} />
                  <div className="d-flex flex-column ">
                    <h6>{user.name}</h6>
                    <span>{user.email}</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Link>
        ))
      ) : (
        <div className="p-3 mt-4">
          <Alert variant="danger">
            <div className="d-flex justify-content-center">
              <h1>
                <i className="fa-solid fa-user-xmark"></i>
              </h1>
            </div>
            <div className="d-flex justify-content-center">
              <h6>users not found</h6>
            </div>
          </Alert>
        </div>
      )}
    </div>
  );
};
const mapStateToProps = (state) => {
  const { userFind } = state;
  return { userFind };
};
export default connect(mapStateToProps, null)(UsersDropdown);
