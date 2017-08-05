import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router';

class EnsureLogin extends Component {
  render() {
    let { component: Component, ...rest } = this.props;
    if (this.props.isLoggedIn) {
      return <Route component={Component} {...rest}/>;
    } else {
      return <Route render={props => <Redirect to="/"/>} {...rest}/>;
    }
  }
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.auth.loggedIn
  }
}

export default connect(mapStateToProps)(EnsureLogin)
