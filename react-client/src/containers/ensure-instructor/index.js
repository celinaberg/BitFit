import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router';

class EnsureInstructor extends Component {
  render() {
    let { component: Component, ...rest } = this.props;
    if (this.props.role === "instructor") {
      return <Route component={Component} {...rest}/>;
    } else {
      return <Route render={props => <Redirect to="/"/>} {...rest}/>;
    }
  }
}

function mapStateToProps(state) {
  return {
    role: state.user.role
  }
}

export default connect(mapStateToProps)(EnsureInstructor)
