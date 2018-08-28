// @flow

import React, { Component } from "react";
import type { Question, Lesson } from "../types";
import {
  Card,
  CardBlock,
  Col,
  Collapse,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Progress
} from "reactstrap";
import RichTextEditor from "react-rte";
import QuestionList from "./QuestionList";

type Props = {
  id: string,
  title: string,
  background: string,
  lessonIndex: number,
  saveLesson: (id: string, title: string, background: string, lessonIndex: number) => void,
  deleteLesson: (id: string) => void,
  allLessons: Array<Lesson>,
  lessonQuestions: Array<Question>,
  saveQuestion: Question => void,
  deleteQuestion: string => void,
};

class EditLessonComponent extends Component {
  props: Props;

  state: {
    title: string,
    background: RichTextEditor,
    lessonIndex: number,
    collapse: boolean
  };

  constructor(props) {
    super(props);

    this.state = {
      title: props.title,
      background: RichTextEditor.createValueFromString(props.background, "html"),
      lessonIndex: props.lessonIndex,
      collapse: true
    };
  }

  onLessonIndexChange = event => {
    this.setState({ lessonIndex: event.target.value || null });
  };

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
      this.state.background.toString("html"),
      this.state.lessonIndex
    );
  };

  onDeleteClick = (event: Event) => {
    event.preventDefault();
    this.props.deleteLesson(this.props.id);
  };

  onToggleCollapseClick = (): void => {
    this.setState({collapse: !this.state.collapse});
  };

  maxLessonIndex = Math.max.apply(Math, this.props.allLessons.map(l => l.lessonIndex));

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
        <h2 className="page-header">
          <Button style={{marginRight: "10px"}} onClick={this.onToggleCollapseClick}>
            {this.state.collapse ? "+" : "-"}
          </Button>
          {this.props.lessonIndex}: Edit Lesson: {this.state.title}
        </h2>

        <div>
          <Collapse isOpen={!this.state.collapse}>
            <Form>
              <FormGroup>
                <Label for="inputLessonLessonIndex">Lesson Index</Label>
                <Input
                  type="select"
                  name="Lesson Index"
                  id="inputLessonLessonIndex"
                  onChange={this.onLessonIndexChange}
                  value={this.state.lessonIndex}>
                  <option value={null}></option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                </Input>
              </FormGroup>
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
              <QuestionList
                lessonId={this.props.id}
                questions={this.props.lessonQuestions}
                allLessons={this.props.allLessons}
                saveQuestion={this.props.saveQuestion}
                deleteQuestion={this.props.deleteQuestion} />
              <Button color="success" onClick={this.onSaveClick}>
                Save Lesson
              </Button>
              <Button color="danger" onClick={this.onDeleteClick}>
                Delete Lesson
              </Button>
            </Form>
          </Collapse>
        </div>
      </Col>
      </CardBlock>
      </Card>
    );
  }
}

export default EditLessonComponent;
