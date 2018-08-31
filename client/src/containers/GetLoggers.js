// @flow

import type { Dispatch } from "../actions/types";
import type { LoggerState, State, Lesson, QuestionState, UserState } from "../types";

import React, { Component } from "react";
import { Col, Input, Progress } from "reactstrap";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { connect } from "react-redux";
import { fetchLoggers, fetchQuestions, fetchUsers } from "../actions";

/* Takes in a string representing a date. Formats it in a nice human readable way.
Uses the user's local time zone.
*/
export function formatDateStringInLocalTime(dateString) {
  if (!dateString) return "";
  let date = new Date(dateString);
  return date.toDateString() + " at " + date.toLocaleTimeString('en-US', {hour: "2-digit", minute: "2-digit"});
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

  state: {
    sectionFilter: RegExp,
    termFilter: RegExp,
    sessionFilter: RegExp,
    yearFilter: RegExp
  }

  constructor(props) {
    super(props);

    this.state = {
      sectionFilterString: "",
      termFilterString: "",
      sessionFilterString: "",
      yearFilterString: "",
      sectionFilter: new RegExp(""),
      termFilter: new RegExp(""),
      sessionFilter: new RegExp(""),
      yearFilter: new RegExp("")
    };
  }

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

  onSectionFilterChange = (event) => {
    this.setState({
      sectionFilterString: event.target.value,
      sectionFilter: new RegExp(event.target.value)
    });
  }

  onTermFilterChange = (event) => {
    this.setState({
      termFilterString: event.target.value,
      termFilter: new RegExp(event.target.value)
    });
  }

  onSessionFilterChange = (event) => {
    this.setState({
      sessionFilterString: event.target.value,
      sessionFilter: new RegExp(event.target.value)
    });
  }

  onYearFilterChange = (event) => {
    this.setState({
      yearFilterString: event.target.value,
      yearFilter: new RegExp(event.target.value)
    });
  }

  render() {
    let filteredLoggerTableRows;
    if (this.props.loggers.fetching) {
      filteredLoggerTableRows = <Progress animated color="muted" value="100" />;
    } else {

      filteredLoggerTableRows = this.props.loggers.loggers.reduce((acc, logger) => {

        const loggerUser = this.props.users.users.find(user => {
          return user.id === logger.user;
        });
        let loggerUserNameOrId = loggerUser ? loggerUser.displayName : logger.user;
        let loggerUserStudentId = loggerUser ? loggerUser.uid : "";
        let loggerUserStudentNumber = loggerUser ? loggerUser.studentNumber : "";
        let loggerUserSection = loggerUser ? (loggerUser.section || "") : "";
        let loggerUserTerm = loggerUser ? (loggerUser.term ? loggerUser.term.toString() : "") : "";
        let loggerUserSession = loggerUser ? (loggerUser.session || "") : "";
        let loggerUserYear = loggerUser ? (loggerUser.year ? loggerUser.year.toString() : "") : "";

        if (!loggerUserSection.match(this.state.sectionFilter) ||
            !loggerUserTerm.match(this.state.termFilter) ||
            !loggerUserSession.match(this.state.sessionFilter) ||
            !loggerUserYear.match(this.state.yearFilter)) {
          // Skip this Logger since it doesn't match the filters
          return acc;
        }

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

        acc.push(<tr key={logger.id}>
                  <td>{loggerUserNameOrId}</td>
                  <td>{loggerUserStudentId}</td>
                  <td>{loggerUserStudentNumber}</td>
                  <td>{loggerUserSection}</td>
                  <td>{loggerUserTerm}</td>
                  <td>{loggerUserSession}</td>
                  <td>{loggerUserYear}</td>
                  <td>{loggerQuestionTitleOrId}</td>
                  <td>{loggerLessonTitle}</td>
                  <td>{formatDateStringInLocalTime(logger.startTime)}</td>
                  <td>{formatDateStringInLocalTime(logger.endTime)}</td>
                  <td>{logger.numCompiles}</td>
                  <td>{logger.numErrorFreeCompiles}</td>
                  <td>{logger.numRuns}</td>
                  <td>{logger.numHints}</td>
                  <td>{logger.totalAttempts}</td>
                  <td>{logger.correctAttempts}</td>
                  <td>{gotAnswerCorrectBeforeDueDateInteger}</td>
                  <td>{formatDateStringInLocalTime(logger.timeOfCorrectAnswer)}</td>
                </tr>);
        return acc;
      }, []);
    }
    return (
      <Col sm="9" md="10">
        <h2 className="page-header">Loggers</h2>
        <div style={{marginBottom: "10px", marginTop: "15px"}}>
          <span style={{marginRight: "10px"}}>Filters:</span>
          <Input
            type="text"
            onChange={this.onSectionFilterChange}
            value={this.state.sectionFilterString}
            placeholder="Filter by Section"
            style={{width: "150px", display: "inline", marginRight: "5px"}}/>
          <Input
            type="text"
            onChange={this.onTermFilterChange}
            value={this.state.termFilterString}
            placeholder="Filter by Term"
            style={{width: "150px", display: "inline", marginRight: "5px"}}/>
          <Input
            type="text"
            onChange={this.onSessionFilterChange}
            value={this.state.sessionFilterString}
            placeholder="Filter by Session"
            style={{width: "150px", display: "inline", marginRight: "5px"}}/>
          <Input
            type="text"
            onChange={this.onYearFilterChange}
            value={this.state.yearFilterString}
            placeholder="Filter by Year"
            style={{width: "150px", display: "inline", marginRight: "5px"}}/>
        </div>

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
            <th>studentId</th>
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
          {filteredLoggerTableRows}
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
