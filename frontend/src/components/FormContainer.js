import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function FormContainer({ children }) {
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={10} lg={6} sm={12}>
          {children}
        </Col>
      </Row>
    </Container>
  );
}

export default FormContainer;
