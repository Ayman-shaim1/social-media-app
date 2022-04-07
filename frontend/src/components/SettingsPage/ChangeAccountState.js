import React, { useEffect } from "react";
import { Alert, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { changeAccountState } from "../../redux/user/userActions";
import useDialog from "../../hooks/useDialog";
import useAlert from "../../hooks/useAlert";
import Loader from "../Loader";
const ChangeAccountState = ({
  userLogin,
  userChangeAccountState,
  changeAccountState,
}) => {
  // hooks :
  const showAlert = useAlert();
  const showDialog = useDialog();
  // redux states :
  const { userInfo } = userLogin;
  const { loading, error, success } = userChangeAccountState;
  const changeStateHandler = () => {
    showDialog({
      title: "confirmation",
      content: "are you sure you want to change you account state ?",
      onYes: () => {
        changeAccountState();
      },
    });
  };
  useEffect(() => {
    if (error) {
      showAlert({
        type: "danger",
        tite: "error",
        content: error,
      });
    }
    if (success) {
      showAlert({
        type: "success",
        tite: "Alert",
        content: "your account state have been changed with successfully",
      });
    }
  }, [showAlert, error, success]);

  return (
    <Alert variant="info">
      <div className="p-5">
        <div className="p-2">
          {loading && (
            <div className="d-flex justify-content-center">
              <Loader size="md" />
            </div>
          )}

          <div className="d-flex justify-content-center">
            <h5>
              Your account is :{" "}
              {userInfo.isPrivateAccount ? "private" : "public"}
            </h5>
          </div>
          <div className="d-flex justify-content-center">
            <small>
              if you wanna change your account state click on this button below
            </small>
          </div>
          <div className="d-flex justify-content-center mt-4">
            <Button size="sm" onClick={changeStateHandler}>
              make your account{" "}
              {userInfo.isPrivateAccount ? "public" : "private"}
            </Button>
          </div>
        </div>
      </div>
    </Alert>
  );
};

const mapStateToProps = (state) => {
  return {
    userLogin: state.userLogin,
    userChangeAccountState: state.userChangeAccountState,
  };
};
const mapDispatchToProps = (dispatch) => {
  return { changeAccountState: () => dispatch(changeAccountState()) };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeAccountState);
