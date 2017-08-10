// @flow

import React, { Component } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { Switch, Route } from "react-router-dom";
import ManageUsers from "./ManageUsers";
import NewLesson from "./NewLesson";
import EditLesson from "./EditLesson";
import AllQuestions from "./AllQuestions";
import { Container, Row } from "reactstrap";

class Admin extends Component {
  render() {
    return (
      <Container fluid>
        <Row>
          <AdminSidebar />

          <Switch>
            <Route path="/admin/users" component={ManageUsers} />
            <Route path="/admin/lessons/new" component={NewLesson} />
            <Route path="/admin/lessons/:id" component={EditLesson} />
            <Route path="/admin/questions" component={AllQuestions} />
          </Switch>
        </Row>
      </Container>
    );
  }
}

export default Admin;
