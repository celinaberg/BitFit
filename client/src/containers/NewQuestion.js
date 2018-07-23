// @flow

import type { Question, Lesson, State } from "../types";
import type { Dispatch } from "../actions/types";

import React, { Component } from "react";
import { Col } from "reactstrap";
import { connect } from "react-redux";
import { saveNewQuestion } from "../actions";
import EditQuestion from "../components/EditQuestion";

const newQuestion = {
  title: "",
  instructions: "",
  code: "",
  className: "",
  readOnly: false,
  hints: [],
  tags: "",
  expectedOutput: "",
  dueDate: null
};

class AllQuestions extends Component {
  props: {
    lessons: Array<Lesson>,
    saveNewQuestion: Question => void
  };

  state = {
    question: { ...newQuestion }
  };

  onSaveClick = (question: Question): void => {
    this.props.saveNewQuestion(question);
  };

  render() {
    return (
      <Col sm="9" md="10">
        <h2 className="page-header">New Question</h2>
        <EditQuestion
          new
          question={this.state.question}
          lessons={this.props.lessons}
          onSave={this.onSaveClick}
        />
      </Col>
    );
  }
}

const mapStateToProps = (state: State) => {
  return {
    lessons: state.lessons.lessons
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    saveNewQuestion: (question: Question) => {
      dispatch(saveNewQuestion(question));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllQuestions);
