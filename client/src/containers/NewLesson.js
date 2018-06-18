// @flow

import type { Dispatch } from "../actions/types";
import type { State } from "../types";

import React, { Component } from "react";
import { Col, Form, FormGroup, Label, Input, Button } from "reactstrap";
import RichTextEditor from "react-rte";
import { connect } from "react-redux";
import { updateNewLesson, saveNewLesson } from "../actions";

class NewLesson extends Component {
  props: {
    title: string,
    background: RichTextEditor,
    updateNewLesson: (title: string, background: RichTextEditor) => void,
    saveNewLesson: (title: string, background: RichTextEditor) => void
  };

  onTitleChange = event => {
    this.props.updateNewLesson(event.target.value, this.props.background);
  };

  onBackgroundChange = background => {
    this.props.updateNewLesson(this.props.title, background);
  };

  onSaveClick = event => {
    event.preventDefault();
    this.props.saveNewLesson(
      this.props.title,
      this.props.background.toString("html")
    );
  };

  render() {
    return (
      <Col sm="9" md="10">
        <h2 className="page-header">New Lesson</h2>

        <div>
          <Form>
            <FormGroup>
              <Label for="inputLessonTitle">Title</Label>
              <Input
                type="text"
                id="inputLessonTitle"
                onChange={this.onTitleChange}
                value={this.props.title}
              />
            </FormGroup>
            <FormGroup>
              <Label for="inputBackground">Background</Label>
              <RichTextEditor
                value={this.props.background}
                onChange={this.onBackgroundChange}
              />
            </FormGroup>
            <Button color="success" onClick={this.onSaveClick}>
              Save Lesson
            </Button>
          </Form>
        </div>
      </Col>
    );
  }
}

const mapStateToProps = (state: State) => {
  return {
    title: state.lessons.new.title,
    background: state.lessons.new.background
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    updateNewLesson: (title: string, background: RichTextEditor) => {
      dispatch(updateNewLesson(title, background));
    },
    saveNewLesson: (title: string, background: RichTextEditor) => {
      dispatch(saveNewLesson(title, background));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewLesson);
