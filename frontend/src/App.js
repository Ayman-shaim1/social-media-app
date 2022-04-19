import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { connect, useDispatch } from "react-redux";

import ProtectedRoute from "./routes/ProtectedRoute";

import Header from "./components/Header";
import Alert from "./components/Alert";
import Dialog from "./components/Dialog";
import SharePostContainer from "./components/SharePostContainer";
import MessagesToastsContainer from "./components/MessagesToastsContainer";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MessagesPage from "./pages/MessagesPage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import FindFriendsPage from "./pages/FindFriendsPage";
import RequestsPage from "./pages/RequestsPage";
import NotFoundPage from "./pages/NotFoundPage";

import { seenToastMessages } from "./redux/message/messageActions";

import {
  MESSAGE_GET_LIST_UPDATE_PUSH,
  MESSAGE_GET_CONVERTATIONS_UPDATE_MESSAGE,
  MESSAGE_GET_NOTSEEN_COUNT_SUCCESS,
  MESSAGE_GET_NOTSEEN_UPDATE_PUSH,
} from "./redux/message/messageTypes";

import { NOTIFICATION_GET_LIST_UPDATE_PUSH } from "./redux/notification/notificationTypes";
import {
  AVATAR_ONLINE_LOGIN_UPDATE,
  AVATAR_ONLINE_LOGOUT_UPDATE,
} from "./redux/avatar-online/avatarOnlineTypes";

import {
  CONVERTATION_UPDATE_SET_ONLINE,
  CONVERTATION_UPDATE_SET_OFFLINE,
} from "./redux/convertation/convertationTypes";

import { io } from "socket.io-client";

const SERVER = "https://socialmedia01.herokuapp.com/";
const socket = io(SERVER);

console.log(process.env.APP_URL);

const App = ({
  userLogin,
  convertation,
  seenToastMessages,
  messageGetConvertations,
  messageGetNotSeen,
  avatarOnline,
}) => {
  // hooks :
  const dispatch = useDispatch();
  // states :
  const [isConnect, setIsConnect] = useState(false);

  // redux states :
  const { userInfo } = userLogin;
  const { user: userConvertation, isOpen } = convertation;
  const { convertations } = messageGetConvertations;
  const { nbr } = messageGetNotSeen;
  const { avatars } = avatarOnline;

  useEffect(() => {
    if (userInfo) {
      if (!isConnect) {
        socket.emit("user-connect", userInfo._id);
        setIsConnect(true);
        seenToastMessages();
      }
    }

    socket.removeListener("client-user-connect");
    socket.removeListener("client-user-disconnect");
    socket.removeListener("receive-message");
    socket.removeListener("receive-notification");

    socket.on("receive-message", (obj) => {
      const { senderUser, receivedUserId, message } = obj;

      if (String(userInfo._id) === String(receivedUserId)) {
        message.message_from = senderUser;
        seenToastMessages();
        seenToastMessages();
        dispatch({
          type: MESSAGE_GET_NOTSEEN_UPDATE_PUSH,
          payload: message,
        });

        const index = convertations.findIndex(
          (c) => String(c.user._id) === String(senderUser._id)
        );
        if (isOpen) {
          if (String(senderUser._id) === String(userConvertation._id)) {
            message.isSeen = true;
            dispatch({
              type: MESSAGE_GET_CONVERTATIONS_UPDATE_MESSAGE,
              payload: {
                user: senderUser,
                message: message,
                isConvExiste: index !== -1 ? true : false,
              },
            });

            dispatch({
              type: MESSAGE_GET_LIST_UPDATE_PUSH,
              payload: message,
            });
          } else {
            dispatch({
              type: MESSAGE_GET_NOTSEEN_COUNT_SUCCESS,
              payload: nbr + 1,
            });
            dispatch({
              type: MESSAGE_GET_CONVERTATIONS_UPDATE_MESSAGE,
              payload: {
                user: senderUser,
                message: message,
                isConvExiste: index !== -1 ? true : false,
              },
            });
          }
        } else {
          dispatch({
            type: MESSAGE_GET_NOTSEEN_COUNT_SUCCESS,
            payload: nbr + 1,
          });

          dispatch({
            type: MESSAGE_GET_CONVERTATIONS_UPDATE_MESSAGE,
            payload: {
              user: senderUser,
              message: message,
              isConvExiste: index !== -1 ? true : false,
            },
          });
        }
      }
    });

    socket.on("receive-notification", (obj) => {
      const { receivedUserId, notification } = obj;
      if (String(userInfo._id) === String(receivedUserId)) {
        dispatch({
          type: NOTIFICATION_GET_LIST_UPDATE_PUSH,
          payload: { notification: notification, _id: null },
        });
      }
    });

    socket.on("client-user-connect", (id) => {
      if (id !== null && String(userInfo._id) !== String(id)) {
        if (userConvertation && String(userConvertation._id) === String(id)) {
          dispatch({
            type: CONVERTATION_UPDATE_SET_ONLINE,
          });
        }

        dispatch({
          type: AVATAR_ONLINE_LOGIN_UPDATE,
          payload: id,
        });
      }
    });

    socket.on("client-user-disconnect", (id) => {
      if (id !== null && String(userInfo._id) !== String(id)) {
        if (userConvertation && String(userConvertation._id) === String(id)) {
          dispatch({
            type: CONVERTATION_UPDATE_SET_OFFLINE,
          });
        }
        dispatch({
          type: AVATAR_ONLINE_LOGOUT_UPDATE,
          payload: id,
        });
      }
    });
  }, [
    isConnect,
    seenToastMessages,
    isOpen,
    userConvertation,
    nbr,
    avatars,
    userInfo,
    convertations,
    dispatch,
  ]);

  return (
    <BrowserRouter>
      {userInfo && <Header />}
      <Alert />
      <Dialog />
      <SharePostContainer />
      {window.location.pathname.toLowerCase() !== "/messages" && (
        <MessagesToastsContainer />
      )}
      <main className="p-2">
        <Container fluid>
          <Routes>
            <Route exact path="/Login" element={<LoginPage />} />
            <Route exact path="/Register" element={<RegisterPage />} />
            <Route
              exact
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              exact
              path="/Home"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />

            <Route
              exact
              path="/requests"
              element={
                <ProtectedRoute>
                  <RequestsPage />
                </ProtectedRoute>
              }
            />

            <Route
              exact
              path="/find-friends"
              element={
                <ProtectedRoute>
                  <FindFriendsPage />
                </ProtectedRoute>
              }
            />

            <Route
              exact
              path="/findfriends"
              element={
                <ProtectedRoute>
                  <FindFriendsPage />
                </ProtectedRoute>
              }
            />

            <Route
              exact
              path="/find-friends/:search"
              element={
                <ProtectedRoute>
                  <FindFriendsPage />
                </ProtectedRoute>
              }
            />

            <Route
              exact
              path="/findfriends/:search"
              element={
                <ProtectedRoute>
                  <FindFriendsPage />
                </ProtectedRoute>
              }
            />

            <Route
              exact
              path="/Messages"
              element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              }
            />
            <Route
              exact
              path="/Messages/:user_id"
              element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              }
            />
            <Route
              exact
              path="/Messages/:user_id/:post_id"
              element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              }
            />
            <Route
              exact
              path="/Post/:id"
              element={
                <ProtectedRoute>
                  <PostPage />
                </ProtectedRoute>
              }
            />
            <Route
              exact
              path="/Settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              exact
              path="/Profile/:id"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Container>
      </main>
    </BrowserRouter>
  );
};

const mapStateToProps = (state) => {
  return {
    avatarOnline: state.avatarOnline,
    userLogin: state.userLogin,
    convertation: state.convertation,
    messageGetConvertations: state.messageGetConvertations,
    messageGetNotSeen: state.messageGetNotSeen,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    seenToastMessages: () => dispatch(seenToastMessages()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
