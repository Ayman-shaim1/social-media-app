import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import useAlert from "../../hooks/useAlert";
import useDialog from "../../hooks/useDialog";
import {
  changePasswordUser,
  resetChangePasswordUser,
} from "../../redux/user/userActions";
import { connect } from "react-redux";
import Loader from "../Loader";

const ChangePassword = ({
  changePasswordUser,
  resetChangePasswordUser,
  userChangePassword,
}) => {
  // hooks :
  const showAlert = useAlert();
  const showDialog = useDialog();
  // states:
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // redux states:
  const { loading, error, success } = userChangePassword;

  const submitHandler = (e) => {
    e.preventDefault();
    if (confirmNewPassword === newPassword) {
      showDialog({
        title: "Confirmation",
        content: "Are you sure you want to change your password ?",
        onYes: () => {
          changePasswordUser(currentPassword, newPassword);
        },
      });
    } else {
      showAlert({
        type: "danger",
        title: "error",
        content: "Passwords do not match !",
      });
    }
  };

  useEffect(() => {
    if (error) {
      showAlert({
        type: "danger",
        title: "error",
        content: error,
      });
      setTimeout(() => {
        resetChangePasswordUser();
      }, 1500);
    }

    if (success) {
      showAlert({
        title: "alert",
        type: "success",
        content: "your password have been changed with seccuessfuly",
      });
      resetChangePasswordUser();
      setConfirmNewPassword("");
      setCurrentPassword("");
      setNewPassword("");
    }
  }, [error, showAlert, success, resetChangePasswordUser]);

  return (
    <Form onSubmit={submitHandler}>
      {loading && <Loader />}
      <Form.Group>
        <Form.Label>current password</Form.Label>
        <Form.Control
          type="password"
          placeholder="enter current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>new password</Form.Label>
        <Form.Control
          type="password"
          placeholder="enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>confirm new password</Form.Label>
        <Form.Control
          type="password"
          placeholder="enter confirm new password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
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
  const { userChangePassword } = state;
  return { userChangePassword };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changePasswordUser: (currentPassword, newPassword) =>
      dispatch(changePasswordUser(currentPassword, newPassword)),
    resetChangePasswordUser: () => dispatch(resetChangePasswordUser()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
