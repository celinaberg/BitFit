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
import { saveLesson, deleteLesson } from "../actions";

type Props = {
  id: string,
  title: string,
  background: RichTextEditor,
  saveLesson: (id: string, title: string, background: string) => void,
  deleteLesson: (id: string) => void
};

class EditLesson extends Component {
  props: Props;

  state: {
    title: string,
    background: RichTextEditor
  };

  constructor(props) {
    super(props);

    this.state = {
      title: props.title,
      background: props.background
    };
  }

  onTitleChange = event => {
    this.setState({ title: event.target.value });
  };

  onBackgroundChange = background => {
    this.setState({ background });
  };

  onSaveClick = (event: Event) => {
    event.preventDefault();
    this.props.saveLesson(
      this.props.id,
      this.state.title,
      this.state.background.toString("html")
    );
  };

  onDeleteClick = (event: Event) => {
    event.preventDefault();
    this.props.deleteLesson(this.props.id);
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
                value={this.state.title}
              />
            </FormGroup>
            <FormGroup>
              <Label for="inputBackground">Background</Label>
              <RichTextEditor
                value={this.state.background}
                onChange={this.onBackgroundChange}
              />
            </FormGroup>
            <Button color="success" onClick={this.onSaveClick}>
              Save Lesson
            </Button>
            <Button color="danger" onClick={this.onDeleteClick}>
              Delete Lesson
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
    saveLesson: (id: string, title: string, background: string) => {
      dispatch(saveLesson(id, title, background));
    },
    deleteLesson: (id: string) => {
      dispatch(deleteLesson(id));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditLesson);
