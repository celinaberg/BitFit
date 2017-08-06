import React, { Component } from 'react';
import AdminSidebar from '../../components/admin-sidebar';
import { Switch, Route } from 'react-router-dom'
import ManageUsers from '../manage-users';
import NewLesson from '../new-lesson';
import EditLesson from '../edit-lesson';
import AllQuestions from '../all-questions';
import { Container, Row } from 'reactstrap';

class Admin extends Component {
  render() {
    return (
      <Container fluid>
        <Row>
          <AdminSidebar/>

          <Switch>
            <Route path="/admin/users" component={ManageUsers}/>
            <Route path="/admin/lessons/new" component={NewLesson}/>
            <Route path="/admin/lessons/:id" component={EditLesson}/>
            <Route path="/admin/questions" component={AllQuestions}/>
          </Switch>
        </Row>
      </Container>
    );
  }
}

export default Admin;
