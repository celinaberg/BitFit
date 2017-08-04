import React, { Component } from 'react';
import './NavBar.css';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { NavLink as Link} from 'react-router-dom';
import { connect } from 'react-redux';
import { toggleNavBar } from '../../actions';

class NavBar extends Component {
  toggle = () => {
    this.props.dispatch(toggleNavBar());
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
        <NavbarToggler right onClick={this.toggle} />
        <NavbarBrand tag={Link} to="/">BitFit</NavbarBrand>
        <Collapse isOpen={this.props.isOpen} navbar>
          {links}
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink disabled>{this.props.firstName}</NavLink>
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

export default connect((store) => {
  return {
    isOpen: store.navbar.isOpen,
    loggedIn: store.user.loggedIn,
    name: store.user.name
  }
})(NavBar);
