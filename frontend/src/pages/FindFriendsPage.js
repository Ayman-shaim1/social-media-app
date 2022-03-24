import React, { useState, useEffect } from "react";
import { Row, Col, Card, Form, Alert, Button } from "react-bootstrap";
import UserItem from "../components/FindFriendsPage/UserItem";
import { connect } from "react-redux";
import useAlert from "../hooks/useAlert";
import { findUsers } from "../redux/user/userActions";
import Loader from "../components/Loader";
const FindFriendsPage = ({ findUsers, userFind }) => {
  // hooks :
  const showAlert = useAlert();
  // states :
  const [search, setSearch] = useState("");
  // redux States :
  const { loading, error, users } = userFind;

  const searchHandler = (e) => {
    e.preventDefault();
    if (search) findUsers(search);
  };

  useEffect(() => {
    if (error) {
      showAlert({
        type: "danger",
        title: "error",
        content: error,
      });
    }
  }, [showAlert, error]);

  return (
    <Row>
      <Col xl={3} lg={3} md={2} sm={12}></Col>
      <Col xl={6} lg={6} md={8} sm={12}>
        <Alert variant="info">
          <div className="d-flex justify-content-center">
            <h1>
              <i className="fas fa-users"></i>
            </h1>
          </div>
          <div className="d-flex justify-content-center">
            <h4>search for users</h4>
          </div>
        </Alert>
        {loading && <Loader />}
        <Card>
          <Card.Body>
            <Form onSubmit={searchHandler}>
              <Form.Control
                placeholder="Find users ..."
                size="sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="gap-2 d-grid mt-2">
                <Button size="sm" type="submit">
                  <i className="fas fa-search"></i> search
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
        <hr />
        {users && users.length > 0
          ? users.map((user) => <UserItem user={user} key={user._id} />)
          : users && (
              <Alert variant="danger">
                <div className="d-flex justify-content-center">
                  <h1>
                    <i className="fa-solid fa-user-xmark"></i>
                  </h1>
                </div>
                <div className="d-flex justify-content-center">
                  <h4>users not found !</h4>
                </div>
              </Alert>
            )}
      </Col>
      <Col xl={3} lg={3} md={2} sm={12}></Col>
    </Row>
  );
};

const mapStateToProps = (state) => {
  const { userFind } = state;
  return {
    userFind,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    findUsers: (arg) => dispatch(findUsers(arg)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FindFriendsPage);
