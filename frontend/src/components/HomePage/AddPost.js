import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { Card, Form } from "react-bootstrap";
import AddMediaPost from "./AddMediaPost";
import { createPost, resetCreatePost } from "../../redux/post/postActions";
import { connect } from "react-redux";
import useAlert from "../../hooks/useAlert";
import Loader from "../Loader";
const AddPost = ({ createPost, postCreate, resetCreatePost }) => {
  // hooks :
  const showAlert = useAlert();
  // states :
  const [show, setShow] = useState(false);
  const [text, setText] = useState("");
  // redux states :
  const { loading, error, success } = postCreate;

  const hideModal = () => {
    setShow(false);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    createPost(text, null);

    setText("");
  };

  useEffect(() => {
    if (error) {
      showAlert({
        type: "danger",
        title: "error",
        content: error,
      });
      resetCreatePost();
    }

    if (success) {
      setText("");
      resetCreatePost();
    }
  }, [error, success, showAlert]);

  return (
    <Card className="mb-2">
      {loading && <Loader />}
      <AddMediaPost show={show} hideModal={hideModal} />
      <Card.Body>
        <Form onSubmit={submitHandler}>
          <Form.Control
            as="textarea"
            placeholder="what is in your mind ?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <hr />
          <div className="d-grid gap-2">
            <Button type="submit" size="sm">
              add post
            </Button>
          </div>
          <hr />
          <div className="d-grid gap-2">
            <Button size="sm" variant="light" onClick={() => setShow(true)}>
              add media post
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

const mapStateToProps = (state) => {
  const { postCreate } = state;
  return {
    postCreate,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createPost: (text, media) => dispatch(createPost(text, media)),
    resetCreatePost: () => dispatch(resetCreatePost()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddPost);
