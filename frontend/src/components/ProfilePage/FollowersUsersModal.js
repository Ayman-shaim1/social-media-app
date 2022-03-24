import React from "react";
import { Modal, Alert } from "react-bootstrap";
import UserItemFollowers from "./UserItemFollowers";

const FollowersUsersModal = ({
  title,
  showUsers,
  hideUsers,
  users,
  isUserProfile,
}) => {
  return (
    <Modal show={showUsers} onHide={hideUsers} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {users.length > 0 ? (
          <div className="">
            {users.map((user) => (
              <UserItemFollowers
                user={user.user}
                key={user.user._id}
                isUserProfile={isUserProfile}
              />
            ))}
          </div>
        ) : (
          <Alert className="p-4" variant="info">
            <div className="p-4">
              <div className="d-flex justify-content-center">
                <h5>users not found !</h5>
              </div>
            </div>
          </Alert>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default FollowersUsersModal;
