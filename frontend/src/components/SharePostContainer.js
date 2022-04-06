import React, { useEffect, useState } from "react";
import SharePostUserItem from "./SharePostUserItem";
import { Modal, ListGroup, Form } from "react-bootstrap";
import { connect } from "react-redux";
import { closeSharePost } from "../redux/sharePost/sharePostActions";
import { getFollowers } from "../redux/user/userActions";
import { resetSendMessage } from "../redux/message/messageActions";

import Loader from "./Loader";
import useAlert from "../hooks/useAlert";

const SharePostContainer = ({
  sharePost,
  closeSharePost,
  getFollowers,
  userGetFollowers,
  resetSendMessage,
}) => {
  // hooks :
  const showAlert = useAlert();
  // states :
  const [isCallApi, setIsCallApi] = useState(false);
  const [search, setSearch] = useState("");

  // redux states :
  const { isOpen } = sharePost;
  const { loading, error, users } = userGetFollowers;

  const hideHandler = () => {
    closeSharePost();
    resetSendMessage();
  };

  useEffect(() => {
    if (!isCallApi) {
      setIsCallApi(true);
      getFollowers();
    }
    if (error) {
      showAlert({
        type: "danger",
        title: "error",
        content: error,
      });
    }
  }, [error, isCallApi, showAlert, getFollowers]);
  return (
    <Modal show={isOpen} onHide={hideHandler} centered>
      <Modal.Header closeButton>
        <Modal.Title>Share post to your friends</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <Form.Control
            placeholder="search users ..."
            size="sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {loading ? (
          <Loader size="md" />
        ) : (
          users.length > 0 && (
            <div
              style={{
                height: "400px",
                overflowY: "auto",
                padding: "10px",
              }}>
              <ListGroup>
                {search === ""
                  ? users.map((user) => (
                      <SharePostUserItem key={user.user._id} user={user} />
                    ))
                  : users
                      .filter(
                        (u) =>
                          String(u.user.name)
                            .toLocaleLowerCase()
                            .startsWith(search.toLocaleLowerCase()) ||
                          String(u.user.email)
                            .toLocaleLowerCase()
                            .startsWith(search.toLocaleLowerCase())
                      )
                      .map((user) => (
                        <SharePostUserItem key={user.user._id} user={user} />
                      ))}
              </ListGroup>
            </div>
          )
        )}
      </Modal.Body>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return {
    sharePost: state.sharePost,
    userGetFollowers: state.userGetFollowers,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeSharePost: () => dispatch(closeSharePost()),
    getFollowers: () => dispatch(getFollowers()),
    resetSendMessage: () => dispatch(resetSendMessage()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SharePostContainer);
