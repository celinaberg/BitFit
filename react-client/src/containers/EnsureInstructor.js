// @flow

import type { Role } from '../types';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router';

class EnsureInstructor extends Component {
  props: {
    component: Component<any>,
    role: Role
  }

  render() {
    let { component, ...rest } = this.props;
    if (this.props.role === "instructor") {
      return <Route component={component} {...rest}/>;
    } else {
      return <Route render={props => <Redirect to="/"/>} {...rest}/>;
    }
  }
}

function mapStateToProps(state) {
  return {
    role: state.auth.role
  }
}

export default connect(mapStateToProps)(EnsureInstructor)
