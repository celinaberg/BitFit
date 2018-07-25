// @flow

import type { Dispatch } from "../actions/types";
import type { LoggerState, State } from "../types";

import React, { Component } from "react";
import { Col, Progress } from "reactstrap";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { connect } from "react-redux";
import { fetchLoggers } from "../actions";

class GetLoggers extends Component {
  props: {
    loggers: LoggerState,
    fetchLoggers: () => void
  };

  UNSAFE_componentWillMount() {
    if (!this.props.loggers.fetched) {
      this.props.fetchLoggers();
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
        return (
        <tr key={logger.id}>
          <td>{logger.user}</td>
          <td>{logger.question}</td>
          <td>{logger.startTime}</td>
          <td>{logger.endTime}</td>
          <td>{logger.numCompiles}</td>
          <td>{logger.numErrorFreeCompiles}</td>
          <td>{logger.numRuns}</td>
          <td>{logger.numHints}</td>
          <td>{logger.totalAttempts}</td>
          <td>{logger.correctAttempts}</td>
          <td>{gotAnswerCorrectBeforeDueDateInteger}</td>
          <td>{logger.timeOfCorrectAnswer}</td>
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
            <th>question</th>
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
    loggers: state.loggers
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    fetchLoggers: () => {
      dispatch(fetchLoggers());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GetLoggers);
