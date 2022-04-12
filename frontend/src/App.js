import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { connect, useDispatch } from "react-redux";

import ProtectedRoute from "./routes/ProtectedRoute";

import Header from "./components/Header";
import Alert from "./components/Alert";
import Dialog from "./components/Dialog";
import SharePostContainer from "./components/SharePostContainer";

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
import { io } from "socket.io-client";

import {
  MESSAGE_GET_LIST_UPDATE_PUSH,
  MESSAGE_GET_CONVERTATIONS_UPDATE_MESSAGE,
  MESSAGE_GET_NOTSEEN_COUNT_SUCCESS,
} from "./redux/message/messageTypes";

import { NOTIFICATION_GET_LIST_UPDATE_PUSH } from "./redux/notification/notificationTypes";

const SERVER = "http://localhost:5000";
const socket = io(SERVER);

const App = ({
  userLogin,
  convertation,
  messageGetConvertations,
  messageGetNotSeen,
}) => {
  const dispatch = useDispatch();

  // redux states :
  const { userInfo } = userLogin;
  const { user: userConvertation, isOpen } = convertation;
  const { convertations } = messageGetConvertations;
  const { nbr } = messageGetNotSeen;

  useEffect(() => {
    socket.removeListener("receive-message");
    socket.removeListener("receive-notification");
    socket.on("receive-message", (obj) => {
      const { senderUser, receivedUserId, message } = obj;
      if (String(userInfo._id) === String(receivedUserId)) {
        const index = convertations.findIndex(
          (c) => String(c.user._id) === String(senderUser._id)
        );
        if (isOpen) {
          if (String(senderUser._id) === String(userConvertation._id)) {
            message.isSeen = true;
            console.log(message);
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
        console.log(notification);
        dispatch({
          type: NOTIFICATION_GET_LIST_UPDATE_PUSH,
          payload: { notification: notification, _id: null },
        });
      }
    });
  }, [isOpen, userConvertation, nbr, userInfo, convertations, dispatch]);

  return (
    <BrowserRouter>
      {userInfo && <Header />}
      <Alert />
      <Dialog />
      <SharePostContainer />
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
    userLogin: state.userLogin,
    convertation: state.convertation,
    messageGetConvertations: state.messageGetConvertations,
    messageGetNotSeen: state.messageGetNotSeen,
  };
};

export default connect(mapStateToProps, null)(App);
