import React, { useEffect } from "react";
import { ListGroup, Alert, Button } from "react-bootstrap";
import {
  deleteNotification,
  resetDeleteNotification,
} from "../redux/notification/notificationActions";
import { connect } from "react-redux";
import useAlert from "../hooks/useAlert";

const NotificationsDropDown = ({
  notificationList,
  deleteNotification,
  show,
  notificationDelete,
}) => {
  // hooks :
  const showAlert = useAlert();

  // redux states:
  const { notifications } = notificationList;
  const { error, success, loading } = notificationDelete;

  const deleteNotificationHandler = (id) => {
    deleteNotification(id);
  };

  useEffect(() => {
    if (error) {
      showAlert({
        type: "danger",
        title: "error",
        content: error,
      });

      resetDeleteNotification();
    }
    if (success) {
      resetDeleteNotification();
    }
  }, [error, showAlert, success]);

  return (
    <ListGroup
      className={`drp-notificatons position-absolute ${
        show ? "d-block" : "d-none"
      }`}>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <ListGroup.Item
            className="drp-notificatons-item"
            key={notification.notification._id}
            active={!notification.notification.isSeen ? true : false}>
            <div className="d-flex align-items-center justify-content-between drp-notifications-item-header">
              <h6 className="mt-2">{notification.notification.title}</h6>
              <Button
                size="sm"
                variant={notification.notification.isSeen ? "light" : "primary"}
                disabled={loading ? true : false}
                className="text-danger btn-delete-notification"
                onClick={() =>
                  deleteNotificationHandler(notification.notification._id)
                }>
                <i className="fas fa-trash"></i>
              </Button>
            </div>
            <small
              dangerouslySetInnerHTML={{
                __html: notification.notification.text_content,
              }}></small>
          </ListGroup.Item>
        ))
      ) : (
        <div className="p-3">
          <Alert variant="danger" className="mt-5">
            <div className="d-flex justify-content-center">
              <h1>
                <i className="fa-solid fa-bell-slash"></i>
              </h1>
            </div>
            <div className="d-flex justify-content-center">
              <h5>No notification exists</h5>
            </div>
          </Alert>
        </div>
      )}
    </ListGroup>
  );
};

const mapStateToProps = (state) => {
  const { notificationList, notificationDelete } = state;
  return { notificationList, notificationDelete };
};
const mapDipatchTopProps = (dispatch) => {
  return {
    deleteNotification: (id) => dispatch(deleteNotification(id)),
    resetDeleteNotification: () => dispatch(resetDeleteNotification()),
  };
};

export default connect(
  mapStateToProps,
  mapDipatchTopProps
)(NotificationsDropDown);
