// @flow

import type { Dispatch } from "../actions/types";
import type { Lesson, State } from "../types";

import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from "reactstrap";
import TestQuestion from "../components/TestQuestion";

class Lessons extends Component {
  props: {
    lesson: Lesson,
    questions: Array<Question>
  };

  state = {
    activeTab: "1"
  };

  toggle = (tab: string): void => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  };

  render() {
    return (
      <Col sm="9" md="10">
        <Nav tabs>
          <NavItem>
            <NavLink
              onClick={() => {
                this.toggle("1");
              }}
            >
              Background
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              onClick={() => {
                this.toggle("2");
              }}
            >
              Questions
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <h4>Background</h4>
                <div>
                  {this.props.lesson.background}
                </div>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                <h4>Questions</h4>
                {this.props.lesson.questions.map(questionId => {
                  let question: Question = null;
                  for (let currentQuestion: Question of this.props.questions) {
                    if (currentQuestion.id === questionId) {
                      question = currentQuestion;
                      break;
                    }
                  }
                  console.log(question);
                  return <TestQuestion question={question} />;
                })}
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </Col>
    );
  }
}

const mapStateToProps = (state: State, ownProps) => {
  let id = ownProps.match.params.id;
  let lesson = null;
  for (let currentLesson of state.lessons.lessons) {
    if (currentLesson.id === id) {
      lesson = currentLesson;
      break;
    }
  }
  return {
    lesson: lesson,
    questions: state.questions.questions
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Lessons);
