import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import ProtectedRoute from "./routes/ProtectedRoute";

import Header from "./components/Header";
import Alert from "./components/Alert";
import Dialog from "./components/Dialog";

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
const App = () => {
  // redux states :
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  return (
    <BrowserRouter>
      {userInfo && <Header />}
      <main className="p-2">
        <Alert />
        <Dialog />

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

export default App;
