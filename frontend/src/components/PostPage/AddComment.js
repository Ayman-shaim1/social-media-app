import React, { useState, useEffect } from "react";
import { Alert, Form, Button } from "react-bootstrap";
import { commentPost } from "../../redux/post/postActions";
import { connect } from "react-redux";
import useAlert from "../../hooks/useAlert";
import Loader from "../Loader";
const AddComment = ({ postId, commentPost, postAddComment }) => {
  // hooks:
  const showAlert = useAlert();
  // states:
  const [text, setText] = useState("");
  // redux states :
  const { loading, error } = postAddComment;

  const submitHandler = (e) => {
    e.preventDefault();
    commentPost(postId, text);
    setText("");
  };

  useEffect(() => {
    if (error) {
      showAlert({
        type: "danger",
        title: "error",
        content: error,
      });
    }
  }, [error]);

  return (
    <>
      <Alert variant="info">
        <h5>
          <i className="fas fa-info"></i> Leave a comment here
        </h5>
      </Alert>
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Control
          as="textarea"
          placeholder="comment on this post"
          className="mb-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="d-grid gap-2">
          <Button size="sm" type="submit">
            comment
          </Button>
        </div>
      </Form>
    </>
  );
};

const mapStateToProps = (state) => {
  const { postAddComment } = state;
  return {
    postAddComment,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    commentPost: (id, text) => dispatch(commentPost(id, text)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AddComment);
