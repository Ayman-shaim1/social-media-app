import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import useAlert from "../../hooks/useAlert";
import useDialog from "../../hooks/useDialog";
import {
  changeNameUser,
  resetChangeNameUser,
} from "../../redux/user/userActions";
import { connect } from "react-redux";
import Loader from "../Loader";

const ChangeName = ({
  changeNameUser,
  resetChangeNameUser,
  userChangeName,
  userLogin,
}) => {
  // hooks :
  const showAlert = useAlert();
  const showDialog = useDialog();
  // redux states:
  const { loading, error, success } = userChangeName;
  const { userInfo } = userLogin;
  // states:
  const [name, setName] = useState(userInfo.name);

  const submitHandler = (e) => {
    e.preventDefault();
    showDialog({
      title: "Confirmation",
      content: "Are you sure you want to change your name ?",
      onYes: () => {
        if (name !== "") changeNameUser(name);
        else
          showAlert({
            type: "danger",
            title: "error",
            content: "you have to enter you name",
          });
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
    }

    if (success) {
      showAlert({
        title: "alert",
        type: "success",
        content: "your name have been changed with successfully",
      });
      resetChangeNameUser();
    }
  }, [error, showAlert, success, resetChangeNameUser]);

  return (
    <Form onSubmit={submitHandler}>
      {loading && <Loader />}
      <Form.Group>
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="enter a name"
          style={{
            color: `${userInfo.name === name ? "darkgray" : "#000"}`,
            fontWeight: `${userInfo.name !== name ? "bold" : "normal"}`,
          }}
          value={name}
          onChange={(e) => setName(e.target.value)}
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
  const { userLogin, userChangeName } = state;
  return { userLogin, userChangeName };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeNameUser: (name) => dispatch(changeNameUser(name)),
    resetChangeNameUser: () => dispatch(resetChangeNameUser()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeName);
