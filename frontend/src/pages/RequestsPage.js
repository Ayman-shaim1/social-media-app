import React, { useState, useEffect } from "react";
import RequestItem from "../components/RequestsPage/RequestItem";
import { Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import {
  getRequestsUsers,
  resetRequestsUsers,
} from "../redux/user/userActions";
import Loader from "../components/Loader";
import useAlert from "../hooks/useAlert";

const RequestsPage = ({
  getRequestsUsers,
  userRequests,
  resetRequestsUsers,
}) => {
  // hooks :
  const showAlert = useAlert();
  // states:
  const [callApi, setCallApi] = useState(false);
  // redux states :
  const {
    loading: userRequestsLoading,
    error: userRequestsError,
    users,
  } = userRequests;

  useEffect(() => {
    if (!callApi) {
      getRequestsUsers();
      setCallApi(true);
    }

    if (userRequestsError) {
      showAlert({
        type: "danger",
        title: "error",
        content: userRequestsError,
      });
      resetRequestsUsers();
    }
  }, [
    callApi,
    showAlert,
    getRequestsUsers,
    userRequestsError,
    resetRequestsUsers,
  ]);

  return (
    <Row>
      <Col xl={3} lg={3} md={2} sm={12}></Col>
      <Col xl={6} lg={6} md={8} sm={12}>
        {userRequestsLoading ? (
          <Loader />
        ) : users.length > 0 ? (
          users.map((user) => <RequestItem user={user.user} key={user._id} />)
        ) : (
          <div className="p-5">
            <div className="p-5 mt-5">
              <div className="d-flex justify-content-center p-5">
                <small className="text-secondary">requests not found</small>
              </div>
            </div>
          </div>
        )}
      </Col>
      <Col xl={3} lg={3} md={2} sm={12}></Col>
    </Row>
  );
};

const mapStateToProps = (state) => {
  const { userRequests } = state;
  return { userRequests };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getRequestsUsers: () => dispatch(getRequestsUsers()),
    resetRequestsUsers: () => dispatch(resetRequestsUsers()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(RequestsPage);
