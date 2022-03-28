import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import {
  getByIdPost,
  removePost,
  likePost,
  unLikePost,
  resetLikePost,
  resetUnlikePost,
  resetRemovePost,
  resetGetByIdPost,
} from "../redux/post/postActions";
import Loader from "../components/Loader";
import useAlert from "../hooks/useAlert";
import Avatar from "../components/Avatar";
import { Card, Col, Row, Dropdown, Alert, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CommentItem from "../components/PostPage/CommentItem";
import AddComment from "../components/PostPage/AddComment";
import useDialog from "../hooks/useDialog";

const PostPage = ({
  getByIdPost,
  postById,
  removePost,
  postDelete,
  userLogin,
  likePost,
  unLikePost,
  resetLikePost,
  resetUnlikePost,
  postLike,
  postUnlike,
  resetRemovePost,
  resetGetByIdPost,
}) => {
  // hooks :
  const showDialog = useDialog();
  const showAlert = useAlert();
  const params = useParams();
  const navigate = useNavigate();

  // States :
  const [isPostLiked, setIsPostLiked] = useState(false);
  const [nbrLikes, setNbrLikes] = useState(0);
  const [callApi, setCallApi] = useState(false);
  const [isPrivatePage, setIsPrivatePage] = useState(false);
  // redux states :
  const { loading, error, post, success } = postById;
  const { userInfo } = userLogin;
  const { error: errorPostDelete, success: successPostDelete } = postDelete;
  const { error: errorPostLike, success: successPostLike } = postLike;
  const { error: errorPostUnlike, success: successPostUnlike } = postUnlike;

  const likePostHandler = () => {
    likePost(post._id);
  };
  const unLikePostHandler = () => {
    unLikePost(post._id);
  };

  const removePostHandler = (e) => {
    e.preventDefault();
    showDialog({
      title: "confirmation",
      content: "Are you sure you want to delete this post",
      onYes: () => {
        removePost(post._id);
        navigate("/");
      },
    });
  };

  useEffect(() => {
    if (!callApi) {
      getByIdPost(params.id);
      setCallApi(true);
    }
    if (post && post.likes.length > 0) {
      const index = post.likes.findIndex(
        (l) => String(l.user) === String(userInfo._id)
      );

      if (index === -1) setIsPostLiked(false);
      else setIsPostLiked(true);

      setNbrLikes(post.likes.length);
    }

    if (post) {
      if (String(post.user._id) !== String(userInfo._id)) {
        if (post.user.isPrivateAccount) {
          if (
            post.user.followers.findIndex(
              (u) => u.isAccepted && String(u.user) === String(userInfo._id)
            ) === -1
          ) {
            setIsPrivatePage(true);
          }
        }
      }
    }

    if (error) {
      showAlert({
        type: "danger",
        title: "Error",
        content: error,
      });
    }

    if (errorPostDelete) {
      showAlert({
        type: "danger",
        title: "Error",
        content: errorPostDelete,
      });
      resetRemovePost();
    }
    if (errorPostLike) {
      showAlert({
        type: "danger",
        title: "error",
        content: errorPostLike,
      });
      resetLikePost();
    }

    if (errorPostUnlike) {
      showAlert({
        type: "danger",
        title: "error",
        content: errorPostUnlike,
      });
      resetUnlikePost();
    }
    if (successPostLike) {
      setIsPostLiked(true);
      setNbrLikes(nbrLikes + 1);
      resetLikePost();
    }
    if (successPostUnlike) {
      setNbrLikes(nbrLikes - 1);
      setIsPostLiked(false);
      resetUnlikePost();
    }

    if (successPostDelete) {
      resetRemovePost();
    }
  }, [
    resetRemovePost,
    nbrLikes,
    resetUnlikePost,
    resetLikePost,
    successPostDelete,
    errorPostLike,
    errorPostUnlike,
    successPostLike,
    successPostUnlike,
    post,
    success,
    error,
    errorPostDelete,
    callApi,
    getByIdPost,
    showAlert,
    userInfo,
    params.id,
  ]);
  return (
    <>
      <Row>
        <Col xl={3} lg={3} md={2} sm={12}>
          <Link className="btn btn-sm btn-light mb-2" to="/">
            posts
          </Link>
        </Col>
        <Col xl={6} lg={6} md={8} sm={12}>
          {loading && <Loader />}
          {isPrivatePage ? (
            <Alert variant="danger">
              <div className="d-flex justify-content-center">
                <h1>
                  <i className="fa-solid fa-lock"></i>
                </h1>
              </div>
              <div className="d-flex justify-content-center">
                <h6>This Account is private you can't see this post </h6>
              </div>
            </Alert>
          ) : (
            post && (
              <>
                <Card className="mb-1 ">
                  <Card.Header
                    bg="light"
                    className="d-flex justify-content-between">
                    <div className="d-flex align-items-center">
                      <Link to={`/profile/${post.user._id}`}>
                        <Avatar image={post.user.avatar} />
                      </Link>
                      <Link to={`/profile/${post.user._id}`}>
                        <strong className="m-2">{post.user.name}</strong>
                      </Link>
                    </div>
                    {String(post.user._id) === String(userInfo._id) && (
                      <Dropdown>
                        <Dropdown.Toggle
                          size="sm"
                          id="drp-post-btn"></Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={removePostHandler}>
                            <i className="fa-solid fa-trash-can"></i> remove
                            post
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                  </Card.Header>
                  <Card.Body>
                    {post.text && <p>{post.text}</p>}
                    {post.media_url &&
                    String(post.media_url).includes(".mp4") ? (
                      <video src={post.media_url} controls></video>
                    ) : (
                      <Link to={`/post/${post._id}`}>
                        <Image
                          src={post.media_url}
                          className="media-post"
                          rounded
                        />
                      </Link>
                    )}
                  </Card.Body>
                  <Card.Footer>
                    <div className="d-flex justify-content-between ">
                      {!isPostLiked ? (
                        <Link
                          to="#"
                          className="ps-action d-flex align-items-center justify-content-center w-100  btn btn-sm"
                          onClick={likePostHandler}>
                          <span className="mt-0">
                            <i className="fas fa-heart"></i>
                          </span>
                          &nbsp;like&nbsp;
                          <span className="text-decoration-underline">
                            {nbrLikes}
                          </span>
                        </Link>
                      ) : (
                        <Link
                          to="#"
                          className="ps-action d-flex align-items-center justify-content-center w-100 btn btn-sm"
                          onClick={unLikePostHandler}>
                          <span className="mt-0 text-danger">
                            <i className="fas fa-heart text-danger"></i>
                          </span>
                          &nbsp;like&nbsp;
                          <span className="text-decoration-underline">
                            {nbrLikes}
                          </span>
                        </Link>
                      )}
                      <Link
                        to={`/messages/${post.user._id}/${post._id}`}
                        className="ps-action d-flex align-items-center justify-content-center w-100 mt-0 btn btn-sm">
                        <i className="fas fa-share"></i>&nbsp;share
                      </Link>
                    </div>
                  </Card.Footer>
                </Card>
                <hr />
                <AddComment postId={post._id} />
                <hr />
                <div className="comments">
                  {post &&
                    post.comments.length !== 0 &&
                    post.comments.map((comment) => (
                      <CommentItem
                        comment={comment}
                        key={comment._id}
                        idPost={post._id}
                      />
                    ))}
                </div>
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
  const { postById, userLogin, postDelete, postLike, postUnlike } = state;
  return {
    postById,
    userLogin,
    postDelete,
    postLike,
    postUnlike,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getByIdPost: (id) => dispatch(getByIdPost(id)),
    removePost: (id) => dispatch(removePost(id)),
    likePost: (id) => dispatch(likePost(id)),
    unLikePost: (id) => dispatch(unLikePost(id)),
    resetLikePost: () => dispatch(resetLikePost()),
    resetUnlikePost: () => dispatch(resetUnlikePost()),
    resetRemovePost: () => dispatch(resetRemovePost()),
    resetGetByIdPost: () => dispatch(resetGetByIdPost()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(PostPage);
