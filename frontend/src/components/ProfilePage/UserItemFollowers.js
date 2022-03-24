import React, { useState, useEffect } from "react";
import { Card, Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import Avatar from "../Avatar";
import { Link } from "react-router-dom";
import {
  followUser,
  unFollowUser,
  removeFollowUser,
  resetFollowUser,
  resetUnFollowUser,
  resetRemoveFollowing,
} from "../../redux/user/userActions";
import useAlert from "../../hooks/useAlert";
import useDialog from "../../hooks/useDialog";

import { connect } from "react-redux";
import Loader from "../../components/Loader";

const UserItemFollowers = ({
  isUserProfile,
  user,
  userLogin,
  userFollow,
  userUnFollow,
  userRemoveFollow,
  followUser,
  unFollowUser,
  removeFollowUser,
  resetFollowUser,
  resetUnFollowUser,
  resetRemoveFollowing,
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

  const {
    error: userRemoveFollowError,
    success: userRemoveFollowSuccess,
    resRemoveUser,
  } = userRemoveFollow;

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

  const dialogRemoveUserFollowHandler = (id) => {
    showDialog({
      title: "Confirmation",
      content: "Are you sure you want to remove this user from your followers",
      onYes: () => {
        setLoading(true);
        removeFollowUser(id);
      },
    });
  };

  const checkRequestState = () => {
    let _requestState = "";
    if (!isUserProfile) {
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
    } else {
      _requestState = "remove";
    }
    return _requestState;
  };

  const btns = [
    {
      state: "loading",
      button: (
        <Button variant="light" size="sm">
          <Loader size="sm" />
        </Button>
      ),
    },
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
                <i className="fa-solid fa-user-plus"></i> follow
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
                <i className="fa-solid fa-user-xmark"></i> unfollow
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
            className="btn-f-act text-info"
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
    {
      state: "remove",
      button: (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Remove this user from your followers</Tooltip>}>
          <Button
            disabled={loading && true}
            size="sm"
            variant="light"
            className="text-danger btn-f-act"
            onClick={() => dialogRemoveUserFollowHandler(user._id)}>
            {loading ? (
              <Loader size="sm" />
            ) : (
              <>
                <i className="fa-solid fa-user-xmark"></i> remove
              </>
            )}
          </Button>
        </OverlayTrigger>
      ),
    },
    {
      state: "",
      button: <div></div>,
    },
  ];

  useEffect(() => {
    if (!isRequestChecked) {
      setRequestState(checkRequestState());
      setIsRequestChecked(true);
    }

    // error actions :
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

    if (userRemoveFollowError) {
      setLoading(false);
      showAlert({
        type: "danger",
        title: "error",
        content: userRemoveFollowError,
      });
      resetRemoveFollowing();
    }

    // success actions :
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

    if (userRemoveFollowSuccess) {
      setLoading(false);
      if (String(resRemoveUser._id) === String(user._id)) {
        setRequestState("");
        resetRemoveFollowing();
      }
    }
  }, [
    showAlert,
    checkRequestState,
    loading,
    user,
    resFollow,
    resUnFollow,
    resRemoveUser,
    isRequestChecked,
    userFollowError,
    userUnFollowError,
    userRemoveFollowError,
    userFollowSuccess,
    userUnFollowSuccess,
    userRemoveFollowSuccess,
    resetFollowUser,
    resetUnFollowUser,
    resetRemoveFollowing,
  ]);
  useEffect(() => {}, []);

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
          {String(user._id) !== String(userInfo._id) ? (
            btns.find((btn) => btn.state === requestState)["button"]
          ) : (
            <div></div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

const mapStateToProps = (state) => {
  const { userLogin, userFollow, userUnFollow, userRemoveFollow } = state;
  return {
    userLogin,
    userFollow,
    userUnFollow,
    userRemoveFollow,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    followUser: (id, isProfile) => dispatch(followUser(id, isProfile)),
    unFollowUser: (id, isProfile) => dispatch(unFollowUser(id, isProfile)),
    removeFollowUser: (id) => dispatch(removeFollowUser(id)),
    resetFollowUser: () => dispatch(resetFollowUser()),
    resetUnFollowUser: () => dispatch(resetUnFollowUser()),
    resetRemoveFollowing: () => dispatch(resetRemoveFollowing()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserItemFollowers);
