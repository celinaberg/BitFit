// @flow

import type { Dispatch } from "../actions/types";
import type { LoggerState, State, Lesson, QuestionState, UserState } from "../types";

import React, { Component } from "react";
import { Col, Progress } from "reactstrap";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { connect } from "react-redux";
import { fetchLoggers, fetchQuestions, fetchUsers } from "../actions";

/* Takes in a string representing a date. Formats it in a nice human readable way.
Uses the user's local time zone.
*/
export function formatDateStringInLocalTime(dateString) {
  if (!dateString) return "";
  let date = new Date(dateString);
  return date.toDateString() + " at " + date.toLocaleTimeString('en-US');
}

class GetLoggers extends Component {
  props: {
    loggers: LoggerState,
    fetchLoggers: () => void,
    lessons: Array<Lesson>,
    questions: QuestionState,
    fetchQuestions: () => void,
    users: UserState,
    fetchUsers: () => void
  };

  UNSAFE_componentWillMount() {
    if (!this.props.loggers.fetched) {
      this.props.fetchLoggers();
    }
    if (!this.props.questions.fetched) {
      this.props.fetchQuestions();
    }
    if (!this.props.users.fetched) {
      this.props.fetchUsers();
    }
  }

  render() {
    let loggers;
    if (this.props.loggers.fetching) {
      loggers = <Progress animated color="muted" value="100" />;
    } else {

      loggers = this.props.loggers.loggers.map(logger => {

        let gotAnswerCorrectBeforeDueDateInteger;
        if (logger.gotAnswerCorrectBeforeDueDate) {
          gotAnswerCorrectBeforeDueDateInteger = 1;
        } else {
          gotAnswerCorrectBeforeDueDateInteger = 0;
        }

        let loggerQuestionTitleOrId;
        let loggerQuestion = this.props.questions.questions.find(question => {
          return question.id === logger.question;
        });
        loggerQuestionTitleOrId = loggerQuestion ? loggerQuestion.title : logger.question;

        let loggerLessonTitle;
        let loggerLesson = this.props.lessons.find(lesson => {
          return loggerQuestion ? lesson.id === loggerQuestion.lesson : false;
        });
        loggerLessonTitle = loggerLesson ? loggerLesson.title : "";

        let loggerUser = this.props.users.users.find(user => {
          return user.id === logger.user;
        });
        let loggerUserNameOrId = loggerUser ? loggerUser.displayName : logger.user;
        let loggerUserStudentNumber = loggerUser ? loggerUser.studentNumber : "";
        let loggerUserSection = loggerUser ? loggerUser.section : "";
        let loggerUserTerm = loggerUser ? loggerUser.term : "";
        let loggerUserSession = loggerUser ? loggerUser.session : "";
        let loggerUserYear = loggerUser ? loggerUser.year : "";

        return (
        <tr key={logger.id}>
          <td>{loggerUserNameOrId}</td>
          <td>{loggerUserStudentNumber}</td>
          <td>{loggerUserSection}</td>
          <td>{loggerUserTerm}</td>
          <td>{loggerUserSession}</td>
          <td>{loggerUserYear}</td>
          <td>{loggerQuestionTitleOrId}</td>
          <td>{loggerLessonTitle}</td>
          <td>{logger.startTime}</td>
          <td>{logger.endTime}</td>
          <td>{logger.numCompiles}</td>
          <td>{logger.numErrorFreeCompiles}</td>
          <td>{logger.numRuns}</td>
          <td>{logger.numHints}</td>
          <td>{logger.totalAttempts}</td>
          <td>{logger.correctAttempts}</td>
          <td>{gotAnswerCorrectBeforeDueDateInteger}</td>
          <td>{formatDateStringInLocalTime(logger.timeOfCorrectAnswer)}</td>
        </tr>
        );
      });
    }
    return (
      <Col sm="9" md="10">
        <h2 className="page-header">Loggers</h2>

        <ReactHTMLTableToExcel
                    id="loggers-table-xls-button"
                    className=""
                    table="loggers-table"
                    filename="allStudentLoggers"
                    sheet="loggers"
                    buttonText="Download as XLS"/>
        <table border="1" id="loggers-table">
        <thead>
          <tr>
            <th>user</th>
            <th>student#</th>
            <th>section</th>
            <th>term</th>
            <th>session</th>
            <th>year</th>
            <th>question</th>
            <th>lesson</th>
            <th>startTime</th>
            <th>endTime</th>
            <th>numCompiles</th>
            <th>numErrorFreeCompiles</th>
            <th>numRuns</th>
            <th>numHints</th>
            <th>totalAttempts</th>
            <th>correctAttempts</th>
            <th>gotAnswerCorrectBeforeDueDate</th>
            <th>timeOfCorrectAnswer</th>
          </tr>
          </thead>
          <tbody>
          {loggers}
          </tbody>
        </table>
      </Col>
    );
  }
}

const mapStateToProps = (state: State) => {
  return {
    loggers: state.loggers,
    lessons: state.lessons.lessons,
    questions: state.questions,
    users: state.users
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    fetchLoggers: () => {
      dispatch(fetchLoggers());
    },
    fetchQuestions: () => {
      dispatch(fetchQuestions());
    },
    fetchUsers: () => {
      dispatch(fetchUsers());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GetLoggers);
