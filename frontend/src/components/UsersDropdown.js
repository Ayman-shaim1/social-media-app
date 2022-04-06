import React from "react";
import {  ListGroup } from "react-bootstrap";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import Loader from "./Loader";
const UsersDropdown = ({ show, userFind, hide }) => {
  const { loading, users } = userFind;

  return (
    <ListGroup
      className={`drp-users position-absolute  ${show ? "d-block" : "d-none"}`}>
      {loading ? (
        <div className="mt-5 p-2">
          <Loader />
        </div>
      ) : users && users.length > 0 ? (
        users.map((user) => (
          <ListGroup.Item key={user._id} className="drp-user-item">
            <Link to={`/profile/${user._id}`} onClick={hide}>
              <div className="d-flex align-items-center">
                <Avatar image={user.avatar} />
                <div className="d-flex flex-column ">
                  <h6 className="m-0">{user.name}</h6>
                  <span>{user.email}</span>
                </div>
              </div>
            </Link>
          </ListGroup.Item>
        ))
      ) : (
        <div className="p-3 mt-4">
          <div className="p-3 mt-5">
            <div className="d-flex justify-content-center mt-5">
              <small className="text-secondary">users not found</small>
            </div>
          </div>
        </div>
      )}
    </ListGroup>
  );
};
const mapStateToProps = (state) => {
  const { userFind } = state;
  return { userFind };
};
export default connect(mapStateToProps, null)(UsersDropdown);
