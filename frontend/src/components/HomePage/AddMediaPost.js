import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Container } from "react-bootstrap";
import { createPost, resetCreatePost } from "../../redux/post/postActions";
import { connect } from "react-redux";
import useAlert from "../../hooks/useAlert";
import Loader from "../Loader";
import Video from "../Video";

const AddMediaPost = ({
  show,
  hideModal,
  createPost,
  postCreate,
  resetCreatePost,
}) => {
  // hooks :
  const showAlert = useAlert();
  // states :
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState("");
  // redux states :
  const { error, loading, success } = postCreate;

  const uploadFileHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
      const tmppath = URL.createObjectURL(file);
      setMediaUrl(tmppath);
      if (file.type.search("image") !== -1) {
        setMediaType("image");
      } else {
        setMediaType("video");
      }
    } else {
      setMediaUrl("");
      setMedia(null);
    }
  };

  const removeMediaPost = () => {
    setMediaUrl("");
    setMedia(null);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (media != null) {
      createPost(text, media);
      setText("");
      setMedia(null);
      resetCreatePost();
    } else {
      showAlert({
        type: "danger",
        title: "error",
        content: "you must choose a video or an image for your post",
      });
      resetCreatePost();
    }
  };

  useEffect(() => {
    if (error) {
      showAlert({
        type: "danger",
        title: "error",
        content: error,
      });
    }

    if (!show) {
      setMediaUrl("");
      setMedia(null);
      setText("");
      resetCreatePost();
    }
    if (success) {
      hideModal();
    }
  }, [error, show, success]);

  return (
    <Modal show={show} fullscreen={true} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Add media Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          {loading && <Loader />}
          <Form onSubmit={submitHandler}>
            <Form.Label>Post text</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Enter post text ..."
              className="mb-4"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <Form.Label className="">choose a photo or video</Form.Label>
            <Form.Control
              type="file"
              accept="image/gif, image/jpeg, image/png, video/mp4"
              onChange={uploadFileHandler}
            />
            <div
              className={`choosen-file-container position-relative mt-3 ${
                mediaUrl !== "" ? "d-block" : "d-none"
              }`}>
              <Button
                variant="danger"
                size="sm"
                className="position-absolute end-0 m-1"
                onClick={removeMediaPost}>
                <i className="fas fa-times"></i>
              </Button>
              {mediaType === "image" && (
                <img src={mediaUrl} alt="choosen-media" />
              )}
              {mediaType === "video" && <Video src={mediaUrl} />}
            </div>
            <div className="d-grid gap-2 mt-2">
              <Button type="submit" size="sm">
                add post
              </Button>
            </div>
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(AddMediaPost);
