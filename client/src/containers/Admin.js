// @flow

import React, { Component } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { Switch, Route } from "react-router-dom";
import ManageUsers from "./ManageUsers";
import GetLoggers from "./GetLoggers";
import NewLesson from "./NewLesson";
import EditLesson from "./EditLesson";
import AllQuestions from "./AllQuestions";
import NewQuestion from "./NewQuestion";
import AllLessons from "./AllLessons";
import { Container, Row } from "reactstrap";

class Admin extends Component {
  render() {
    return (
      <Container fluid>
        <Row>
          <AdminSidebar />

          <Switch>
            <Route path="/admin/users" component={ManageUsers} />
            <Route path="/admin/loggers" component={GetLoggers} />
            <Route path="/admin/lessons/new" component={NewLesson} />
            <Route path="/admin/lessons/:id" component={EditLesson} />
            <Route path="/admin/questions/new" component={NewQuestion} />
            <Route path="/admin/questions/new/:id" component={NewQuestion} />
            <Route path="/admin/questions" component={AllQuestions} />
            <Route path="/admin/lessons" component={AllLessons} />
          </Switch>
        </Row>
      </Container>
    );
  }
}

export default Admin;
