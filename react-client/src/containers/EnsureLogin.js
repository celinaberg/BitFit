// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router';

class EnsureLogin extends Component {
  props: {
    component: Component<any>,
    isLoggedIn: bool
  }

  render() {
    let { component, ...rest } = this.props;
    if (this.props.isLoggedIn) {
      return <Route component={component} {...rest}/>;
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
