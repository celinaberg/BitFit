// @flow

import React, { Component } from "react";
import {
  Card,
  CardBlock,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Progress
} from "reactstrap";
import RichTextEditor from "react-rte";

type Props = {
  id: string,
  title: string,
  background: string,
  saveLesson: (id: string, title: string, background: string) => void,
  deleteLesson: (id: string) => void
};

class EditLessonComponent extends Component {
  props: Props;

  state: {
    title: string,
    background: RichTextEditor
  };

  constructor(props) {
    super(props);

    this.state = {
      title: props.title,
      background: RichTextEditor.createValueFromString(props.background, "html")
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
      <Card key={this.props.id}>
      <CardBlock>
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
      </CardBlock>
      </Card>
    );
  }
}

export default EditLessonComponent;
