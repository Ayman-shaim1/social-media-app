import React, { useState, useEffect } from "react";
import { ListGroup, Form } from "react-bootstrap";
import StartNewConvertationItem from "./StartNewConvertationItem";
import { connect } from "react-redux";
import { getFollowers } from "../../redux/user/userActions";
import useAlert from "../../hooks/useAlert";
import Loader from "../Loader";
const StartNewConvertationContainer = ({
  getFollowers,
  userGetFollowers,
  show,
}) => {
  // hooks :
  const showAlert = useAlert();
  // states :
  const [isCallApi, setIsCallApi] = useState(false);
  // redux states :
  const { loading, error, users } = userGetFollowers;
  useEffect(() => {
    if (!isCallApi) {
      getFollowers();
      setIsCallApi(true);
    }
    if (error) {
      showAlert({
        type: "danger",
        title: "error",
        content: error,
      });
    }
  }, [error, showAlert, isCallApi, getFollowers]);

  return (
    <div className={!show ? "d-block" : "d-none"}>
      <div className="mb-2">
        <Form>
          <Form.Control size="sm" placeholder="search users ..." />
        </Form>
      </div>
      {loading ? (
        <div className="mt-5 pt-2">
          <div className="mt-5 pt-3">
            <div className="mt-5">
              <Loader size="md" />
            </div>
          </div>
        </div>
      ) : (
        users.length > 0 && (
          <ListGroup className="start-new-conv-container">
            {users.map((user) => (
              <StartNewConvertationItem key={user._id} user={user} />
            ))}
          </ListGroup>
        )
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userGetFollowers: state.userGetFollowers,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getFollowers: () => dispatch(getFollowers()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StartNewConvertationContainer);
