// @flow

import type { Question, Lesson } from "../types";

import React, { Component } from "react";
import {
  Card,
  CardBlock,
  CardTitle,
  Form,
  FormGroup,
  InputGroup,
  Label,
  Input,
  Button,
  InputGroupAddon,
  UncontrolledTooltip,
  Collapse
} from "reactstrap";
import RichTextEditor from "react-rte";
import AceEditor from "react-ace";
import FaTrash from "react-icons/lib/fa/trash";
import InputMoment from "input-moment";
import 'input-moment/dist/input-moment.css';
import type Moment from "moment";
import moment from "moment";
import {Link} from "react-router-dom";

import "brace";
import "brace/mode/c_cpp";
import "brace/snippets/c_cpp";
import "brace/ext/language_tools";
import "brace/theme/tomorrow";

type Props = {
  new: boolean,
  question: Question,
  lessons: Array<Lesson>,
  onSave: Question => void,
  onDelete: string => void,
  showRemoveQuestionFromLessonButton: boolean
};

class EditQuestion extends Component {
  props: Props;

  static defaultProps = {
    new: false,
    showRemoveQuestionFromLessonButton: false
  };

  state: {
    collapse: boolean,
    question: Question
  };

  constructor(props: Props) {
    super(props);

    let newQuestion = Object.assign({}, this.props.question);
    newQuestion.instructions = RichTextEditor.createValueFromString(
      this.props.question.instructions,
      "html"
    );
    newQuestion.hints = newQuestion.hints.map(value => {
      return RichTextEditor.createValueFromString(value, "html");
    });
    if (newQuestion.lesson === null) {
      newQuestion.lesson = "";
    }

    this.state = {
      collapse: false,
      question: newQuestion
    };
  }

  toggle = (): void => {
    this.setState({ collapse: !this.state.collapse });
  };

  updateTitle = (event: Event): void => {
    let newQuestion = Object.assign({}, this.state.question);
    if (event.target instanceof HTMLInputElement) {
      newQuestion.title = event.target.value;
      this.setState({ question: newQuestion });
    }
  };

  updateLesson = (event: Event): void => {
    let newQuestion = Object.assign({}, this.state.question);
    if (event.target instanceof HTMLSelectElement) {
      newQuestion.lesson = event.target.value;
      this.setState({ question: newQuestion });
    }
  };

  updateInstructions = (value: RichTextEditor): void => {
    let newQuestion = Object.assign({}, this.state.question);
    newQuestion.instructions = value;
    this.setState({ question: newQuestion });
  };

  updateTags = (event: Event): void => {
    let newQuestion = Object.assign({}, this.state.question);
    if (event.target instanceof HTMLInputElement) {
      newQuestion.tags = event.target.value;
      this.setState({ question: newQuestion });
    }
  };

  updateClassName = (event: Event): void => {
    let newQuestion = Object.assign({}, this.state.question);
    if (event.target instanceof HTMLInputElement) {
      newQuestion.className = event.target.value;
      this.setState({ question: newQuestion });
    }
  };

  updateReadOnly = (event: SyntheticEvent): void => {
    let newQuestion = Object.assign({}, this.state.question);
    newQuestion.readOnly = event.target.checked;
    this.setState({ question: newQuestion });
  };

  updateCode = (code: String): void => {
    let newQuestion = Object.assign({}, this.state.question);
    newQuestion.code = code;
    this.setState({ question: newQuestion });
  };

  updateExpectedOutput = (event: Event): void => {
    let newQuestion = Object.assign({}, this.state.question);
    newQuestion.expectedOutput = event.target.value;
    this.setState({ question: newQuestion });
  };

  updateHint = (id: number): ((value: RichTextEditor) => void) => {
    return (value: RichTextEditor): void => {
      let newQuestion = Object.assign({}, this.state.question);
      newQuestion.hints[id] = value;
      this.setState({ question: newQuestion });
    };
  };

  updateDueDate = (m: Moment): void => {
    let newQuestion = Object.assign({}, this.state.question);
    newQuestion.dueDate = m.toDate();
    this.setState({ question: newQuestion });
  }

  onExportAsJSONClick = (): void => {
    let tempElement = document.createElement("a");
    let question = Object.assign({}, this.state.question);
    question.instructions = question.instructions.toString("html");
    question.hints = question.hints.map(value => {
      return value.toString("html");
    });
    question.lesson = question.lesson || null;
    let questionBlobFile = new Blob([JSON.stringify(question)], {type: 'text/plain'});
    tempElement.href = URL.createObjectURL(questionBlobFile);
    tempElement.download = `${this.state.question.title.replace(/ /g, "")}.txt`;
    tempElement.click();
  };

  onDeleteQuestionClick = (): void => {
    let confirmMsg = `Are you sure you want to delete question "${this.props.question.title}"? (It's permanent!)`;
    let confirmed = window.confirm(confirmMsg);
    if (confirmed) {
      let id = this.props.question.id;
      this.props.onDelete(id);
    }
  }

  onDeleteHintClick = (id: number): ((value: RichTextEditor) => void) => {
    return (): void => {
      let newQuestion = Object.assign({}, this.state.question);
      newQuestion.hints.splice(id, 1);
      this.setState({ question: newQuestion });
    };
  };

  onAddHintClick = (): void => {
    let newQuestion = Object.assign({}, this.state.question);
    newQuestion.hints = [
      ...this.state.question.hints,
      RichTextEditor.createValueFromString("", "html")
    ];
    this.setState({ question: newQuestion });
  };

  onSaveClick = (event: Event): void => {
    event.preventDefault();
    let newQuestion = Object.assign({}, this.state.question);
    newQuestion.instructions = newQuestion.instructions.toString("html");
    newQuestion.hints = newQuestion.hints.map(value => {
      return value.toString("html");
    });
    if (newQuestion.lesson === "") {
      newQuestion.lesson = null;
    }
    this.props.onSave(newQuestion);
  };

  onRemoveDueDateClick = (): void => {
    let newQuestion = Object.assign({}, this.state.question);
    newQuestion.dueDate = null;
    this.setState({ question: newQuestion });
  }

  onRemoveQuestionFromLessonClick = (event: Event): void => {
    event.preventDefault();
    let newQuestion = Object.assign({}, this.state.question);
    newQuestion.lesson = null;
    this.setState({ question: newQuestion }, () => {
      this.onSaveClick(event);
    });
  }

  render() {
    let dueDateText, inputMomentDefault;
    if (!this.state.question.dueDate) {
      dueDateText = "No due date for this question";
      inputMomentDefault = moment();
    } else {
      inputMomentDefault = moment(this.state.question.dueDate);
      dueDateText = inputMomentDefault.format("llll");
    }

    return (
      <Card key={this.state.question.id}>
        <CardBlock>
          <CardTitle className="mb-0">
            {this.state.question.title}{" "}
            <Button style={{marginLeft: "5px"}} onClick={this.toggle}>Edit</Button>
            <Button style={{marginLeft: "10px"}} hidden={this.props.new} onClick={this.onExportAsJSONClick}>Export as JSON</Button>
            <Link style={{marginLeft: "10px"}}
                    hidden={this.props.new}
                    to={`/admin/questions/new/${this.props.question.id}`}>
                    <Button>Copy Question</Button>
            </Link>
            <Button style={{marginLeft: "10px"}}
                    onClick={this.onRemoveQuestionFromLessonClick}
                    hidden={!this.props.showRemoveQuestionFromLessonButton}>
              Remove from Lesson
            </Button>
            <Button color="danger"
                    id={"delete" + this.state.question.id}
                    style={{marginLeft: "10px"}}
                    hidden={this.props.new}
                    onClick={this.onDeleteQuestionClick}>
              <FaTrash />
            </Button>
            <UncontrolledTooltip
              placement="top"
              target={"delete" + this.state.question.id}
            >
              Delete Question From Database
            </UncontrolledTooltip>
          </CardTitle>
          <Collapse isOpen={this.state.collapse}>
            <Form>
              <FormGroup>
                <Label>Title</Label>
                <Input
                  type="text"
                  value={this.state.question.title}
                  onChange={this.updateTitle}
                />
              </FormGroup>
              <FormGroup>
                <Label>Lesson</Label>
                <Input
                  type="select"
                  name="select"
                  value={this.state.question.lesson || ""}
                  onChange={this.updateLesson}
                >
                  <option value="">No Lesson</option>
                  {this.props.lessons.map((lesson: Lesson) => {
                    return (
                      <option key={lesson.id} value={lesson.id}>
                        {lesson.title}
                      </option>
                    );
                  })}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label>Instructions</Label>
                <RichTextEditor
                  value={this.state.question.instructions}
                  onChange={this.updateInstructions}
                />
              </FormGroup>
              <FormGroup>
                <Label>Tags</Label>
                <Input
                  type="text"
                  value={this.state.question.tags}
                  onChange={this.updateTags}
                />
              </FormGroup>
              <FormGroup>
                <Label>Class Name</Label>
                <InputGroup>
                  <Input
                    type="text"
                    value={this.state.question.className}
                    onChange={this.updateClassName}
                  />
                  <InputGroupAddon>.c</InputGroupAddon>
                </InputGroup>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    checked={this.state.question.readOnly}
                    onChange={this.updateReadOnly}
                  />
                  Read Only
                </Label>
              </FormGroup>
              <FormGroup>
                <Label>Code</Label>
                <AceEditor
                  mode="c_cpp"
                  theme="tomorrow"
                  name={this.state.question.id}
                  editorProps={{ $blockScrolling: true }}
                  enableBasicAutocompletion={true}
                  enableLiveAutocompletion={true}
                  enableSnippets={true}
                  value={this.state.question.code}
                  onChange={this.updateCode}
                  width="100%"
                />
              </FormGroup>
              <FormGroup>
                <Label>Expected Output</Label>
                <Input
                  type="textarea"
                  value={this.state.question.expectedOutput}
                  onChange={this.updateExpectedOutput}
                />
              </FormGroup>
              <FormGroup>
                <Label>Hints</Label>
                {this.state.question.hints.map((hint, index) => {
                  const id = this.state.question.id + "hint" + index;
                  return (
                    <div key={id}>
                      <RichTextEditor
                        value={hint}
                        onChange={this.updateHint(index)}
                      />
                      <Button
                        color="danger"
                        id={"delete" + id}
                        onClick={this.onDeleteHintClick(index)}
                      >
                        <FaTrash />
                      </Button>
                      <UncontrolledTooltip
                        placement="top"
                        target={"delete" + id}
                      >
                        Delete
                      </UncontrolledTooltip>
                    </div>
                  );
                })}
                <Button onClick={this.onAddHintClick}>Add Hint</Button>
              </FormGroup>
              <FormGroup>
                <Label>Due Date</Label>
                <Input
                  type="text"
                  value={dueDateText}
                  readOnly
                />
                <div>
                  <Button style={{margin: "10px"}} onClick={this.onRemoveDueDateClick}>Remove Due Date</Button>
                </div>
                <InputMoment
                  moment={inputMomentDefault}
                  onChange={this.updateDueDate}
                />
              </FormGroup>
              <Button color="primary" onClick={this.onSaveClick}>
                Save Question
              </Button>
            </Form>
          </Collapse>
        </CardBlock>
      </Card>
    );
  }
}

export default EditQuestion;
