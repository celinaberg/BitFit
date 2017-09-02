// @flow

import type { State } from "../../types";
import type { Dispatch } from "../../actions/types";

import React, { Component } from "react";
import "./NavBar.css";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";
import { NavLink as Link } from "react-router-dom";
import { connect } from "react-redux";
import { toggleNavBar } from "../../actions";

class NavBar extends Component {
  props: {
    isOpen: boolean,
    loggedIn: boolean,
    name: string,
    onToggleClick: () => void
  };

  render() {
    let links = null;
    let rightSide = null;

    if (this.props.loggedIn) {
      links = (
        <Nav navbar>
          <NavItem>
            <NavLink tag={Link} to="/lessons/">
              Lessons
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/admin/">
              Admin
            </NavLink>
          </NavItem>
        </Nav>
      );
      rightSide = (
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink disabled>
              {this.props.name}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/auth/cwl/logout">Logout</NavLink>
          </NavItem>
        </Nav>
      );
    }
    return (
      <Navbar color="faded" light toggleable>
        <NavbarToggler right onClick={this.props.onToggleClick} />
        <NavbarBrand tag={Link} to="/">
          BitFit
        </NavbarBrand>
        <Collapse isOpen={this.props.isOpen} navbar>
          {links}
          {rightSide}
        </Collapse>
      </Navbar>
    );
  }
}

const mapStateToProps = (state: State) => {
  return {
    isOpen: state.navbar.isOpen,
    loggedIn: state.auth.loggedIn,
    name: state.auth.current ? state.auth.current.displayName : null
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    onToggleClick: () => {
      dispatch(toggleNavBar());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
