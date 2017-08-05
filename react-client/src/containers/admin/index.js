import React, { Component } from 'react';
import { Button } from 'reactstrap';

class Admin extends Component {
  render() {
    console.log("in admin");
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to Admin</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Button color="danger">Danger!</Button>
      </div>
    );
  }
}

export default Admin;
