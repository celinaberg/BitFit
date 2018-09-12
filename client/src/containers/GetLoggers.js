// @flow

import type { Dispatch } from "../actions/types";
import type { LoggerState, State, Lesson, QuestionState, UserState } from "../types";

import React, { Component } from "react";
import { Col, Input, Progress, Tooltip, UncontrolledTooltip } from "reactstrap";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { connect } from "react-redux";
import { fetchLoggers, fetchQuestions, fetchUsers } from "../actions";

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

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
    userFilter: (user: string) => boolean,
    userFilterString: string,
    userFilterRegexErrorMsg: string,
    sectionFilter: (section: string) => boolean,
    sectionFilterString: string,
    sectionFilterRegexErrorMsg: string,
    termFilter: (term: string) => boolean,
    termFilterString: string,
    termFilterRegexErrorMsg: string,
    sessionFilter: (session: string) => boolean,
    sessionFilterString: string,
    sessionFilterRegexErrorMsg: string,
    yearFilter: (year: string) => boolean,
    yearFilterString: string,
    yearFilterRegexErrorMsg: string,
    questionFilter: (question: string) => boolean,
    questionFilterString: string,
    questionFilterRegexErrorMsg: string,
    lessonFilter: (lesson: string) => boolean,
    lessonFilterString: string,
    lessonFilterRegexErrorMsg: string,
  }

  constructor(props) {
    super(props);

    this.state = {
      userFilter: user => user.match(new RegExp("")),
      userFilterString: "",
      userFilterRegexErrorMsg: null,
      sectionFilter: section => section.match(new RegExp("")),
      sectionFilterString: "",
      sectionFilterRegexErrorMsg: null,
      termFilter: term => term.match(new RegExp("")),
      termFilterString: "",
      termFilterRegexErrorMsg: null,
      sessionFilter: session => session.match(new RegExp("")),
      sessionFilterString: "",
      sessionFilterRegexErrorMsg: null,
      yearFilter: year => year.match(new RegExp("")),
      yearFilterString: "",
      yearFilterRegexErrorMsg: null,
      questionFilter: question => question.match(new RegExp("")),
      questionFilterString: "",
      questionFilterRegexErrorMsg: null,
      lessonFilter: lesson => lesson.match(new RegExp("")),
      lessonFilterString: "",
      lessonFilterRegexErrorMsg: null,
    };
  }

  UNSAFE_componentWillMount() {
    this.props.fetchLoggers();
    this.props.fetchQuestions();
    this.props.fetchUsers();
  }

  onUserFilterChange = (event) => {
    const newUserFilterString = event.target.value;
    const isExactMatch = newUserFilterString.length > 0 && newUserFilterString[0] === "=";
    if (isExactMatch) {
      this.setState({
        userFilterString: newUserFilterString,
        userFilter: user => user === newUserFilterString.substring(1),
        userFilterRegexErrorMsg: null
      });
    } else {
      try {
        let newUserRegexFilter = new RegExp(newUserFilterString);
        this.setState({
          userFilterString: newUserFilterString,
          userFilter: user => user.match(newUserRegexFilter),
          userFilterRegexErrorMsg: null
        });
      } catch (err) {
        this.setState({
          userFilterString: newUserFilterString,
          userFilterRegexErrorMsg: "Invalid Regex: " + err
        });
      }
    }
  }

  onSectionFilterChange = (event) => {
    const newSectionFilterString = event.target.value;
    const isExactMatch = newSectionFilterString.length > 0 && newSectionFilterString[0] === "=";
    if (isExactMatch) {
      this.setState({
        sectionFilterString: newSectionFilterString,
        sectionFilter: section => section === newSectionFilterString.substring(1),
        sectionFilterRegexErrorMsg: null
      });
    } else {
      try {
        let newSectionRegexFilter = new RegExp(newSectionFilterString);
        this.setState({
          sectionFilterString: newSectionFilterString,
          sectionFilter: section => section.match(newSectionRegexFilter),
          sectionFilterRegexErrorMsg: null
        });
      } catch (err) {
        this.setState({
          sectionFilterString: newSectionFilterString,
          sectionFilterRegexErrorMsg: "Invalid Regex: " + err
        });
      }
    }
  }

  onTermFilterChange = (event) => {
    const newTermFilterString = event.target.value;
    const isExactMatch = newTermFilterString.length > 0 && newTermFilterString[0] === "=";
    if (isExactMatch) {
      this.setState({
        termFilterString: newTermFilterString,
        termFilter: term => term === newTermFilterString.substring(1),
        termFilterRegexErrorMsg: null
      });
    } else {
      try {
        let newTermRegexFilter = new RegExp(newTermFilterString);
        this.setState({
          termFilterString: newTermFilterString,
          termFilter: term => term.match(newTermRegexFilter),
          termFilterRegexErrorMsg: null
        });
      } catch (err) {
        this.setState({
          termFilterString: newTermFilterString,
          termFilterRegexErrorMsg: "Invalid Regex: " + err
        });
      }
    }
  }

  onSessionFilterChange = (event) => {
    const newSessionFilterString = event.target.value;
    const isExactMatch = newSessionFilterString.length > 0 && newSessionFilterString[0] === "=";
    if (isExactMatch) {
      this.setState({
        sessionFilterString: newSessionFilterString,
        sessionFilter: session => session === newSessionFilterString.substring(1),
        sessionFilterRegexErrorMsg: null
      });
    } else {
      try {
        let newSessionRegexFilter = new RegExp(newSessionFilterString);
        this.setState({
          sessionFilterString: newSessionFilterString,
          sessionFilter: session => session.match(newSessionRegexFilter),
          sessionFilterRegexErrorMsg: null
        });
      } catch (err) {
        this.setState({
          sessionFilterString: newSessionFilterString,
          sessionFilterRegexErrorMsg: "Invalid Regex: " + err
        });
      }
    }
  }

  onYearFilterChange = (event) => {
    const newYearFilterString = event.target.value;
    const isExactMatch = newYearFilterString.length > 0 && newYearFilterString[0] === "=";
    if (isExactMatch) {
      this.setState({
        yearFilterString: newYearFilterString,
        yearFilter: year => year === newYearFilterString.substring(1),
        yearFilterRegexErrorMsg: null
      });
    } else {
      try {
        let newYearRegexFilter = new RegExp(newYearFilterString);
        this.setState({
          yearFilterString: newYearFilterString,
          yearFilter: year => year.match(newYearRegexFilter),
          yearFilterRegexErrorMsg: null
        });
      } catch (err) {
        this.setState({
          yearFilterString: newYearFilterString,
          yearFilterRegexErrorMsg: "Invalid Regex: " + err
        });
      }
    }
  }

  onQuestionFilterChange = (event) => {
    const newQuestionFilterString = event.target.value;
    const isExactMatch = newQuestionFilterString.length > 0 && newQuestionFilterString[0] === "=";
    if (isExactMatch) {
      this.setState({
        questionFilterString: newQuestionFilterString,
        questionFilter: question => question === newQuestionFilterString.substring(1),
        questionFilterRegexErrorMsg: null
      });
    } else {
      try {
        let newQuestionRegexFilter = new RegExp(newQuestionFilterString);
        this.setState({
          questionFilterString: newQuestionFilterString,
          questionFilter: question => question.match(newQuestionRegexFilter),
          questionFilterRegexErrorMsg: null
        });
      } catch (err) {
        this.setState({
          questionFilterString: newQuestionFilterString,
          questionFilterRegexErrorMsg: "Invalid Regex: " + err
        });
      }
    }
  }

  onLessonFilterChange = (event) => {
    const newLessonFilterString = event.target.value;
    const isExactMatch = newLessonFilterString.length > 0 && newLessonFilterString[0] === "=";
    if (isExactMatch) {
      this.setState({
        lessonFilterString: newLessonFilterString,
        lessonFilter: lesson => lesson === newLessonFilterString.substring(1),
        lessonFilterRegexErrorMsg: null
      });
    } else {
      try {
        let newLessonRegexFilter = new RegExp(newLessonFilterString);
        this.setState({
          lessonFilterString: newLessonFilterString,
          lessonFilter: lesson => lesson.match(newLessonRegexFilter),
          lessonFilterRegexErrorMsg: null
        });
      } catch (err) {
        this.setState({
          lessonFilterString: newLessonFilterString,
          lessonFilterRegexErrorMsg: "Invalid Regex: " + err
        });
      }
    }
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
        let loggerUserNameOrId = loggerUser ? (loggerUser.displayName || "") : (logger.user || "");
        let loggerUserStudentId = loggerUser ? loggerUser.uid : "";
        let loggerUserStudentNumber = loggerUser ? loggerUser.studentNumber : "";
        let loggerUserSection = loggerUser ? (loggerUser.section || "") : "";
        let loggerUserTerm = loggerUser ? (loggerUser.term ? loggerUser.term.toString() : "") : "";
        let loggerUserSession = loggerUser ? (loggerUser.session || "") : "";
        let loggerUserYear = loggerUser ? (loggerUser.year ? loggerUser.year.toString() : "") : "";

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
        loggerQuestionTitleOrId = (loggerQuestion ? loggerQuestion.title : logger.question) || "";

        let loggerLessonTitle;
        let loggerLesson = this.props.lessons.find(lesson => {
          return loggerQuestion ? lesson.id === loggerQuestion.lesson : false;
        });
        loggerLessonTitle = loggerLesson ? (loggerLesson.title || "") : "";

        if (!(this.state.userFilter(loggerUserNameOrId) &&
              this.state.sectionFilter(loggerUserSection) &&
              this.state.termFilter(loggerUserTerm) &&
              this.state.sessionFilter(loggerUserSession) &&
              this.state.yearFilter(loggerUserYear) &&
              this.state.questionFilter(loggerQuestionTitleOrId) &&
              this.state.lessonFilter(loggerLessonTitle))) {
          // Skip this Logger since it doesn't match the filters
          return acc;
        }

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
          <Tooltip placement="top" target="userFilterInput" isOpen={this.state.userFilterRegexErrorMsg ? true : false}>{this.state.userFilterRegexErrorMsg}</Tooltip>
          <Input
            type="text"
            id="userFilterInput"
            onChange={this.onUserFilterChange}
            value={this.state.userFilterString}
            placeholder="Filter by User"
            style={{width: "150px", display: "inline", marginRight: "5px"}}/>
          <Tooltip placement="top" target="sectionFilterInput" isOpen={this.state.sectionFilterRegexErrorMsg ? true : false}>{this.state.sectionFilterRegexErrorMsg}</Tooltip>
          <Input
            type="text"
            id="sectionFilterInput"
            onChange={this.onSectionFilterChange}
            value={this.state.sectionFilterString}
            placeholder="Filter by Section"
            style={{width: "150px", display: "inline", marginRight: "5px"}}/>
          <Tooltip placement="top" target="termFilterInput" isOpen={this.state.termFilterRegexErrorMsg ? true : false}>{this.state.termFilterRegexErrorMsg}</Tooltip>
          <Input
            type="text"
            id="termFilterInput"
            onChange={this.onTermFilterChange}
            value={this.state.termFilterString}
            placeholder="Filter by Term"
            style={{width: "130px", display: "inline", marginRight: "5px"}}/>
          <Tooltip placement="top" target="sessionFilterInput" isOpen={this.state.sessionFilterRegexErrorMsg ? true : false}>{this.state.sessionFilterRegexErrorMsg}</Tooltip>
          <Input
            type="text"
            id="sessionFilterInput"
            onChange={this.onSessionFilterChange}
            value={this.state.sessionFilterString}
            placeholder="Filter by Session"
            style={{width: "150px", display: "inline", marginRight: "5px"}}/>
          <Tooltip placement="top" target="yearFilterInput" isOpen={this.state.yearFilterRegexErrorMsg ? true : false}>{this.state.yearFilterRegexErrorMsg}</Tooltip>
          <Input
            type="text"
            id="yearFilterInput"
            onChange={this.onYearFilterChange}
            value={this.state.yearFilterString}
            placeholder="Filter by Year"
            style={{width: "130px", display: "inline", marginRight: "5px"}}/>
          <Tooltip placement="top" target="questionFilterInput" isOpen={this.state.questionFilterRegexErrorMsg ? true : false}>{this.state.questionFilterRegexErrorMsg}</Tooltip>
          <Input
            type="text"
            id="questionFilterInput"
            onChange={this.onQuestionFilterChange}
            value={this.state.questionFilterString}
            placeholder="Filter by Question"
            style={{width: "160px", display: "inline", marginRight: "5px"}}/>
          <Tooltip placement="top" target="lessonFilterInput" isOpen={this.state.lessonFilterRegexErrorMsg ? true : false}>{this.state.lessonFilterRegexErrorMsg}</Tooltip>
          <Input
            type="text"
            id="lessonFilterInput"
            onChange={this.onLessonFilterChange}
            value={this.state.lessonFilterString}
            placeholder="Filter by Lesson"
            style={{width: "150px", display: "inline", marginRight: "5px"}}/>
          <UncontrolledTooltip placement="top" target="filtersInfoIcon" style={{maxWidth: "400px"}}>
            <div>
              <div>Filters are Regex by default.</div>
              <div>Prefix with "=" for exact matching, e.g. =2018W2.</div>
            </div>
          </UncontrolledTooltip>
          <FontAwesomeIcon icon={faQuestionCircle} id="filtersInfoIcon"/>
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
