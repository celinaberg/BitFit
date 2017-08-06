// @flow

import React, { Component } from 'react';
import './AdminSidebar.css';
import { Col, Nav, NavItem, NavLink } from 'reactstrap';
import { NavLink as Link} from 'react-router-dom';
import LessonSidebar from '../lesson-sidebar'

class AdminSidebar extends Component {
  render() {
    return (
      <Col sm="3" md="2" className="sidebar">
        <Nav pills vertical>
          <NavItem>
            <NavLink tag={Link} to="/admin/users">Users</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/admin/logger">Logger</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/admin/questions">All Questions</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/admin/lessons/new">New Lesson</NavLink>
          </NavItem>
          <NavItem>
            Lessons
          </NavItem>
          <LessonSidebar admin={true}/>
        </Nav>
      </Col>
    );
  }
}

export default AdminSidebar;
