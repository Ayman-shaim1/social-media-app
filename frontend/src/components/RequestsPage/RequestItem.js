import React, { useEffect, useState } from "react";
import { Card, Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import Avatar from "../Avatar";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import useAlert from "../../hooks/useAlert";
import Loader from "../Loader";
import {
  acceptRequestUser,
  rejectRequestUser,
  followUser,
  unFollowUser,
  resetRejectRequestUser,
  resetAcceptRequestUser,
  resetFollowUser,
  resetUnFollowUser,
} from "../../redux/user/userActions";
const RequestItem = ({
  user,
  acceptRequestUser,
  rejectRequestUser,
  userAcceptFollow,
  userRejectFollow,
  followUser,
  unFollowUser,
  userFollow,
  userUnFollow,
  resetRejectRequestUser,
  resetAcceptRequestUser,
  reset,
}) => {
  // hooks :
  const showAlert = useAlert();
  // States :
  const [loading, setLoading] = useState(false);
  const [requestState, setRequestState] = useState("follow");
  const [loadingReject, setLoadingReject] = useState(false);
  const [loadingAccept, setLoadingAccept] = useState(false);
  const [accept, setAccept] = useState(false);

  // redux states :
  const { error: userAcceptFollowError, success: userAcceptFollowSuccess } =
    userAcceptFollow;

  const { error: userRejectFollowError, success: userRejectFollowSuccess } =
    userRejectFollow;
  const {
    error: userFollowError,
    success: userFollowSuccess,
    resFollow,
  } = userFollow;

  const {
    error: userUnFollowError,
    success: userUnFollowSuccess,
    resUnFollow,
  } = userUnFollow;

  const followUserHandler = (id) => {
    setLoading(true);
    followUser(id);
  };
  const unFollowUserHandler = (id) => {
    setLoading(true);
    unFollowUser(id);
  };

  const acceptUserHandler = () => {
    setLoadingAccept(true);
    acceptRequestUser(user._id);
  };
  const rejectUserHandler = () => {
    setLoadingReject(true);
    rejectRequestUser(user._id);
  };

  const btns = [
    {
      state: "follow",
      button: (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>follow this user</Tooltip>}>
          <Button
            disabled={loading && true}
            size="sm"
            variant="primary"
            onClick={() => followUserHandler(user._id)}>
            {loading ? (
              <Loader size="sm" />
            ) : (
              <>
                <i className="fa-solid fa-user-plus"></i> follow
              </>
            )}
          </Button>
        </OverlayTrigger>
      ),
    },
    {
      state: "sent",
      button: (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>you already sent a request to this user</Tooltip>}>
          <Button
            disabled={loading && true}
            size="sm"
            variant="light"
            className="text-info"
            onClick={() => unFollowUserHandler(user._id)}>
            {loading ? (
              <Loader size="sm" />
            ) : (
              <>
                <i className=" fa-solid fa-user-clock"></i> unfollow
              </>
            )}
          </Button>
        </OverlayTrigger>
      ),
    },
  ];

  useEffect(() => {
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
      setAccept(true);
      resetAcceptRequestUser();
    }

    if (userRejectFollowSuccess) {
      setLoadingReject(false);
      resetRejectRequestUser();
    }

    if (userFollowError) {
      setLoading(false);
      showAlert({
        type: "danger",
        title: "error",
        content: userFollowError,
      });
      resetFollowUser();
    }

    if (userUnFollowError) {
      setLoading(false);
      showAlert({
        type: "danger",
        title: "error",
        content: userUnFollowError,
      });
      resetUnFollowUser();
    }

    if (userFollowSuccess) {
      setLoading(false);
      if (String(resFollow._id) === String(user._id)) {
        setRequestState("sent");
        resetFollowUser();
      }
    }

    if (userUnFollowSuccess) {
      setLoading(false);
      if (String(resUnFollow._id) === String(user._id)) {
        setRequestState("follow");
        resetUnFollowUser();
      }
    }
  }, [
    accept,
    loadingAccept,
    loadingReject,
    userRejectFollowError,
    userAcceptFollowError,
    userRejectFollowSuccess,
    userAcceptFollowSuccess,
    showAlert,
    resetRejectRequestUser,
    resetAcceptRequestUser,
  ]);

  return (
    <Card className="mb-2">
      <Card.Body>
        <div className="d-flex justify-content-between">
          <Link to={`/profile/${user._id}`}>
            <Avatar image={user.avatar} />
          </Link>
          <div className="d-flex flex-column">
            <h6>{user.name}</h6>
            <strong>{user.email}</strong>
          </div>
          <div>
            {!accept ? (
              <>
                <OverlayTrigger
                  placement="left"
                  overlay={<Tooltip>Accept user request</Tooltip>}>
                  <Button
                    size="sm"
                    variant="success"
                    onClick={acceptUserHandler}>
                    {loadingAccept ? (
                      <Loader size="sm" />
                    ) : (
                      <>
                        <i className="fas fa-user-plus"></i> accept user
                      </>
                    )}
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="right"
                  overlay={<Tooltip>Reject user request</Tooltip>}>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={rejectUserHandler}>
                    {loadingReject ? (
                      <Loader size="sm" />
                    ) : (
                      <>
                        <i className=" fa-solid fa-user-xmark"></i> reject user
                      </>
                    )}
                  </Button>
                </OverlayTrigger>
              </>
            ) : (
              btns.find((btn) => btn.state === requestState)["button"]
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

const mapStateToProps = (state) => {
  const { userAcceptFollow, userRejectFollow, userFollow, userUnFollow } =
    state;
  return {
    userAcceptFollow,
    userRejectFollow,
    userFollow,
    userUnFollow,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    acceptRequestUser: (id) => dispatch(acceptRequestUser(id)),
    rejectRequestUser: (id) => dispatch(rejectRequestUser(id)),
    resetRejectRequestUser: () => dispatch(resetRejectRequestUser()),
    resetAcceptRequestUser: () => dispatch(resetAcceptRequestUser()),
    followUser: (id) => dispatch(followUser(id)),
    unFollowUser: (id) => dispatch(unFollowUser(id)),
    resetFollowUser: () => dispatch(resetFollowUser()),
    resetUnFollowUser: () => dispatch(resetUnFollowUser()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RequestItem);
