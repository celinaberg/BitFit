// @flow
<<<<<<< HEAD
=======
/*eslint-disable no-unused-vars*/
>>>>>>> 76a1d40... Initial commit

import type { Dispatch } from "../../actions/types";
import type { State } from "../../types";

import React, { Component } from "react";
import "./App.css";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Home from "../Home";
import EnsureLogin from "../EnsureLogin";
import EnsureInstructor from "../EnsureInstructor";
import Lessons from "../Lessons";
import Admin from "../Admin";
import NotFound from "../NotFound";
import { checkLogin } from "../../actions";

type Props = {
  loaded: boolean,
  checkLogin: () => void
};

class App extends Component {
  props: Props;

  componentWillMount() {
    this.props.checkLogin();
  }

  render() {
    if (!this.props.loaded) {
      return <div>Loading...</div>;
    }
    return (
      <Router>
        <div>
          <NavBar />

          <Switch>
            <Route exact path="/" component={Home} />
            <EnsureLogin path="/lessons" component={Lessons} />
            <EnsureInstructor path="/admin" component={Admin} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    );
  }
}

const mapStateToProps = (state: State, ownProps) => {
  return {
    loaded: state.auth.loaded
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    checkLogin: () => {
      dispatch(checkLogin());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
