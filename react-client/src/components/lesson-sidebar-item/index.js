import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavItem, NavLink } from 'reactstrap';
import { NavLink as Link} from 'react-router-dom';

class LessonSidebarItem extends Component {
  render() {
      let url = "/lessons/" + this.props.id;
      if (this.props.admin) {
        url = "/admin/lessons/" + this.props.id;
      }

      return <NavItem key={this.props.id}><NavLink tag={Link} to={url}>{this.props.title}</NavLink></NavItem>
  }
}

LessonSidebarItem.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  admin: PropTypes.bool
};

LessonSidebarItem.defaultProps = {
  admin: false
};

export default LessonSidebarItem;
