import React, { Component } from 'react';
import './Home.css';
import CwlLoginButton from './CWL_login_button.gif';
import { Link } from 'react-router-dom';

class Home extends Component {
  render() {
    return (
      <div>
        <header className="hero-unit" id="banner">
          <div className="container py-3 mb-3">
            <h1>BitFit for APSC 160</h1>
            <h2>This tool is built to help you learn C</h2>
          </div>
        </header>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center page-header">
              <Link to="/auth/cwl/login"><img src={CwlLoginButton} alt="CWL Login"></img></Link>
            </div>
          </div>
        </div>
        <footer className="footer">
          <div className="container">
            <p>BitFit on <a href="https://github.com/celinaberg/BitFit" target="_blank">GitHub</a></p>
          </div>
        </footer>
      </div>
    );
  }
}

export default Home;
