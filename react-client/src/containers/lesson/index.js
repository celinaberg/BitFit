// @flow

import React, { Component } from 'react';
import { Row, Col, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';

class Lessons extends Component {
  state = {
    activeTab: '1'
  }

  toggle = (tab:string):void => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {
    return (
      <Col sm="9" md="10">
        <Nav tabs>
          <NavItem>
            <NavLink onClick={() => { this.toggle('1'); }}>Background</NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={() => { this.toggle('2'); }}>Questions</NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <h4>Background</h4>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                <h4>Questions</h4>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </Col>
    );
  }
}

export default Lessons;
