import React, { useState, useEffect } from "react";
import Avatar from "./Avatar";
import { Card, Dropdown, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  likePost,
  unLikePost,
  removePost,
  resetLikePost,
  resetUnlikePost,
} from "../redux/post/postActions";
import { connect } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import useDialog from "../hooks/useDialog";
import useAlert from "../hooks/useAlert";
import Video from "./Video";

const Post = ({
  post,
  likePost,
  userLogin,
  unLikePost,
  removePost,
  postDelete,
  resetLikePost,
  resetUnlikePost,
  postLike,
  postUnlike,
}) => {
  // hooks :
  const showDialog = useDialog();
  const showAlert = useAlert();
  // states :
  const [isPostLiked, setIsPostLiked] = useState(false);
  const [nbrLikes, setNbrLikes] = useState(0);

  // redux states :
  const { userInfo } = userLogin;
  const { error } = postDelete;

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
      },
    });
  };

  useEffect(() => {
    const index = post.likes.findIndex(
      (l) => String(l.user) === String(userInfo._id)
    );

    if (index === -1) setIsPostLiked(false);
    else setIsPostLiked(true);

    setNbrLikes(post.likes.length);

    if (error) {
      showAlert({
        type: "danger",
        title: "error",
        content: error,
      });
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
      setIsPostLiked(false);
      setNbrLikes(nbrLikes - 1);
      resetUnlikePost();
    }
  }, [
    nbrLikes,
    resetUnlikePost,
    resetLikePost,
    errorPostLike,
    errorPostUnlike,
    successPostLike,
    successPostUnlike,
    post.likes,
    showAlert,
    userInfo,
    error,
  ]);

  return (
    <Card className="mb-1 ">
      <Card.Header bg="light" className="d-flex justify-content-between">
        <div className="d-flex align-items-center">
          <Link to={`/profile/${post.user._id}`}>
            <Avatar image={post.user.avatar} />
          </Link>
          <Link to={`/profile/${post.user._id}`}>
            <strong className="m-2">{post.user.name}</strong>
          </Link>
        </div>
        <Dropdown>
          <Dropdown.Toggle size="sm" id="drp-post-btn"></Dropdown.Toggle>

          <Dropdown.Menu>
            <LinkContainer to={`/post/${post._id}`}>
              <Dropdown.Item>
                <i className="fa-solid fa-newspaper"></i> show post
              </Dropdown.Item>
            </LinkContainer>
            {String(post.user._id) === String(userInfo._id) && (
              <>
                <Dropdown.Divider></Dropdown.Divider>
                <Dropdown.Item onClick={removePostHandler}>
                  <i className="fa-solid fa-trash-can"></i> remove post
                </Dropdown.Item>
              </>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </Card.Header>
      <Card.Body>
        {post.text && <p>{post.text}</p>}
        {post.media_url && String(post.media_url).includes(".mp4") ? (
          <Video src={post.media_url} />
        ) : (
          <Link to={`/post/${post._id}`}>
            <Image src={post.media_url} className="media-post" rounded />
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
              <span className="text-decoration-underline">{nbrLikes}</span>
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
              <span className="text-decoration-underline">{nbrLikes}</span>
            </Link>
          )}

          <Link
            className="ps-action d-flex align-items-center text-secondary btn btn-sm"
            to={`/post/${post._id}`}>
            <i className="fa-solid fa-message"></i>&nbsp;comments&nbsp;
            <span className="text-decoration-underline text-small">
              {post.comments.length}
            </span>
          </Link>
          <Link
            to={`/Messages/${post.user._id}/${post._id}`}
            className="ps-action d-flex align-items-center justify-content-center w-100 mt-0 btn btn-sm">
            <i className="fas fa-share"></i>&nbsp;share
          </Link>
        </div>
      </Card.Footer>
    </Card>
  );
};

const mapStateToProps = (state) => {
  const { userLogin, postDelete, postLike, postUnlike } = state;
  return { userLogin, postDelete, postLike, postUnlike };
};

const mapDispatchToProps = (dispatch) => {
  return {
    likePost: (id) => dispatch(likePost(id)),
    unLikePost: (id) => dispatch(unLikePost(id)),
    removePost: (id) => dispatch(removePost(id)),
    resetLikePost: () => dispatch(resetLikePost()),
    resetUnlikePost: () => dispatch(resetUnlikePost()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Post);
