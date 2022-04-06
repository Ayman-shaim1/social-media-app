import React, { useState, useEffect } from "react";
import { ListGroup, Form } from "react-bootstrap";
import StartNewConvertationItem from "./StartNewConvertationItem";
import { connect } from "react-redux";
import { getFollowers } from "../../redux/user/userActions";
import useAlert from "../../hooks/useAlert";
import Loader from "../Loader";
const StartNewConvertationContainer = ({
  getFollowers,
  userGetFollowers,
  show,
}) => {
  // hooks :
  const showAlert = useAlert();
  // states :
  const [isCallApi, setIsCallApi] = useState(false);
  const [search, setSearch] = useState("");
  // redux states :
  const { loading, error, users } = userGetFollowers;
  useEffect(() => {
    if (!isCallApi) {
      getFollowers();
      setIsCallApi(true);
    }
    if (error) {
      showAlert({
        type: "danger",
        title: "error",
        content: error,
      });
    }
  }, [error, showAlert, isCallApi, getFollowers]);

  return (
    <div className={!show ? "d-block" : "d-none"}>
      <div className="mb-2">
        <Form.Control
          size="sm"
          placeholder="search users ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <div className="mt-5 pt-2">
          <div className="mt-5 pt-3">
            <div className="mt-5">
              <Loader size="md" />
            </div>
          </div>
        </div>
      ) : (
        users.length > 0 && (
          <ListGroup className="start-new-conv-container">
            {search !== ""
              ? users
                  .filter((u) =>
                    String(u.user.name)
                      .toLocaleLowerCase()
                      .startsWith(search.toLocaleLowerCase())
                  )
                  .map((user) => (
                    <StartNewConvertationItem key={user.user._id} user={user} />
                  ))
              : users.map((user) => (
                  <StartNewConvertationItem key={user.user._id} user={user} />
                ))}
          </ListGroup>
        )
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userGetFollowers: state.userGetFollowers,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getFollowers: () => dispatch(getFollowers()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StartNewConvertationContainer);
