// @flow

import type { Dispatch } from "../actions/types";
import type { State } from "../types";

import React, { Component } from "react";
import {
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Progress
} from "reactstrap";
import RichTextEditor from "react-rte";
import { connect } from "react-redux";
import { updateNewLesson, saveNewLesson } from "../actions";

class EditLesson extends Component {
  props: {
    id: string,
    title: string,
    background: RichTextEditor,
    updateNewLesson: (title: string, background: RichTextEditor) => void,
    saveNewLesson: (title: string, background: string) => void
  };

  onTitleChange = event => {
    this.props.updateNewLesson(event.target.value, this.props.background);
  };

  onBackgroundChange = background => {
    this.props.updateNewLesson(this.props.title, background);
  };

  onSaveClick = (event: Event) => {
    event.preventDefault();
    this.props.saveNewLesson(
      this.props.title,
      this.props.background.toString("html")
    );
  };

  render() {
    if (this.props.id === null) {
      return (
        <Col sm="9" md="10">
          <h2 className="page-header">Edit Lesson</h2>

          <div>
            <Progress animated color="muted" value="100" />
          </div>
        </Col>
      );
    }
    return (
      <Col sm="9" md="10">
        <h2 className="page-header">Edit Lesson</h2>

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

const mapStateToProps = (state: State, ownProps) => {
  let id = ownProps.match.params.id;
  let lesson = null;
  for (let currentLesson of state.lessons.lessons) {
    if (currentLesson.id === id) {
      lesson = currentLesson;
      break;
    }
  }
  if (lesson === null) {
    console.error("Invalid lesson id: ", id);
    return {
      id: null,
      title: null,
      background: null
    };
  }
  return {
    id: lesson.id,
    title: lesson.title,
    background: RichTextEditor.createValueFromString(lesson.background, "html")
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    updateNewLesson: (title: string, background: RichTextEditor) => {
      dispatch(updateNewLesson(title, background));
    },
    saveNewLesson: (title: string, background: string) => {
      dispatch(saveNewLesson(title, background));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditLesson);
