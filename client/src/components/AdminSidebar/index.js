// @flow

import React, { Component } from "react";
import "./AdminSidebar.css";
import { Col, Nav, NavItem, NavLink } from "reactstrap";
import { NavLink as Link } from "react-router-dom";
import LessonSidebar from "../LessonSidebar";

class AdminSidebar extends Component {
  render() {
    return (
      <Col sm="3" md="2" className="sidebar">
        <Nav pills vertical>
          <NavItem>
            <NavLink tag={Link} to="/admin/users">
              Users
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/admin/loggers">
              Loggers
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} exact to="/admin/lessons">
            All Lessons
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} exact to="/admin/questions">
              All Questions
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/admin/questions/new">
              New Question
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/admin/lessons/new">
              New Lesson
            </NavLink>
          </NavItem>
          <NavItem>Lessons</NavItem>
          <LessonSidebar admin={true} />
        </Nav>
      </Col>
    );
  }
}

export default AdminSidebar;
