// @flow

import type { Question, Lesson } from "../types";

import React, { Component } from "react";
import { Card, CardBody, Progress, Button, Collapse } from "reactstrap";
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

  state: {
    collapse: boolean
  };

  state = {
    collapse: true
  };

  onSaveClick = (question: Question): void => {
    this.props.saveQuestion(question);
  };

  onDeleteClick = (id: string): void => {
    this.props.deleteQuestion(id);
  };

  onToggleCollapseClick = (): void => {
    this.setState({collapse: !this.state.collapse});
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
          <h4 className="page-header">
            <Button style={{marginRight: "10px"}} onClick={this.onToggleCollapseClick}>
              {this.state.collapse ? "+" : "-"}
            </Button>
            Questions in this Lesson
          </h4>
          <Collapse isOpen={!this.state.collapse}>
            {questions}
          </Collapse>
        </CardBody>
      </Card>
    );
  }
}

export default QuestionList;
