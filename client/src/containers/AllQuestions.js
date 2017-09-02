// @flow

import type { Question, QuestionState, Lesson, State } from "../types";
import type { Dispatch } from "../actions/types";

import React, { Component } from "react";
import { Col, Progress } from "reactstrap";
import { connect } from "react-redux";
import { fetchQuestions, saveQuestion } from "../actions";
import EditQuestion from "../components/EditQuestion";

class AllQuestions extends Component {
  props: {
    questions: QuestionState,
    lessons: Array<Lesson>,
    fetchQuestions: () => void,
    saveQuestion: Question => void
  };

  onSaveClick = (question: Question): void => {
    this.props.saveQuestion(question);
  };

  componentWillMount() {
    if (!this.props.questions.fetched) {
      this.props.fetchQuestions();
    }
  }

  render() {
    let questions;
    if (this.props.questions.fetching) {
      questions = <Progress animated color="muted" value="100" />;
    } else {
      questions = this.props.questions.questions.map(question => {
        return (
          <EditQuestion
            key={question.id}
            question={question}
            lessons={this.props.lessons}
            onSave={this.onSaveClick}
          />
        );
      });
    }
    return (
      <Col sm="9" md="10">
        <h2 className="page-header">All Questions</h2>

        {questions}
      </Col>
    );
  }
}

const mapStateToProps = (state: State) => {
  return {
    questions: state.questions,
    lessons: state.lessons.lessons
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    fetchQuestions: () => {
      dispatch(fetchQuestions());
    },
    saveQuestion: (question: Question) => {
      dispatch(saveQuestion(question));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllQuestions);
