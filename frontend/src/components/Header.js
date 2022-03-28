import React, { useState, useEffect } from "react";
import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
  Badge,
  InputGroup,
  Form,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { logout, findUsers, resetFindUser } from "../redux/user/userActions";
import {
  getListNotifications,
  resetGetListNotification,
  seenAllNotifications,
} from "../redux/notification/notificationActions";
import { NOTIFICATION_GET_LIST_SEEN_UPDATE } from "../redux/notification/notificationTypes";
import { Link } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import useAlert from "../hooks/useAlert";

import NotificationsDropDown from "./NotificationsDropDown";
import UsersDropdown from "./UsersDropdown";

const Header = ({
  logout,
  userLogin,
  notificationList,
  getListNotifications,
  resetGetListNotification,
  seenAllNotifications,
  userFind,
  findUsers,
  resetFindUser,
}) => {
  // hooks :
  const showAlert = useAlert();
  const dispatch = useDispatch();

  // states :
  const [isCallApi, setIsCallApi] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchUsers, setShowSearchUsers] = useState(false);

  const [search, setSearch] = useState("");

  // redux states :
  const { userInfo } = userLogin;
  const { error: notificationListError, notifications } = notificationList;
  const { error: userFindError } = userFind;

  const showNotificationsHandler = (e) => {
    e.preventDefault();
    setShowNotifications(!showNotifications);
    if (showNotifications) {
      dispatch({ type: NOTIFICATION_GET_LIST_SEEN_UPDATE });
    }
    if (showSearchUsers) {
      setShowSearchUsers(false);
      setSearch("");
    }
  };

  const changeFindUsersHandler = (e) => {
    setSearch(e.target.value);
    if (e.target.value !== "") {
      findUsers(e.target.value);
      setShowSearchUsers(true);
    } else {
      setShowSearchUsers(false);
    }

    if (showNotifications) {
      setShowNotifications(false);
    }
  };

  const hideNotificationAndSearchUsersHandler = () => {
    if (showNotifications) {
      dispatch({ type: NOTIFICATION_GET_LIST_SEEN_UPDATE });
      setShowNotifications(false);
    }
    if (showSearchUsers) {
      setShowSearchUsers(false);
      resetFindUser();
      setSearch("");
    }
  };

  useEffect(() => {
    if (notificationListError) {
      showAlert({
        type: "danger",
        title: "error",
        content: notificationListError,
      });
      resetGetListNotification();
    }
    if (!isCallApi) {
      setIsCallApi(true);
      getListNotifications();
    }

    if (showNotifications) {
      seenAllNotifications();
    }

    if (userFindError) {
      showAlert({
        type: "danger",
        title: "error",
        content: userFindError,
      });
      resetFindUser();
    }
  }, [
    resetFindUser,
    showNotifications,
    userFindError,
    seenAllNotifications,
    isCallApi,
    notificationListError,
    resetGetListNotification,
    showAlert,
    getListNotifications,
  ]);

  return (
    <Navbar bg="light" expand="lg" className="position-relative">
      <Container fluid>
        <LinkContainer to="/" onClick={hideNotificationAndSearchUsersHandler}>
          <Navbar.Brand href="#">Socila Media</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle
          aria-controls="sm-navbar"
          className="mb-2"
          onClick={hideNotificationAndSearchUsersHandler}
        />
        <Navbar.Collapse>
          <Form className="w-100">
            <InputGroup>
              <Form.Control
                placeholder="search users ..."
                value={search}
                onChange={changeFindUsersHandler}
              />
              <LinkContainer to={`/find-friends/${search}`}>
                <Link
                  className="btn btn-primary"
                  to=""
                  onClick={hideNotificationAndSearchUsersHandler}>
                  <i className="fas fa-search"></i>
                </Link>
              </LinkContainer>
            </InputGroup>
          </Form>
          <UsersDropdown
            show={showSearchUsers}
            hide={hideNotificationAndSearchUsersHandler}
          />
        </Navbar.Collapse>
        <Navbar.Collapse id="sm-navbar">
          <Nav className="me-auto my-2 navbar-nav w-100 justify-content-end">
            <LinkContainer
              to="/"
              onClick={hideNotificationAndSearchUsersHandler}>
              <Nav.Link>
                <i className="mr-1 fas fa-home mr-1"></i>Home
              </Nav.Link>
            </LinkContainer>

            <Nav.Link
              active={showNotifications ? true : false}
              onClick={showNotificationsHandler}>
              <i className="mr-1 fa-solid fa-bell"></i> Notifications
              {notifications.filter((n) => !n.notification.isSeen).length >
                0 && (
                <Badge>
                  {notifications.filter((n) => !n.notification.isSeen).length}
                </Badge>
              )}
            </Nav.Link>
            <NotificationsDropDown
              show={showNotifications}
              showDrp={showNotificationsHandler}
            />
            <LinkContainer
              to="/messages"
              onClick={hideNotificationAndSearchUsersHandler}>
              <Nav.Link>
                <i className="mr-1 fa-solid fa-envelope"></i>Messages
                <Badge>0</Badge>
              </Nav.Link>
            </LinkContainer>

            <NavDropdown
              title={`Hello ${userInfo && userInfo.name} !`}
              onClick={hideNotificationAndSearchUsersHandler}
              id="sm-navdrp">
              <LinkContainer to={`/profile/${userInfo && userInfo._id}`}>
                <NavDropdown.Item>
                  <i className="fa-solid fa-user"></i> profile
                </NavDropdown.Item>
              </LinkContainer>

              <LinkContainer to="/find-friends">
                <NavDropdown.Item>
                  <i className="mr-1 fas fa-users mr-1"></i>Find firends
                </NavDropdown.Item>
              </LinkContainer>

              <LinkContainer to={`/requests`}>
                <NavDropdown.Item>
                  <i className="fa-solid fa-address-book"></i> requests
                </NavDropdown.Item>
              </LinkContainer>

              <LinkContainer to="/settings">
                <NavDropdown.Item>
                  <i className="fa-solid fa-gear"></i> settings
                </NavDropdown.Item>
              </LinkContainer>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logout}>
                <i className="fa-solid fa-arrow-right-from-bracket"></i>logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
const mapStateToProps = (state) => {
  const { userLogin, notificationList, userFind } = state;
  return { userLogin, notificationList, userFind };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
    getListNotifications: () => dispatch(getListNotifications()),
    findUsers: (arg) => dispatch(findUsers(arg)),
    seenAllNotifications: () => dispatch(seenAllNotifications()),
    resetFindUser: () => dispatch(resetFindUser()),
    resetGetListNotification: () => dispatch(resetGetListNotification()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Header);
