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
  TabPane,
  Progress
} from "reactstrap";
import TestQuestion from "../components/TestQuestion";
import { fetchLessons, fetchLessonQuestions } from "../actions";
import classnames from "classnames";

type Props = {
  id: string,
  loading: boolean,
  lesson: Lesson,
  userId: string,
  lessons: LessonState,
  fetchLessons: () => void,
  fetchLessonQuestions: (id: string) => void
};

class Lessons extends Component {
  props: Props;

  state = {
    activeTab: "background"
  };

  componentWillMount() {
    if (this.props.loading) {
      this.props.fetchLessons();
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.lesson !== nextProps.lesson) {
      this.setState({ activeTab: "background" });
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
    if (this.props.loading) {
      
      return <Progress animated color="muted" value="100" />;
    }
    return (
      <Col sm="9" md="10">
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({
                active: this.state.activeTab === "background"
              })}
              onClick={() => {
                this.toggle("background");
              }}
            >
              Background
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({
                active: this.state.activeTab === "questions"
              })}
              onClick={() => {
                this.props.fetchLessonQuestions(this.props.id);
                this.toggle("questions");
              }}
            >
              Questions
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="background">
            <Row>
              <Col sm="12">
                <h4>Background</h4>
                <div
                  dangerouslySetInnerHTML={{
                    __html: this.props.lesson.background
                  }}
                />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="questions">
            <Row>
              <Col sm="12">
              <h4>Questions</h4>
                {this.props.lessons.questions.map(question => {
                  return (
                    <TestQuestion
                      key={question.id}
                      question={question}
                      lessonId={this.props.lesson.id}
                      userId={this.props.userId}
                    />
                  );
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
    id: id,
    loading: !state.lessons.fetched,
    lesson: lesson,
    lessons: state.lessons,
    userId: state.auth.current ? state.auth.current.id : null
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    fetchLessons: () => {
      dispatch(fetchLessons());
    },
    fetchLessonQuestions: (id: string) => {
      dispatch(fetchLessonQuestions(id));
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Lessons);
