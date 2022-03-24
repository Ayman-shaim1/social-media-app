import React from "react";
import { Navbar, Container, Nav, NavDropdown, Badge } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { logout } from "../redux/user/userActions";
import { connect } from "react-redux";

const Header = ({ logout, userLogin }) => {
  // redux states :
  const { userInfo } = userLogin;

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand href="#">Socila Media</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="sm-navbar" className="mb-2" />
        <Navbar.Collapse id="sm-navbar">
          <Nav className="me-auto my-2 navbar-nav w-100 justify-content-end">
            <LinkContainer to="/">
              <Nav.Link>
                <i className="mr-1 fas fa-home mr-1"></i>Home
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/find-friends">
              <Nav.Link>
                <i className="mr-1 fas fa-users mr-1"></i>Find firends
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/messages">
              <Nav.Link>
                <i className="mr-1 fa-solid fa-envelope"></i>Messages
                <Badge>0</Badge>
              </Nav.Link>
            </LinkContainer>
            <Nav.Link>
              <i className="mr-1 fa-solid fa-bell"></i> Notification
              <Badge>0</Badge>
            </Nav.Link>
            <NavDropdown
              title={`Hello ${userInfo && userInfo.name} !`}
              id="sm-navdrp">
              <LinkContainer to={`/profile/${userInfo && userInfo._id}`}>
                <NavDropdown.Item>
                  <i className="fa-solid fa-user"></i> profile
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
  const { userLogin } = state;
  return { userLogin };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Header);
