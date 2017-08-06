import React, { Component } from 'react';
import { Col, Progress, Card, CardBlock, Form, FormGroup, Label, Input } from 'reactstrap';
import { connect } from 'react-redux';
import { fetchQuestions } from '../../actions';
import Question from '../../components/question';

class AllQuestions extends Component {
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
        return (<Question key={question._id} question={question}/>)
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
