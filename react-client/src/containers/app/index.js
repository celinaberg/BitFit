// @flow

import React, { Component } from "react";
import "./App.css";
import { Provider } from "react-redux";
import store from "../../store";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Home from "../Home";
import EnsureLogin from "../EnsureLogin";
import EnsureInstructor from "../EnsureInstructor";
import Lessons from "../Lessons";
import Admin from "../Admin";
import NotFound from "../NotFound";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
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
      </Provider>
    );
  }
}

export default App;
