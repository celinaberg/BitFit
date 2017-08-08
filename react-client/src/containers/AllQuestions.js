// @flow

import type { QuestionState } from '../types';

import React, { Component } from 'react';
import { Col, Progress } from 'reactstrap';
import { connect } from 'react-redux';
import { fetchQuestions, saveQuestion } from '../actions';
import EditQuestion from '../components/EditQuestion';

class AllQuestions extends Component {
  props: {
    questions: QuestionState,
    fetchQuestions: () => void
  }

  onSaveClick = (question: Question):void => {
    this.saveQuestion(question);
    this.fetchQuestions();
  }

  componentWillMount() {
    if(!this.props.questions.fetched) {
      this.props.fetchQuestions();
    }
  }

  render() {
    let questions;
    if(this.props.questions.fetching) {
      questions = (<Progress animated color="muted" value="100"/>);
    } else {
      questions = this.props.questions.questions.map((question) => {
        return (<EditQuestion key={question.id} question={question} lessons={this.props.lessons} onSave={this.onSaveClick}/>)
      })
    }
    return (
      <Col sm="9" md="10">
        <h2 className="page-header">All Questions</h2>

        {questions}
      </Col>
    );
  }
}

const mapStateToProps = state => {
  return {
    questions: state.questions,
    lessons: state.lessons.lessons
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchQuestions : () => {
      dispatch(fetchQuestions())
    }
    saveQuestion : (question:Question) => {
      dispatch(saveQuestion(question))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AllQuestions);
