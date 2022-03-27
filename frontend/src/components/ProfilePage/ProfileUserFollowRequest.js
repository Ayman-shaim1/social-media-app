import React, { useEffect, useState } from "react";
import { Card, Button, Tooltip, OverlayTrigger } from "react-bootstrap";

import { connect, useDispatch } from "react-redux";
import useAlert from "../../hooks/useAlert";
import Loader from "../Loader";
import {
  acceptRequestUser,
  rejectRequestUser,
  checkFollowRequestUser,
  resetRejectRequestUser,
  resetAcceptRequestUser,
  resetCheckFollowRequestUser,
} from "../../redux/user/userActions";

import { USER_CHECK_FOLLOW_UPDATE_REMOVE } from "../../redux/user/userTypes";

const ProfileUserFollowRequest = ({
  user,
  userAcceptFollow,
  userRejectFollow,
  acceptRequestUser,
  userCheckFollow,

  rejectRequestUser,
  checkFollowRequestUser,
  resetRejectRequestUser,
  resetAcceptRequestUser,
  resetCheckFollowRequestUser,
}) => {
  // hooks :
  const showAlert = useAlert();
  // States :
  const [loadingReject, setLoadingReject] = useState(false);
  const [loadingAccept, setLoadingAccept] = useState(false);

  const [isCallApi, setIsCallApi] = useState(false);

  const dispatch = useDispatch();

  // redux states :
  const {
    error: userAcceptFollowError,
    success: userAcceptFollowSuccess,
    resUserAccept,
  } = userAcceptFollow;

  const { error: userRejectFollowError, success: userRejectFollowSuccess } =
    userRejectFollow;

  const {
    error: userCheckFollowError,
    resCheckFollowRequest,
    // success: userCheckFollowSuccess,
  } = userCheckFollow;

  const acceptUserHandler = () => {
    setLoadingAccept(true);
    acceptRequestUser(user._id);
  };
  const rejectUserHandler = () => {
    setLoadingReject(true);
    rejectRequestUser(user._id);
  };

  useEffect(() => {
    if (!isCallApi) {
      setIsCallApi(true);
      checkFollowRequestUser(user._id);
    }

    if (userAcceptFollowError) {
      setLoadingAccept(false);
      showAlert({
        type: "danger",
        title: "error",
        content: userAcceptFollowError,
      });
      resetAcceptRequestUser();
    }

    if (userRejectFollowError) {
      setLoadingReject(false);
      showAlert({
        type: "danger",
        title: "error",
        content: userRejectFollowError,
      });
      resetRejectRequestUser();
    }

    if (userAcceptFollowSuccess) {
      setLoadingAccept(false);
      dispatch({
        type: USER_CHECK_FOLLOW_UPDATE_REMOVE,
      });
      resetAcceptRequestUser();
    }

    if (userRejectFollowSuccess) {
      setLoadingReject(false);
      dispatch({
        type: USER_CHECK_FOLLOW_UPDATE_REMOVE,
      });
      resetRejectRequestUser();
    }

    if (userCheckFollowError) {
      showAlert({
        type: "danger",
        title: "error",
        content: userCheckFollowError,
      });
      resetCheckFollowRequestUser();
    }
  }, [
    isCallApi,
    resUserAccept,
    resetCheckFollowRequestUser,
    checkFollowRequestUser,
    userCheckFollowError,
    dispatch,
    loadingAccept,
    loadingReject,
    userRejectFollowError,
    userAcceptFollowError,
    userRejectFollowSuccess,
    userAcceptFollowSuccess,
    user,
    showAlert,
    resetRejectRequestUser,
    resetAcceptRequestUser,
  ]);

  return resCheckFollowRequest && resCheckFollowRequest.isRequest ? (
    <Card className="mb-2">
      <Card.Body>
        <div className="d-flex justify-content-between">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Accept user request</Tooltip>}>
            <Button
              size="sm"
              variant="light"
              className="text-success text-center  w-50 w-sm-100"
              disabled={(loadingAccept || loadingReject) && true}
              onClick={acceptUserHandler}>
              {loadingAccept ? (
                <Loader size="sm" />
              ) : (
                <>
                  <i className="fas fa-user-plus"></i> accept user follow
                </>
              )}
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Reject user request</Tooltip>}>
            <Button
              size="sm"
              variant="light"
              className="text-danger text-center w-50 w-sm-100"
              disabled={(loadingAccept || loadingReject) && true}
              onClick={rejectUserHandler}>
              {loadingReject ? (
                <Loader size="sm" />
              ) : (
                <>
                  <i className=" fa-solid fa-user-xmark"></i> reject user follow
                </>
              )}
            </Button>
          </OverlayTrigger>
        </div>
      </Card.Body>
    </Card>
  ) : (
    <></>
  );
};

const mapStateToProps = (state) => {
  const { userAcceptFollow, userRejectFollow, userCheckFollow, userLogin } =
    state;
  return {
    userAcceptFollow,
    userRejectFollow,
    userCheckFollow,
    userLogin,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    acceptRequestUser: (id) => dispatch(acceptRequestUser(id)),
    rejectRequestUser: (id) => dispatch(rejectRequestUser(id)),
    checkFollowRequestUser: (id) => dispatch(checkFollowRequestUser(id)),
    resetRejectRequestUser: () => dispatch(resetRejectRequestUser()),
    resetAcceptRequestUser: () => dispatch(resetAcceptRequestUser()),
    resetCheckFollowRequestUser: () => dispatch(resetCheckFollowRequestUser()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileUserFollowRequest);
