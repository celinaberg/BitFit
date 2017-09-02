// @flow

import React, { Component } from "react";
import "./Home.css";
import CwlLoginButton from "./CWL_login_button.gif";
import { Container, Row, Col } from "reactstrap";

class Home extends Component {
  props: {};

  render() {
    return (
      <div>
        <header className="hero-unit" id="banner">
          <Container className="py-3 mb-3">
            <h1>BitFit for APSC 160</h1>
            <h2>This tool is built to help you learn C</h2>
          </Container>
        </header>
        <Container>
          <Row>
            <Col className="text-center page-header">
              <a href="/auth/cwl/login">
                <img src={CwlLoginButton} alt="CWL Login" />
              </a>
            </Col>
          </Row>
          <br />
          <Row>
            <Col className="text-center">
              <p>
                BitFit on{" "}
                <a
                  href="https://github.com/celinaberg/BitFit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Home;
