import React, { useState, useEffect } from "react";
import { Card, Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import Avatar from "../Avatar";
import { Link } from "react-router-dom";
import {
  followUser,
  unFollowUser,
  resetFollowUser,
  resetUnFollowUser,
} from "../../redux/user/userActions";
import useAlert from "../../hooks/useAlert";
import useDialog from "../../hooks/useDialog";

import { connect } from "react-redux";
import Loader from "../../components/Loader";

const UserItemFollowing = ({
  user,
  followUser,
  userLogin,
  userFollow,
  unFollowUser,
  userUnFollow,
  resetFollowUser,
  resetUnFollowUser,
}) => {
  // hooks :
  const showAlert = useAlert();
  const showDialog = useDialog();
  // states :
  const [requestState, setRequestState] = useState("loading");
  const [isRequestChecked, setIsRequestChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  // redux states:
  const { userInfo } = userLogin;
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

  const dialogUnfollowHandler = (id) => {
    showDialog({
      title: "Confirmation",
      content: "Are you sure you want to unfollow this user",
      onYes: () => {
        setLoading(true);
        unFollowUser(id);
      },
    });
  };

  const checkRequestState = () => {
    let _requestState = "";
    const index1 = user.followers.findIndex(
      (u) => u.isAccepted && String(userInfo._id) === String(u.user)
    );

    if (index1 !== -1) {
      _requestState = "accept";
    } else {
      const index2 = user.followers.findIndex(
        (u) => !u.isAccepted && String(userInfo._id) === String(u.user)
      );

      if (index2 !== -1) _requestState = "sent";
      else _requestState = "follow";
    }
    return _requestState;
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
            className="btn-f-act"
            onClick={() => followUserHandler(user._id)}>
            {loading ? (
              <Loader size="sm" />
            ) : (
              <>
                <i className="fa-solid fa-user-plus"></i> Follow
              </>
            )}
          </Button>
        </OverlayTrigger>
      ),
    },
    {
      state: "accept",
      button: (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>unfollow this user</Tooltip>}>
          <Button
            disabled={loading && true}
            size="sm"
            variant="light"
            className="text-danger btn-f-act"
            onClick={() => dialogUnfollowHandler(user._id)}>
            {loading ? (
              <Loader size="sm" />
            ) : (
              <>
                <i className=" fa-solid fa-user-xmark"></i> unfollow
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
            className="text-info btn-f-act"
            onClick={() => unFollowUserHandler(user._id)}>
            {loading ? (
              <Loader size="sm" />
            ) : (
              <>
                <i className="fa-solid fa-user-clock"></i> unfollow
              </>
            )}
          </Button>
        </OverlayTrigger>
      ),
    },
    {
      state: "loading",
      button: (
        <Button variant="light" size="sm">
          <Loader size="sm" />
        </Button>
      ),
    },
  ];

  useEffect(() => {
    if (!isRequestChecked) {
      setRequestState(checkRequestState());
      setIsRequestChecked(true);
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
      }
      resetFollowUser();
    }

    if (userUnFollowSuccess) {
      setLoading(false);
      if (String(resUnFollow._id) === String(user._id)) {
        setRequestState("follow");
      }
      resetUnFollowUser();
    }
  }, [
    showAlert,
    checkRequestState,
    loading,
    user,
    resFollow,
    resUnFollow,
    isRequestChecked,
    userFollowError,
    userUnFollowError,
    userFollowSuccess,
    userUnFollowSuccess,
    resetFollowUser,
    resetUnFollowUser,
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
          {btns.find((btn) => btn.state === requestState)["button"]}
        </div>
      </Card.Body>
    </Card>
  );
};

const mapStateToProps = (state) => {
  const { userLogin, userFollow, userUnFollow } = state;
  return {
    userLogin,
    userFollow,
    userUnFollow,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    followUser: (id) => dispatch(followUser(id)),
    unFollowUser: (id) => dispatch(unFollowUser(id)),
    resetFollowUser: () => dispatch(resetFollowUser()),
    resetUnFollowUser: () => dispatch(resetUnFollowUser()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserItemFollowing);
