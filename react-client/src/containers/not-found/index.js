import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';

class NotFound extends Component {
  render() {
    return (
      <Container>
        <Row>
          <Col>
            <h2>404: Not Found</h2>
            <p>If you think this is a bug, file an <a href="https://github.com/celinaberg/BitFit/issues">issue</a> on GitHub.</p>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default NotFound;
