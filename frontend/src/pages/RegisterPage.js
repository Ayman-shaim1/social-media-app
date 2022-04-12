import React, { useState, useEffect } from "react";
import { Row, Col, Alert, Form, Card, Button, Image } from "react-bootstrap";
import useAlert from "../hooks/useAlert";
import { Link, useNavigate } from "react-router-dom";

import { register } from "../redux/user/userActions";
import { connect } from "react-redux";
import Loader from "../components/Loader";

const RegisterPage = ({ register, userRegister, userLogin }) => {
  // hooks :
  const showAlert = useAlert();
  const navigate = useNavigate();

  // states :
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarSrc, setAvatarSrc] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // redux states :
  const { loading, error } = userRegister;
  const { userInfo } = userLogin;

  const uploadFileHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const tmppath = URL.createObjectURL(file);
      setAvatarSrc(tmppath);
    } else {
      setAvatarSrc("");
      setAvatar(null);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      register(name, email, avatar, password);
    } else {
      showAlert({
        type: "danger",
        title: "error",
        content: "Passwords do not match !",
      });
    }
  };

  useEffect(() => {
    if (error) {
      showAlert({
        type: "danger",
        title: "error",
        content: error,
      });
    }

    if (userInfo) {
      navigate("/home");
    }
  }, [error,userInfo,navigate,showAlert]);

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-center mb-3">
        <h3>Register Here !</h3>
      </div>

      <Row>
        <Col xl={6} lg={6} md={12} sm={12}>
          <Alert variant="info" className="">
            <h4>Lorem ipsum dolor sit amet consectetur.</h4>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Aspernatur accusantium at molestias. Distinctio harum alias itaque
              dicta minus asperiores explicabo neque saepe. At, quasi
              distinctio, ut facere tempora sunt nobis quo voluptatum tenetur,
              consectetur saepe in voluptatibus excepturi. Cum libero earum sed
              ducimus. Nemo, dolorum! Quod illo reiciendis esse quis.
            </p>
            <hr />
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem,
              maiores! Et nobis, debitis laborum, quasi quae perspiciatis alias,
              numquam expedita dicta consequatur eos molestias quis autem
              reiciendis laudantium quas. Laudantium repellendus beatae
              recusandae minima optio.
            </p>
          </Alert>
        </Col>
        <Col xl={6} lg={6} md={12} sm={12}>
          <Card>
            <Card.Body>
              {loading && <Loader />}
              <Form onSubmit={submitHandler}>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
                {avatarSrc !== "" && (
                  <div className="d-flex justify-content-center">
                    <Image
                      src={avatarSrc}
                      fluid
                      rounded
                      className="mt-2 w-25"
                    />
                  </div>
                )}
                <Form.Group>
                  <Form.Label>Avatar</Form.Label>
                  <Form.Control type="file" onChange={uploadFileHandler} />
                </Form.Group>

                <Form.Group>
                  <Form.Label>password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>confirm password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Form.Group>

                <div className="d-grid gap-2 mt-2">
                  <Button size="sm" type="submit">
                    submit
                  </Button>
                </div>
                <hr />
                <div className="d-flex justify-content-center">
                  <p>
                    Already have an account? <Link to="/login">Sign In</Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { userRegister, userLogin } = state;
  return { userRegister, userLogin };
};

const mapDispatchToProps = (dispatch) => {
  return {
    register: (name, email, avatar, password) =>
      dispatch(register(name, email, avatar, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);
