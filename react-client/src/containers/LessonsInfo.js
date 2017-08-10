// @flow

import React, { Component } from "react";
import { Col } from "reactstrap";

class LessonsInfo extends Component {
  render() {
    return (
      <Col sm="9" md="10">
        <h2>Practice Tool for APSC 160</h2>
        <h6>Introduction to Computation in Engineering Design</h6>
        <hr />
        <h4>Question Types</h4>
        <p>
          The tool has a collection of practice questions from each of the
          topics we have covered so far this semester. There are two types of
          questions:
        </p>
        <ul>
          <li>
            <strong>Code Writing Questions</strong>: You are asked to write C
            code, which you then compile and run using the tool.
          </li>
          <li>
            <strong>Code Reading Questions</strong>: You are shown a C program
            and asked to type into the tool what you think the output of the
            program will be.
          </li>
        </ul>
        <hr />
        <h4>Help</h4>
        <p>
          There are a number of ways the tool can help you if you're feeling
          stuck on a particular question. There are hint buttons for every
          question, where we have added a series of hints should you be
          struggling to find a correct solution to the question.
        </p>
        <hr />
        <h4>Work in Progress</h4>
        <p>
          This tool is a work in progress, so questions, hints and features will
          be added as we move through the semester.
        </p>
        <hr />
        <p>
          <strong>
            To get started, choose a lesson to work on from the links at left.
            Have fun!
          </strong>
        </p>
      </Col>
    );
  }
}

export default LessonsInfo;
