// @flow

import type { Dispatch } from "../actions/types";
import type { Lesson, State, Question } from "../types";

import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Progress
} from "reactstrap";
import TestQuestion from "../components/TestQuestion";
import { fetchLessons, fetchQuestions } from "../actions";

class Lessons extends Component {
  props: {
    loading: boolean,
    lesson: Lesson,
    questions: Array<Question>,
    fetchLessons: () => void,
    fetchQuestions: () => void
  };

  state = {
    activeTab: "1"
  };

  componentWillMount() {
    if (this.props.loading) {
      this.props.fetchLessons();
      this.props.fetchQuestions();
    }
  }

  toggle = (tab: string): void => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  };

  render() {
    console.log(this.props.loading);
    if (this.props.loading) {
      console.log("loading");
      return <Progress animated color="muted" value="100" />;
    }
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
                {this.props.lesson.questions.map(question => {
                  return <TestQuestion key={question.id} question={question} />;
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
  const loading = !(state.lessons.fetched && state.questions.fetched);
  return {
    loading: loading,
    lesson: lesson,
    questions: state.questions.questions
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    fetchLessons: () => {
      dispatch(fetchLessons());
    },
    fetchQuestions: () => {
      dispatch(fetchQuestions());
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Lessons);
