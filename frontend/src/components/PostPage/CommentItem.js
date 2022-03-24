import React, { useEffect } from "react";
import Avatar from "../Avatar";
import { useSelector, useDispatch } from "react-redux";
import useAlert from "../../hooks/useAlert";
import {
  resetDeleteCommentFromPost,
  deleteCommentFromPost,
} from "../../redux/post/postActions";
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import useDialog from "../../hooks/useDialog";

const CommentItem = ({ comment, idPost }) => {
  // hooks :
  const showAlert = useAlert();
  const showDialog = useDialog();

  const dispatch = useDispatch();
  // redux states:
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const postDeleteComment = useSelector((state) => state.postDeleteComment);
  const { success, error } = postDeleteComment;

  const deleteCommentHandler = () => {
    showDialog({
      title: "Confirmation",
      content: "Are you sure you want to delete this comment",
      onYes: function () {
        dispatch(deleteCommentFromPost(idPost, comment._id));
      },
    });
  };
  useEffect(() => {
    if (error) {
      showAlert({
        type: "danger",
        title: "error",
        content: error,
      });
      dispatch(resetDeleteCommentFromPost());
    }
    if (success) {
      dispatch(resetDeleteCommentFromPost());
    }
  }, [success, error, dispatch]);

  return (
    <Card className="mb-2">
      <Card.Header bg="light" className="d-flex justify-content-between">
        <div className="d-flex align-items-center">
          <Link to={`/profile/${comment.user._id}`}>
            <Avatar image={comment.user.avatar} />
          </Link>
          <Link to={`/profile/${comment.user._id}`}>
            <strong className="m-2">{comment.user.name}</strong>
          </Link>
        </div>
      </Card.Header>
      <Card.Body>
        <small>{comment.text}</small>
        <hr />
        <div className="d-flex align-items-center justify-content-between">
          <span>
            <small>posted on {new Date(comment.date).toDateString()}</small>
          </span>
          {userInfo && String(userInfo._id) === String(comment.user._id) && (
            <Button variant="danger" size="sm" onClick={deleteCommentHandler}>
              <i className="fas fa-times"></i>
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default CommentItem;
