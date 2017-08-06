import React, { Component } from 'react';
import { Container, Row, Col, Nav } from 'reactstrap';
import { Switch, Route } from 'react-router';
import LessonSidebar from '../../components/lesson-sidebar';

class Lessons extends Component {
  render() {
    return (
      <Container fluid>
        <Row>
          <Col sm="3" md="2" className="sidebar">
            <Nav pills vertical>
              <LessonSidebar/>
            </Nav>
          </Col>

          <Switch>

          </Switch>
        </Row>
      </Container>
    );
  }
}

/*
<Route path="/admin/users" component={ManageUsers}/>
<Route path="/admin/lessons/new" component={NewLesson}/>
<Route path="/admin/lessons/:id" component={EditLesson}/>
*/

export default Lessons;
