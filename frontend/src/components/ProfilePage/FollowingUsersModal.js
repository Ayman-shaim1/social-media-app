import React from "react";
import { Modal, Alert } from "react-bootstrap";
import UserItemFollowings from "./UserItemFollowings";

const FollowingUsersModal = ({ title, showUsers, hideUsers, users,isUserProfile }) => {
  return (
    <Modal show={showUsers} onHide={hideUsers}  centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {users.length > 0 ? (
          <div className="">
            {users.map((user) => (
              <UserItemFollowings user={user.user} key={user.user._id} isUserProfile={isUserProfile} />
            ))}
          </div>
        ) : (
          <Alert className="p-4" variant="danger">
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




export default FollowingUsersModal