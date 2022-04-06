import React, { useState } from "react";
import { Modal, Alert, Form } from "react-bootstrap";
import UserItemFollowings from "./UserItemFollowings";

const FollowingUsersModal = ({
  title,
  showUsers,
  hideUsers,
  users,
  isUserProfile,
}) => {
  // states :
  const [search, setSearch] = useState("");

  return (
    <Modal show={showUsers} onHide={hideUsers} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
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
        {users.length > 0 ? (
          <div
            style={{
              height: "400px",
              overflowY: "auto",
              padding: "10px",
            }}>
            {search === ""
              ? users.map((user) => (
                  <UserItemFollowings
                    isUserProfile={isUserProfile}
                    user={user.user}
                    key={user.user._id}
                  />
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
                    <UserItemFollowings
                      isUserProfile={isUserProfile}
                      user={user.user}
                      key={user.user._id}
                    />
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

export default FollowingUsersModal;
