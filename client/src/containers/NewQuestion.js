// @flow

import type { Question, Lesson, State } from "../types";
import type { Dispatch } from "../actions/types";

import React, { Component } from "react";
import { Button, Col } from "reactstrap";
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
    question: { ...newQuestion },
    questionJsonInputString: "",
    questionJsonErrorMsg: "",
    questionJsonSuccessMsg: ""
  };

  onSaveClick = (question: Question): void => {
    this.props.saveNewQuestion(question);
  };

  onQuestionJSONInputChange = (event: Event): void => {
    this.setState({questionJsonInputString: event.target.value});
  };

  onCreateQuestionFromJSONClick = (): void => {
    try {
      let questionJson = JSON.parse(this.state.questionJsonInputString);
      let newQuestion = Object.assign({}, questionJson);
      this.onSaveClick(newQuestion);
      this.setState({questionJsonErrorMsg: "", questionJsonSuccessMsg: "Success!"})
    } catch (err) {
      this.setState({questionJsonErrorMsg: err.message, questionJsonSuccessMsg: ""});
    }
  }

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
        <h4 style={{marginTop: "10px"}}>Create a Question from JSON</h4>
        <textarea
          style={{width: "800px", height: "200px"}}
          value={this.state.questionJsonInputString}
          onChange={this.onQuestionJSONInputChange}
        />
        <div>
          <Button
            style={{marginTop: "5px"}}
            onClick={this.onCreateQuestionFromJSONClick}>
            Create Question
          </Button>
        </div>
        <div style={{color: "red"}}>{this.state.questionJsonErrorMsg}</div>
        <div style={{color: "green"}}>{this.state.questionJsonSuccessMsg}</div>
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
