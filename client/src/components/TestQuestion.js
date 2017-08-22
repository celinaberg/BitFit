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
  ButtonGroup,
  InputGroupAddon,
  UncontrolledTooltip,
  Collapse
} from "reactstrap";
import RichTextEditor from "react-rte";
import AceEditor from "react-ace";
import FaTrash from "react-icons/lib/fa/trash";
import FaCopy from "react-icons/lib/fa/copy";

import "brace";
import "brace/mode/c_cpp";
import "brace/snippets/c_cpp";
import "brace/ext/language_tools";
import "brace/theme/tomorrow";

type Props = {
  question: Question
};

class EditQuestion extends Component {
  props: Props;

  state: {
    test: string
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      test: "test"
    };
  }
  
  updateClassName = (event: Event): void => {
    // let newQuestion = Object.assign({}, this.state.question);
    // if (event.target instanceof HTMLInputElement) {
    //   newQuestion.className = event.target.value;
    //   this.setState({ question: newQuestion });
    // }
  };
  
  updateCode = (event: Event): void => {
    // let newQuestion = Object.assign({}, this.state.question);
    // if (event.target instanceof HTMLInputElement) {
    //   newQuestion.code = event.target.value;
    //   this.setState({ question: newQuestion });
    // }
  };
  
  onSaveClick = (event: Event): void => {
    event.preventDefault();
    // let newQuestion = Object.assign({}, this.state.question);
    // newQuestion.instructions = newQuestion.instructions.toString("html");
    // newQuestion.hints = newQuestion.hints.map(value => {
    //   return value.toString("html");
    // });
    // this.props.onSave(newQuestion);
  };

  render() {
    return (
      <Card key={this.props.question.id}>
        <CardBlock>
          <CardTitle>{this.props.question.title}</CardTitle>
          <div>{this.props.question.instructions}</div>
          <div>
            <Label>Hints</Label>
            {this.props.question.hints.map((hint, index) => {
              const id = this.props.question.id + "hint" + index;
              return (
                <div key={id}>{hint}</div>
              );
            })}
          </div>
          <FormGroup>
            <Label>Class Name</Label>
            <InputGroup>
              <Input
                type="text"
                value={this.props.question.className}
                onChange={this.updateClassName}
              />
              <InputGroupAddon>.c</InputGroupAddon>
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label>Code</Label>
            <AceEditor
              mode="c_cpp"
              theme="tomorrow"
              name={this.props.question.id}
              editorProps={{ $blockScrolling: true }}
              enableBasicAutocompletion={true}
              enableLiveAutocompletion={true}
              enableSnippets={true}
              value={this.props.question.code}
              onChange={this.updateCode}
              width="100%"
            />
          </FormGroup>
          <Button color="primary" onClick={this.onSaveClick}>
            Compile
          </Button>
          <Button color="primary" onClick={this.onSaveClick}>
            Run
          </Button>
          <Button color="primary" onClick={this.onSaveClick}>
            Check Answer
          </Button>
        </CardBlock>
      </Card>
    );
  }
}

export default EditQuestion;
