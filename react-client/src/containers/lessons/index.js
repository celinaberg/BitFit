// @flow

import React, { Component } from 'react';
import { Container, Row, Col, Nav } from 'reactstrap';
import { Switch, Route } from 'react-router';
import LessonSidebar from '../../components/lesson-sidebar';
import LessonsInfo from '../lessons-info';
import Lesson from '../lesson';

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
            <Route exact path="/lessons" component={LessonsInfo}/>
            <Route path="/lessons/:id" component={Lesson}/>
          </Switch>
        </Row>
      </Container>
    );
  }
}

export default Lessons;
