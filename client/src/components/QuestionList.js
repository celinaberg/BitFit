// @flow

import type { Question, Lesson } from "../types";

import React, { Component } from "react";
import { Card, CardBody, Progress, Button } from "reactstrap";
import { connect } from "react-redux";
import EditQuestion from "../components/EditQuestion";

class QuestionList extends Component {
  props: {
    questions: Array<Question>,
    lessonId: string,
    allLessons: Array<Lesson>,
    saveQuestion: Question => void,
    deleteQuestion: string => void,
  };

  onSaveClick = (question: Question): void => {
    this.props.saveQuestion(question);
  };

  onDeleteClick = (id: string): void => {
    this.props.deleteQuestion(id);
  };

  render() {
    let questions;
    questions = this.props.questions.map(question => {
      return (
        <EditQuestion
          key={question.id}
          question={question}
          lessons={this.props.allLessons}
          onSave={this.onSaveClick}
          onDelete={this.onDeleteClick}
        />
      );
    });
    return (
      <Card style={{marginBottom: "15px"}} key={this.props.lessonId}>
        <CardBody>
          <h4 className="page-header">Questions in this Lesson</h4>
          {questions}
        </CardBody>
      </Card>
    );
  }
}

export default QuestionList;
