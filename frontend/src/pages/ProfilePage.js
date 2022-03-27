import React, { useState, useEffect } from "react";
import {
  Alert,
  Button,
  Row,
  Col,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import Post from "../components/Post";
import Avatar from "../components/Avatar";
import { useParams, Link } from "react-router-dom";
import { connect } from "react-redux";
import useAlert from "../hooks/useAlert";
import useDialog from "../hooks/useDialog";

import {
  getByIdUser,
  unFollowUser,
  followUser,
  resetFollowUser,
  resetUnFollowUser,
  resetGetByIdUser,
} from "../redux/user/userActions";
import Loader from "../components/Loader";

import FollowersUsersModal from "../components/ProfilePage/FollowersUsersModal";
import FollowingUsersModal from "../components/ProfilePage/FollowingUsersModal";
import ProfileUserFollowRequest from "../components/ProfilePage/ProfileUserFollowRequest";

const ProfilePage = ({
  userLogin,
  getByIdUser,
  followUser,
  userFollow,
  userById,
  unFollowUser,
  userUnFollow,
  resetGetByIdUser,
  resetFollowUser,
  resetUnFollowUser,
}) => {
  // hooks :
  const showAlert = useAlert();
  const showDialog = useDialog();
  const params = useParams();

  // states :
  const [callApi, setCallApi] = useState(false);
  const [requestState, setRequestState] = useState("loading");
  const [isRequestChecked, setIsRequestChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAccessible, setIsAccessible] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [nbrFollowers, setNbrFollowers] = useState(0);
  const [nbrFollowing, setNbrFollowing] = useState(0);

  // redux states:
  const { userInfo } = userLogin;

  const {
    loading: getByIdUserLoading,
    error: getByIdUserError,
    user,
  } = userById;

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

  const btns = [
    {
      state: "follow",
      button: (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>follow this user</Tooltip>}>
          <Button
            className="w-75"
            disabled={loading && true}
            size="sm"
            variant="primary"
            onClick={() => followUserHandler(user._id)}>
            {loading ? (
              <Loader size="sm" />
            ) : (
              <>
                <i className="fa-solid fa-user-plus"></i> follow user
              </>
            )}
          </Button>
        </OverlayTrigger>
      ),
    },
    {
      state: "accept",
      button: (
        <>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip> sent a message to this user</Tooltip>}>
            <Link
              to={`/messages/${user && user._id}`}
              className="btn btn-sm btn-light w-50 m-1">
              <i className="fas fa-message"></i> sent a message
            </Link>
          </OverlayTrigger>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>unfollow this user</Tooltip>}>
            <Button
              className="w-50 m-1"
              disabled={loading && true}
              size="sm"
              variant="light"
              onClick={() => dialogUnfollowHandler(user._id)}>
              {loading ? (
                <Loader size="sm" />
              ) : (
                <>
                  <i className=" fa-solid fa-user-xmark"></i> unfollow this user
                </>
              )}
            </Button>
          </OverlayTrigger>
        </>
      ),
    },
    {
      state: "sent",
      button: (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>you already sent a request to this user</Tooltip>}>
          <Button
            className="w-75"
            disabled={loading && true}
            size="sm"
            variant="light"
            onClick={() => unFollowUserHandler(user._id)}>
            {loading ? (
              <Loader size="sm" />
            ) : (
              <>
                <i className=" fa-solid fa-user-clock"></i> request sent
              </>
            )}
          </Button>
        </OverlayTrigger>
      ),
    },
    {
      state: "loading",
      button: (
        <Button className="w-75" variant="light" size="sm">
          <Loader size="sm" />
        </Button>
      ),
    },
  ];

  useEffect(() => {
    if (!callApi) {
      resetGetByIdUser();
      getByIdUser(params.id);
      setCallApi(true);
      setShowFollowers(false);
      setShowFollowing(false);
      setIsRequestChecked(false);
    }

    if (user && String(user._id) !== params.id) {
      getByIdUser(params.id);
      setShowFollowers(false);
      setShowFollowing(false);
      setIsRequestChecked(false);
    }
    if (user && userInfo) {
      if (String(userInfo._id) === String(user._id)) {
        setIsAccessible(true);
      }

      if (!user.isPrivateAccount) {
        setIsAccessible(true);
      }

      setNbrFollowers(user.followers.filter((u) => u.isAccepted).length);
      setNbrFollowing(user.following.filter((u) => u.isAccepted).length);

      if (!isRequestChecked) {
        let _requestState = "";
        const index1 = user.followers.findIndex(
          (u) => u.isAccepted && String(userInfo._id) === String(u.user._id)
        );

        if (index1 !== -1) {
          _requestState = "accept";
          setIsAccessible(true);
        } else {
          const index2 = user.followers.findIndex(
            (u) => !u.isAccepted && String(userInfo._id) === String(u.user._id)
          );

          if (index2 !== -1) {
            _requestState = "sent";
            setIsAccessible(false);
          } else {
            _requestState = "follow";
            setIsAccessible(false);
          }
        }

        setRequestState(_requestState);
        setIsRequestChecked(true);
      }
    }

    if (getByIdUserError) {
      showAlert({
        type: "danger",
        title: "error",
        content: getByIdUserError,
      });
      resetGetByIdUser();
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
        setIsAccessible(false);
        const nbr = nbrFollowers - 1;
        setNbrFollowers(nbr);
        resetUnFollowUser();
      }
    }

    // return () => {
    //   resetGetByIdUser();
    // };
  }, [
    showAlert,
    params,
    loading,
    user,
    nbrFollowers,
    userInfo,
    getByIdUser,
    callApi,
    resFollow,
    resUnFollow,
    isRequestChecked,
    userFollowError,
    userUnFollowError,
    getByIdUserError,
    userFollowSuccess,
    userUnFollowSuccess,
    resetFollowUser,
    resetUnFollowUser,
    resetGetByIdUser,
  ]);
  return (
    <>
      <Row>
        <Col xl={3} lg={3} md={2} sm={12}></Col>
        <Col xl={6} lg={6} md={10} sm={12}>
          {getByIdUserLoading ? (
            <Loader />
          ) : (
            user && (
              <>
                <ProfileUserFollowRequest user={user} />
                <Alert variant="info">
                  {String(userInfo._id) === String(user._id) && (
                    <div className="d-flex justify-content-end position-relative">
                      <Link to="/settings" className="position-absolute">
                        <i className="fas fa-gear text-secondary "></i>
                      </Link>
                    </div>
                  )}
                  <div className="d-flex justify-content-center">
                    <Avatar image={user.avatar} size="xl" />
                  </div>
                  <div className="d-flex justify-content-center mt-2">
                    <h3>{user.name}</h3>
                  </div>
                  <div className="d-flex justify-content-center">
                    <h5
                      onClick={() => {
                        if (isAccessible) setShowFollowers(true);
                      }}
                      className="m-2 cursor-pointer">
                      {nbrFollowers} Followers
                    </h5>
                    <h5
                      onClick={() => {
                        if (isAccessible) setShowFollowing(true);
                      }}
                      className="m-2 cursor-pointer">
                      {nbrFollowing} Following
                    </h5>
                    <FollowersUsersModal
                      showUsers={showFollowers}
                      hideUsers={() => setShowFollowers(false)}
                      users={user.followers.filter((u) => u.isAccepted)}
                      isUserProfile={
                        user &&
                        userInfo &&
                        String(user._id) === String(userInfo._id)
                      }
                    />
                    <FollowingUsersModal
                      showUsers={showFollowing}
                      hideUsers={() => setShowFollowing(false)}
                      users={user.following.filter((u) => u.isAccepted)}
                    />
                  </div>
                  {String(userInfo._id) !== String(user._id) && (
                    <>
                      <hr />
                      <div className="d-flex justify-content-center">
                        {btns.find((btn) => btn.state === requestState).button}
                      </div>
                    </>
                  )}
                </Alert>
                {isAccessible || String(userInfo._id) === String(user._id) ? (
                  user.posts.map((post) => <Post post={post} key={post._id} />)
                ) : (
                  <Alert variant="danger">
                    <div className="d-flex justify-content-center">
                      <h1>
                        <i className="fa-solid fa-lock"></i>
                      </h1>
                    </div>
                    <div className="d-flex justify-content-center">
                      <h5>This user account is private</h5>
                    </div>
                    <div className="d-flex justify-content-center">
                      <h6>try to follow him</h6>
                    </div>
                  </Alert>
                )}
              </>
            )
          )}
        </Col>
        <Col xl={3} lg={3} md={2} sm={12}></Col>
      </Row>
    </>
  );
};

const mapStateToProps = (state) => {
  const { userById, userLogin, userUnFollow, userFollow } = state;
  return {
    userById,
    userLogin,
    userUnFollow,
    userFollow,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getByIdUser: (id) => dispatch(getByIdUser(id)),
    unFollowUser: (id) => dispatch(unFollowUser(id)),
    followUser: (id) => dispatch(followUser(id)),
    resetFollowUser: () => dispatch(resetFollowUser()),
    resetUnFollowUser: () => dispatch(resetUnFollowUser()),
    resetGetByIdUser: () => dispatch(resetGetByIdUser()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
