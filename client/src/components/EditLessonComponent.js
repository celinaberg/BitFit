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
    this.setState({ lessonIndex: Number(event.target.value) || null });
  };

  onTitleChange = event => {
    this.setState({ title: event.target.value });
  };

  onBackgroundChange = background => {
    this.setState({ background });
  };

  onSaveClick = (event: Event) => {
    event.preventDefault();
    const maxLessonIndex = Math.max.apply(Math, this.props.allLessons.map(l => Number(l.lessonIndex) || -9999));
    const oldIndex = Number(this.props.lessonIndex);
    const newIndex = Number(this.state.lessonIndex);
    const didLessonIndexChange = oldIndex !== newIndex;
    if (!didLessonIndexChange) {
      this.props.saveLesson(
        this.props.id,
        this.state.title,
        this.state.background.toString("html"),
        newIndex
      );
    } else {
      if (!oldIndex) {
        // Case 1: oldIndex is null.
        // Let's say we wanna move it to 3 and there are 4 lessons with indices (1, 2, 3, 4).
        // Then we need to start at the Lesson with index 3, push it to 4, push 4 to 5, and finally
        // set this lesson to 3.
        for (let i = newIndex; i <= maxLessonIndex; i++) {
          // push the index up by one
          let otherLesson = this.props.allLessons.find(lesson => Number(lesson.lessonIndex) === i);
          if (otherLesson) {
            this.props.saveLesson(otherLesson.id, otherLesson.title, otherLesson.background, i + 1);
          }
        }
      } else if (!newIndex) {
        // Case 2: newIndex is null.
        for (let i = oldIndex + 1; i <= maxLessonIndex; i++) {
          // push the index down by one
          let otherLesson = this.props.allLessons.find(lesson => Number(lesson.lessonIndex) === i);
          if (otherLesson) {
            this.props.saveLesson(otherLesson.id, otherLesson.title, otherLesson.background, i - 1);
          }
        }
      } else if (oldIndex < newIndex) {
        // Case 3: oldIndex < newIndex
        // Let's say oldIndex is 3 and newIndex is 5. Then we'd want to push the Lesson with
        // index 4 to 3, 5 to 4, and finally 3 (this lesson) to 5.
        for (let i = oldIndex + 1; i <= newIndex; i++) {
          // push the index down by one
          let otherLesson = this.props.allLessons.find(lesson => Number(lesson.lessonIndex) === i);
          if (otherLesson) {
            this.props.saveLesson(otherLesson.id, otherLesson.title, otherLesson.background, i - 1);
          }
        }
      } else {
        // Case 4: oldIndex > newIndex
        // Let's say oldIndex is 6 and newIndex is 2. Then we'd want to push 2 to 3, 3 to 4,
        // 4 to 5, 5 to 6, and finally 6 (this lesson) to 2.
        for (let i = newIndex; i < oldIndex; i++) {
          // push the index up by one
          let otherLesson = this.props.allLessons.find(lesson => Number(lesson.lessonIndex) === i);
          if (otherLesson) {
            this.props.saveLesson(otherLesson.id, otherLesson.title, otherLesson.background, i + 1);
          }
        }
      }

      this.props.saveLesson(
        this.props.id,
        this.state.title,
        this.state.background.toString("html"),
        newIndex
      );
    }
  };

  onDeleteClick = (event: Event) => {
    event.preventDefault();
    this.props.deleteLesson(this.props.id);
  };

  onToggleCollapseClick = (): void => {
    this.setState({collapse: !this.state.collapse});
  };

  render() {

    let editLessonTitle = this.props.lessonIndex ?
      `${this.props.lessonIndex}: Edit Lesson: ${this.state.title}` :
      `Edit Lesson: ${this.state.title}`;

    const maxLessonIndex = Math.max.apply(Math, this.props.allLessons.map(l => Number(l.lessonIndex) || -9999));
    const maxPossibleLessonIndex = Math.min(maxLessonIndex + 1, this.props.allLessons.length);
    const lessonIndexOptions = [<option value={null}></option>];
    for (let i = 1; i <= maxPossibleLessonIndex; i++) {
      let indexOption = <option value={i}>{i}</option>;
      lessonIndexOptions.push(indexOption);
    }

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
          {editLessonTitle}
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
                  {lessonIndexOptions}
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
