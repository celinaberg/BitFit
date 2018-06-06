// @flow

import type { Dispatch } from "../actions/types";
import type { LoggerState, State } from "../types";

import React, { Component } from "react";
<<<<<<< HEAD
import {
  Col,
  ListGroup,
  ListGroupItemText,
  Progress
} from "reactstrap";
=======
import { Col, ListGroup, ListGroupItemText, Progress } from "reactstrap";
>>>>>>> 76a1d40... Initial commit
import { connect } from "react-redux";
import { fetchLoggers } from "../actions";

class GetLoggers extends Component {
  props: {
    loggers: LoggerState,
    fetchLoggers: () => void
  };

  componentWillMount() {
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
        return (
        <ListGroupItemText>
          <span className="text-muted">
            {logger.user},
            {logger.question},
            {logger.startTime},
            {logger.endTime},
            {logger.numCompiles},
            {logger.numErrorFreeCompiles},
            {logger.numRuns},
            {logger.numHints},
            {logger.totalAttempts},
            {logger.correctAttempts}
          </span>
          <span>&nbsp;</span>
        </ListGroupItemText>
        );
      });
    }
    return (
      <Col sm="9" md="10">
        <h2 className="page-header">Loggers</h2>


        <ListGroup>
          <ListGroupItemText>
            <span className="text-bold">
              user,
              question,
              startTime,
              endTime,
              numCompiles,
              numErrorFreeCompiles,
              numRuns,
              numHints,
              totalAttempts,
              correctAttempts
            </span>
            <span>&nbsp;</span>
           </ListGroupItemText>
          {loggers}
        </ListGroup>
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

export default connect(mapStateToProps, mapDispatchToProps)(GetLoggers);
