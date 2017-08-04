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
import Lessons from '../lessons';
import NotFound from '../not-found';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <NavBar></NavBar>

            <Switch>
              <Route exact path="/" component={Home}/>
              <Route path="/lessons" component={Lessons}/>
              <Route path="/lessons" component={Home}/>
              <Route component={NotFound}/>
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
