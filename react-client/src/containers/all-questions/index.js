import React, { Component } from 'react';
import { Col, ListGroup, ListGroupItem, Progress } from 'reactstrap';
import { connect } from 'react-redux';
import { fetchQuestions } from '../../actions';
import { Button } from 'reactstrap';
import FaTrash from 'react-icons/lib/fa/trash';

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
        return (
          <ListGroupItem key={question._id}>
            <div dangerouslySetInnerHTML={{ __html: question.instructions }}></div>
          </ListGroupItem>
        )
      })
    }
    return (
      <Col sm="9" md="10">
        <h2 className="page-header">All Questions</h2>

        <ListGroup>
          {questions}
        </ListGroup>
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
