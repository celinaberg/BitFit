// @flow

import React, { Component } from 'react';
import './NavBar.css';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { NavLink as Link} from 'react-router-dom';
import { connect } from 'react-redux';
import { toggleNavBar } from '../../actions';

class NavBar extends Component {
  props: {
    isOpen: bool,
    loggedIn: bool,
    name: string,
    onToggleClick: () => void
  }

  render() {
    let links = null;
    if(this.props.loggedIn){
      links = (
        <Nav navbar>
          <NavItem>
            <NavLink tag={Link} to="/lessons/">Lessons</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/admin/">Admin</NavLink>
          </NavItem>
        </Nav>
      );
    }
    return (
      <Navbar color="faded" light toggleable>
        <NavbarToggler right onClick={this.props.onToggleClick} />
        <NavbarBrand tag={Link} to="/">BitFit</NavbarBrand>
        <Collapse isOpen={this.props.isOpen} navbar>
          {links}
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink disabled>{this.props.name}</NavLink>
            </NavItem>
            <NavItem>
              <NavLink>Logout</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

const mapStateToProps = state => {
  return {
    isOpen: state.navbar.isOpen,
    loggedIn: state.auth.loggedIn,
    name: state.auth.name
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onToggleClick: () => {
      dispatch(toggleNavBar())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
