import React from "react";
import { Card } from "react-bootstrap";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import Loader from "./Loader";
const UsersDropdown = ({ show, users, loading }) => {
  return (
    <div
      className={`drp-users position-absolute  ${show ? "d-block" : "d-none"}`}>
      {loading && <Loader size="sm" />}
      {users &&
        users.length > 0 &&
        users.map((user) => {
          <Link className="drp-user-item" to={`/profile/${user._id}`}>
            <Card>
              <Card.Body>
                <div className="d-flex align-items-center">
                  <Avatar image={user.avatar} />
                  <div className="d-flex flex-column">
                    <h6>{user.name}</h6>
                    <strong>{user.email}</strong>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Link>;
        })}
    </div>
  );
};

export default UsersDropdown;
