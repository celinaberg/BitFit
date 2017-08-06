// @flow
'use strict';

import React, { Component } from 'react';
import './App.css';
import { Provider } from 'react-redux'
import store from '../../store';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import NavBar from '../../components/navbar';
import Home from '../home';
import EnsureLogin from '../ensure-login';
import EnsureInstructor from '../ensure-instructor';
import Lessons from '../lessons';
import Admin from '../admin'
import NotFound from '../not-found';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <NavBar/>

            <Switch>
              <Route exact path="/" component={Home}/>
              <EnsureLogin path="/lessons" component={Lessons} />
              <EnsureInstructor path="/admin" component={Admin}/>
              <Route component={NotFound}/>
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
