import React, { Component } from 'react';
import AdminSidebar from '../../components/admin-sidebar';
import { Switch, Route } from 'react-router-dom'
import ManageUsers from '../manage-users';
import NewLesson from '../new-lesson';
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
          </Switch>
        </Row>
      </Container>
    );
  }
}

export default Admin;
