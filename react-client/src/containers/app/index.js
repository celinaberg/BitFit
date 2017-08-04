import React, { Component } from 'react';
import './App.css';
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
      <Router>
        <div>
          <NavBar></NavBar>

          <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/lessons" component={Lessons}/>
            <Route path="/topics" component={Home}/>
            <Route component={NotFound}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
