import React, { Component } from 'react';
import AdminSidebar from '../../components/admin-sidebar';
import { Switch, Route } from 'react-router-dom'
import ManageUsers from '../manage-users';
import NewLesson from '../new-lesson';

class Admin extends Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <AdminSidebar/>

          <Switch>
            <Route path="/admin/users" component={ManageUsers}/>
            <Route path="/admin/lessons/new" component={NewLesson}/>
          </Switch>
        </div>
      </div>
    );
  }
}

export default Admin;
