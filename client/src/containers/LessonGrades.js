// @flow

import type { Dispatch } from "../actions/types";
import type { LoggerState, State, Lesson, QuestionState, UserState, LessonGradeInfo } from "../types";

import React, { Component } from "react";
import { Col, Input, Progress, Tooltip, UncontrolledTooltip } from "reactstrap";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { connect } from "react-redux";
import { fetchLoggers, fetchQuestions, fetchUsers } from "../actions";
import { formatDateStringInLocalTime } from "./GetLoggers";

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'


class LessonGrades extends Component {
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
    lessonFilter: (lesson: string) => boolean,
    lessonFilterString: string,
    lessonFilterRegexErrorMsg: string,
    lessonGradeInfos: Array<LessonGradeInfo>
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
      lessonFilter: lesson => lesson.match(new RegExp("")),
      lessonFilterString: "",
      lessonFilterRegexErrorMsg: null,
      lessonGradeInfos: (
        this.props.loggers.fetched ?
        this.getLessonGradeInfos(this.props.loggers.loggers.map(this.getLoggerInfo)) :
        null
      ),
      numQuestionsInLessonObject: {}
    };

    console.log("Fetching loggers, questions, and users");
    this.props.fetchLoggers();
    this.props.fetchQuestions();
    this.props.fetchUsers();
  }

  componentDidMount() {
    if (this.props.loggers.fetched && this.props.questions.fetched && this.props.users.fetched) {
      // Loggers, questions, and users are all available
      const newLoggerInfos = this.props.loggers.loggers.map(this.getLoggerInfo);
      this.setState({
        lessonGradeInfos: this.getLessonGradeInfos(newLoggerInfos),
        numQuestionsInLessonObject: this.getNumQuestionsInLessonObject(this.props.questions.questions)
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.loggers.fetched && !this.props.loggers.fetching) {
      console.log("Fetching loggers");
      this.props.fetchLoggers();
    }
    if (!this.props.questions.fetched && !this.props.questions.fetching) {
      console.log("Fetching questions");
      this.props.fetchQuestions();
    }
    if (!this.props.users.fetched && !this.props.users.fetching) {
      console.log("Fetching users");
      this.props.fetchUsers();
    }
    if (
      (this.props.loggers.fetched && !prevProps.loggers.fetched) ||
      (this.props.questions.fetched && !prevProps.questions.fetched) ||
      (this.props.users.fetched && !prevProps.users.fetched)
    ) {
      // Loggers, or questions, or users, are now available
      if (this.props.loggers.fetched && this.props.questions.fetched && this.props.users.fetched) {
        // Loggers, questions, and users are all available
        const newLoggerInfos = this.props.loggers.loggers.map(this.getLoggerInfo);
        this.setState({
          lessonGradeInfos: this.getLessonGradeInfos(newLoggerInfos),
          numQuestionsInLessonObject: this.getNumQuestionsInLessonObject(this.props.questions.questions)
        });
      }
    }
  }

  getNumQuestionsInLessonObject(questions) {
    return questions.reduce((acc, question) => {
      if (question.lesson in acc) {
        acc[question.lesson] += 1;
      } else {
        acc[question.lesson] = 1;
      }
      return acc;
    }, {});
  }

  getLessonGradeInfos(loggerInfos) {
    const lessonGradeInfosObject = loggerInfos.reduce((acc, loggerInfo) => {
      const userLessonKey = loggerInfo.userId + loggerInfo.lessonId;
      if (userLessonKey in acc) {
        // update acc[userLessonKey]
        if (loggerInfo.totalAttempts !== "0") {
          acc[userLessonKey].numQuestionsAttempted += 1;
        }
        if (loggerInfo.gotAnswerCorrectBeforeDueDateInteger === "1") {
          acc[userLessonKey].numQuestionsCorrect += 1;
        }
      } else {
        // initialize acc[userLessonKey]
        acc[userLessonKey] = {
          key: userLessonKey,
          userNameOrId: loggerInfo.userNameOrId,
          userStudentId: loggerInfo.userStudentId,
          userStudentNumber: loggerInfo.userStudentNumber,
          userSection: loggerInfo.userSection,
          userTerm: loggerInfo.userTerm,
          userSession: loggerInfo.userSession,
          userYear: loggerInfo.userYear,
          lessonId: loggerInfo.lessonId,
          lessonTitle: loggerInfo.lessonTitle,
          numQuestionsAttempted: loggerInfo.totalAttempts === "0" ? 0 : 1,
          numQuestionsCorrect: loggerInfo.gotAnswerCorrectBeforeDueDateInteger === "1" ? 1 : 0
        };
      }
      return acc;
    }, {});
    return Object.values(lessonGradeInfosObject);
  }

  getLoggerInfo = logger => {
    let loggerInfo = {};
    loggerInfo.key = logger.id;
    const loggerUser = this.props.users.users.find(user => {
      return user.id === logger.user;
    });
    loggerInfo.userId = logger.user || "";
    loggerInfo.userNameOrId = loggerUser ? (loggerUser.displayName || "") : (logger.user || "");
    loggerInfo.userStudentId = loggerUser ? loggerUser.uid : "";
    loggerInfo.userStudentNumber = loggerUser ? loggerUser.studentNumber : "";
    loggerInfo.userSection = loggerUser ? (loggerUser.section || "") : "";
    loggerInfo.userTerm = loggerUser ? (loggerUser.term ? loggerUser.term.toString() : "") : "";
    loggerInfo.userSession = loggerUser ? (loggerUser.session || "") : "";
    loggerInfo.userYear = loggerUser ? (loggerUser.year ? loggerUser.year.toString() : "") : "";

    loggerInfo.gotAnswerCorrectBeforeDueDateInteger = logger.gotAnswerCorrectBeforeDueDate ? "1" : "0";

    let loggerQuestion = this.props.questions.questions.find(question => {
      return question.id === logger.question;
    });
    loggerInfo.questionTitleOrId = (loggerQuestion ? loggerQuestion.title : logger.question) || "";

    loggerInfo.lessonId = loggerQuestion ? loggerQuestion.lesson : "";

    let loggerLesson = this.props.lessons.find(lesson => {
      return loggerQuestion ? lesson.id === loggerQuestion.lesson : false;
    });
    loggerInfo.lessonTitle = loggerLesson ? (loggerLesson.title || "") : "";

    loggerInfo.startTime = formatDateStringInLocalTime(logger.startTime);
    loggerInfo.endTime = formatDateStringInLocalTime(logger.endTime);
    loggerInfo.numCompiles = logger.numCompiles.toString();
    loggerInfo.numErrorFreeCompiles = logger.numErrorFreeCompiles.toString();
    loggerInfo.numRuns = logger.numRuns.toString();
    loggerInfo.numHints = logger.numHints.toString();
    loggerInfo.totalAttempts = logger.totalAttempts.toString();
    loggerInfo.correctAttempts = logger.correctAttempts.toString();
    loggerInfo.timeOfCorrectAnswer = formatDateStringInLocalTime(logger.timeOfCorrectAnswer);

    return loggerInfo;
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

  getLessonGradeInfoTableRow = lessonGradeInfo => {
    const numQuestionsInLesson = (
      lessonGradeInfo.lessonId in this.state.numQuestionsInLessonObject ?
      this.state.numQuestionsInLessonObject[lessonGradeInfo.lessonId].toString() :
      ""
    );
    return (
      <tr key={lessonGradeInfo.key}>
        <td>{lessonGradeInfo.userNameOrId}</td>
        <td>{lessonGradeInfo.userStudentId}</td>
        <td>{lessonGradeInfo.userStudentNumber}</td>
        <td>{lessonGradeInfo.userSection}</td>
        <td>{lessonGradeInfo.userTerm}</td>
        <td>{lessonGradeInfo.userSession}</td>
        <td>{lessonGradeInfo.userYear}</td>
        <td>{lessonGradeInfo.lessonTitle}</td>
        <td>{lessonGradeInfo.numQuestionsAttempted.toString()}</td>
        <td>{lessonGradeInfo.numQuestionsCorrect.toString()}</td>
        <td>{numQuestionsInLesson}</td>
      </tr>
    );
  }

  lessonGradeInfoFilter = lessonGradeInfo => {
    return (this.state.userFilter(lessonGradeInfo.userNameOrId) &&
            this.state.sectionFilter(lessonGradeInfo.userSection) &&
            this.state.termFilter(lessonGradeInfo.userTerm) &&
            this.state.sessionFilter(lessonGradeInfo.userSession) &&
            this.state.yearFilter(lessonGradeInfo.userYear) &&
            this.state.lessonFilter(lessonGradeInfo.lessonTitle));
  }

  render() {
    let filteredLessonGradeRows;
    if (this.state.lessonGradeInfos === null) {
      filteredLessonGradeRows = <Progress animated color="muted" value="100" />;
    } else {
      const filteredLessonGradeInfos = this.state.lessonGradeInfos.filter(this.lessonGradeInfoFilter);
      filteredLessonGradeRows = filteredLessonGradeInfos.map(this.getLessonGradeInfoTableRow);
    }
    return (
      <Col sm="9" md="10">
        <h2 className="page-header">Lesson Grades</h2>
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
            <th>lesson</th>
            <th>numQuestionsAttempted</th>
            <th>numQuestionsCorrect</th>
            <th>numQuestionsInLesson</th>
          </tr>
          </thead>
          <tbody>
          {filteredLessonGradeRows}
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
)(LessonGrades);
