// @flow

import React, { Component } from "react";
import { NavItem, NavLink } from "reactstrap";
import { NavLink as Link } from "react-router-dom";

class LessonSidebarItem extends Component {
  props: {
    id: string,
    title: string,
    admin: boolean
  };

  static defaultProps = {
    admin: false
  };

  render() {
    let url = "/lessons/" + this.props.id;
    if (this.props.admin) {
      url = "/admin/lessons/" + this.props.id;
    }

    return (
      <NavItem key={this.props.id}>
        <NavLink tag={Link} to={url}>
          {this.props.title}
        </NavLink>
      </NavItem>
    );
  }
}

export default LessonSidebarItem;
