// @flow

import type { Dispatch } from "../actions/types";
import type { Lesson, State } from "../types";

import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Card,
  Row,
  Col,
  Progress
} from "reactstrap";
import TestQuestion from "../components/TestQuestion";
import { fetchLessons, fetchLessonQuestions } from "../actions";

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

  UNSAFE_componentWillMount() {
    if (this.props.loading) {
      this.props.fetchLessons();
      this.props.fetchLessonQuestions(this.props.id);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.props.lesson !== nextProps.lesson) {
      this.props.fetchLessonQuestions(nextProps.id);
    }
  }

  render() {
    if (this.props.loading) {
      return <Progress animated color="muted" value="100" />;
    }
    return (
      <Col sm="9" md="10">
        <Row>
          <Col sm="12">
            <h4>Background</h4>
            <Card style={{padding: "15px"}}>
              <div
                dangerouslySetInnerHTML={{
                  __html: this.props.lesson.background
                }}
              />
            </Card>
            <br></br>
            <h4>Questions</h4>
            {this.props.lessons.questions.length !== 0 ?
              this.props.lessons.questions.map(question => {
                return (
                  <TestQuestion
                    key={question.id}
                    question={question}
                    lessonId={this.props.lesson.id}
                    userId={this.props.userId}
                  />
                );
              }) :
              <Card style={{padding: "15px"}}>
                There are no questions in this lesson.
              </Card>}
          </Col>
        </Row>
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Lessons);
