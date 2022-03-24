import React, { useState, useEffect } from "react";
import { Button, Form, Image, Alert } from "react-bootstrap";
import useAlert from "../../hooks/useAlert";
import useDialog from "../../hooks/useDialog";
import { connect } from "react-redux";
import Loader from "../Loader";
import {
  changeAvatarUser,
  resetChangeAvatarUser,
} from "../../redux/user/userActions";
const ChangeAvatar = ({
  changeAvatarUser,
  resetChangeAvatarUser,
  userChangeAvatar,
}) => {
  // hooks :
  const showAlert = useAlert();
  const showDialog = useDialog();
  // states :
  const [avatar, setAvatar] = useState(null);
  const [avatarSrc, setAvatarSrc] = useState("");
  // redux states:
  const { loading, error, success } = userChangeAvatar;

  const uploadFileHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const tmppath = URL.createObjectURL(file);
      setAvatarSrc(tmppath);
    } else {
      setAvatarSrc("");
      setAvatar(null);
    }
  };

  const removeAvatarHandler = () => {
    setAvatarSrc("");
    setAvatar(null);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    showDialog({
      title: "Confirmation",
      content: "Are you sure you want to change your avatar ?",
      onYes: () => {
        if (avatar) changeAvatarUser(avatar);
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
      setTimeout(() => {
        resetChangeAvatarUser();
      }, 1500);
    }

    if (success) {
      showAlert({
        title: "alert",
        type: "success",
        content: "your avatar have been changed with seccuessfuly",
      });
      resetChangeAvatarUser();
      setAvatar(null);
      setAvatarSrc("");
    }
  }, [error, showAlert, success, resetChangeAvatarUser]);

  return (
    <Form onSubmit={submitHandler}>
      {loading && <Loader />}
      {!avatar ? (
        <Alert variant="info">
          <div className="d-flex justify-content-center">
            <h5>
              <i className="fas fa-info"></i> choose image for your avatar
            </h5>
          </div>
        </Alert>
      ) : (
        <div className="d-flex justify-content-center mb-2">
          <div className="w-75 position-relative">
            <Image src={avatarSrc} className="w-100" rounded />
            <Button
              className="position-absolute end-0 m-1"
              size="sm"
              variant="danger"
              onClick={removeAvatarHandler}>
              x
            </Button>
          </div>
        </div>
      )}

      <Form.Group>
        <Form.Control type="file" onChange={uploadFileHandler} />
      </Form.Group>

      <div className="mt-2 d-grid gap-2">
        <Button size="sm" type="submit">
          change
        </Button>
      </div>
    </Form>
  );
};

const mapStateToProps = (state) => {
  const { userChangeAvatar } = state;
  return { userChangeAvatar };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeAvatarUser: (file) => dispatch(changeAvatarUser(file)),
    resetChangeAvatarUser: () => dispatch(resetChangeAvatarUser()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeAvatar);
