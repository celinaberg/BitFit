import React, { Component } from 'react';
import './Home.css';
import CwlLoginButton from './CWL_login_button.gif';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import { logIn } from '../../actions';

class Home extends Component {
  login = () => {
    this.props.dispatch(logIn());
  }

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
            <Button onClick={this.login}>Login</Button>
          </div>
        </div>
        <footer className="footer">
          <div className="container">
            <p>BitFit on <a href="https://github.com/celinaberg/BitFit" target="_blank" rel="noopener noreferrer">GitHub</a></p>
          </div>
        </footer>
      </div>
    );
  }
}

export default connect()(Home);
