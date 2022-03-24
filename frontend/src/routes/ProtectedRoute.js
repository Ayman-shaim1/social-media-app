import React from "react";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";

const ProtectedRoute = ({ children, userLogin }) => {
  const { userInfo } = userLogin;
  return <>{userInfo ? children : <Navigate to="/login" replace />}</>;
};

const mapStateToProps = (state) => {
  const { userLogin } = state;
  return { userLogin };
};

export default connect(mapStateToProps, null)(ProtectedRoute);
