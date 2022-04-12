import React from "react";
import { Alert } from "react-bootstrap";
import Avatar from "../Avatar";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

const StartChattingAlert = ({ userLogin }) => {
  // redux states :
  const { userInfo } = userLogin;

  return (
    <Alert variant="info" className="h-100">
      <div className="p-4 mt-4">
        <div className="p-4 mt-4">
          <div className="d-flex justify-content-center mb-4">
            <Link to={`/profile/${userInfo._id}`}>
              <Avatar image={userInfo.avatar} size="xl" showOnline={false}/>
            </Link>
          </div>
          <div className="d-flex justify-content-center mb-2">
            <h2>Hello {userInfo.name}</h2>
          </div>
          <div className="d-flex justify-content-center">
            <h5>Please select a conversation and start chatting</h5>
          </div>
        </div>
      </div>
    </Alert>
  );
};

const mapStateToProps = (state) => {
  const { userLogin } = state;
  return {
    userLogin,
  };
};

export default connect(mapStateToProps, null)(StartChattingAlert);
