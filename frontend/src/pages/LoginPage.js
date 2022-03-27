import React, { useState, useEffect } from "react";
import { Form, Card, Button, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../redux/user/userActions";
import useAlert from "../hooks/useAlert";

import Loader from "../components/Loader";

const LoginPage = ({ login, userLogin }) => {
  // states :
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // hooks :
  const showAlert = useAlert();
  const navigate = useNavigate();
  // redux states:
  const { loading, error, userInfo } = userLogin;

  const submitHandler = (e) => {
    e.preventDefault();
    if (email && password) login(email, password);
    else
      showAlert({
        type: "danger",
        title: "alert",
        content: "Please enter the email and the password",
      });
  };

  useEffect(() => {
    if (error) {
      showAlert({
        type: "danger",
        title: "alert",
        content: error,
      });
    }
    if (userInfo) {
      navigate("/home");
    }
  }, [error, userInfo, showAlert, navigate]);

  return (
    <Row>
      <Col xl={3} lg={3} md={3} sm={12}></Col>
      <Col xl={6} lg={6} md={6} sm={12}>
        <Card>
          <Card.Body>
            {loading && <Loader />}
            <div className="d-flex justify-content-center mt-1">
              <h3>Login here !</h3>
            </div>
            <Form onSubmit={submitHandler}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  placeholder="Enter password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <div className="d-grid gap-2 mt-2">
                <Button type="submit">sign in</Button>
              </div>
              <hr />
              <div className="d-flex  justify-content-center mt-2">
                New Customer &nbsp;<Link to="/register">Register</Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
      <Col xl={3} lg={3} md={3} sm={12}></Col>
    </Row>
  );
};
const mapStateToProps = (state) => {
  const { userLogin } = state;
  return { userLogin };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (email, password) => dispatch(login(email, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
