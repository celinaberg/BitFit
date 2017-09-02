// @flow

import React, { Component } from "react";
import { Provider } from "react-redux";
import store from "../../store";
import AppImpl from "./AppImpl";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppImpl />
      </Provider>
    );
  }
}

export default App;
