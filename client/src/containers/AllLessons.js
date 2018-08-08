// @flow

import type { Question, QuestionState, Lesson, State } from "../types";
import type { Dispatch } from "../actions/types";

import React, { Component } from "react";
import { Col, Progress, Button } from "reactstrap";
import { connect } from "react-redux";
import { fetchQuestions, saveQuestion, deleteQuestion } from "../actions";
import EditQuestion from "../components/EditQuestion";

class AllLessons extends Component {
  props: {
    questions: QuestionState,
    lessons: Array<Lesson>,
    fetchQuestions: () => void,
    saveQuestion: Question => void,
    deleteQuestion: string => void
  };

  onSaveClick = (question: Question): void => {
    this.props.saveQuestion(question);
  };

  onDeleteClick = (id: string): void => {
    this.props.deleteQuestion(id);
  };

  onExportAllLessonsAsJSONClick = (): void => {
    let tempElement = document.createElement("a");
    let lessons = this.props.lessons;
    let lessonsBlobFile = new Blob([JSON.stringify(lessons)], {type: 'text/plain'});
    tempElement.href = URL.createObjectURL(lessonsBlobFile);
    tempElement.download = `AllLessonsJSON.txt`;
    tempElement.click();
  };

  UNSAFE_componentWillMount() {
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
            onDelete={this.onDeleteClick}
          />
        );
      });
    }
    return (
      <Col sm="9" md="10">
        <h2 className="page-header">All Lessons</h2>
        <Button style={{marginBottom: "10px"}}
                onClick={this.onExportAllLessonsAsJSONClick}>
          Export all Lessons as JSON
        </Button>
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
    },
    deleteQuestion: (id: string) => {
      dispatch(deleteQuestion(id));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllLessons);
