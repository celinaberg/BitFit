// @flow

import type { QuestionState } from '../types';

import React, { Component } from 'react';
import { Col, Progress } from 'reactstrap';
import { connect } from 'react-redux';
import { fetchQuestions } from '../actions';
import EditQuestion from '../components/EditQuestion';

class AllQuestions extends Component {
  props: {
    questions: QuestionState,
    fetchQuestions: () => void
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
        return (<EditQuestion key={question.id} question={question}/>)
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
    questions: state.questions
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchQuestions : () => {
      dispatch(fetchQuestions())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AllQuestions);
