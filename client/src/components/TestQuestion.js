// @flow

import type { Question, Logger } from "../types";

import React, { Component } from "react";
import {
  Card,
  CardBlock,
  CardTitle,
  CardHeader,
  FormGroup,
  InputGroup,
  Label,
  Input,
  Button,
  InputGroupAddon
} from "reactstrap";
import AceEditor from "react-ace";

import "brace";
import "brace/mode/c_cpp";
import "brace/snippets/c_cpp";
import "brace/ext/language_tools";
import "brace/theme/tomorrow";

type Props = {
  userId: string,
  lessonId: string,
  question: Question
};

class TestQuestion extends Component {
  props: Props;

  state: {
    logger: Logger,
    compileOutput: string,
    runOutput: string
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      logger: {
        user: this.props.userId,
        lesson: this.props.lessonId,
        question: this.props.question.id,
        startTime: "",
        endTime: "",
        numCompiles: 0,
        numErrorFreeCompiles: 0,
        numRuns: 0,
        numHints: 0,
        totalAttempts: 0,
        correctAttempts: 0,
        className: this.props.question.className,
        code: this.props.question.code
      },
      compileOutput: "",
      runOutput: ""
    };
  }

  updateClassName = (event: SyntheticEvent): void => {
    let newLogger = Object.assign({}, this.state.logger);
    if (event.target instanceof HTMLInputElement) {
      newLogger.className = event.target.value;
      this.setState({ logger: newLogger });
    }
  };

  updateCode = (event: SyntheticEvent): void => {
    let newLogger = Object.assign({}, this.state.logger);
    if (event.target instanceof HTMLInputElement) {
      newLogger.code = event.target.value;
      this.setState({ logger: newLogger });
    }
  };

  onCompileClick = (event: SyntheticEvent): void => {
    // let newQuestion = Object.assign({}, this.state.question);
    // newQuestion.instructions = newQuestion.instructions.toString("html");
    // newQuestion.hints = newQuestion.hints.map(value => {
    //   return value.toString("html");
    // });
    // this.props.onSave(newQuestion);
  };

  onRunClick = (event: SyntheticEvent): void => {
    // let newQuestion = Object.assign({}, this.state.question);
    // newQuestion.instructions = newQuestion.instructions.toString("html");
    // newQuestion.hints = newQuestion.hints.map(value => {
    //   return value.toString("html");
    // });
    // this.props.onSave(newQuestion);
  };

  onCheckAnswerClick = (event: SyntheticEvent): void => {
    // let newQuestion = Object.assign({}, this.state.question);
    // newQuestion.instructions = newQuestion.instructions.toString("html");
    // newQuestion.hints = newQuestion.hints.map(value => {
    //   return value.toString("html");
    // });
    // this.props.onSave(newQuestion);
  };

  onResetToStarterClick = (event: SyntheticEvent): void => {
    // let newQuestion = Object.assign({}, this.state.question);
    // newQuestion.instructions = newQuestion.instructions.toString("html");
    // newQuestion.hints = newQuestion.hints.map(value => {
    //   return value.toString("html");
    // });
    // this.props.onSave(newQuestion);
  };
  
  onGetHintClick = (event: SyntheticEvent): void => {
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
          <CardTitle>
            {this.props.question.title}
          </CardTitle>
          <div>
            {this.props.question.instructions}
          </div>
          <div>
            <Label>Hints</Label>
            {this.props.question.hints.map((hint, index) => {
              const id = this.props.question.id + "hint" + index;
              return (
                <div key={id}>
                  {hint}
                </div>
              );
            })}
            <Button color="primary" onClick={this.onGetHintClick}>
              Get Hint
            </Button>
          </div>
          <Button color="primary" onClick={this.onResetToStarterClick}>
            Reset to Starter
          </Button>
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
              value={this.state.logger.code}
              onChange={this.updateCode}
              width="100%"
            />
          </FormGroup>
          <Card>
            <CardHeader>
              Compile Output{" "}
              <Button color="primary" onClick={this.onCompileClick}>
                Compile
              </Button>
            </CardHeader>
            <CardBlock>
              {this.state.compileOutput}
            </CardBlock>
          </Card>
          <Card>
            <CardHeader>
              Run Output{" "}
              <Button color="primary" onClick={this.onRunClick}>
                Run
              </Button>
            </CardHeader>
            <CardBlock>
              {this.state.runOutput}
            </CardBlock>
          </Card>
          <Button color="primary" onClick={this.onCheckAnswerClick}>
            Check Answer
          </Button>
        </CardBlock>
      </Card>
    );
  }
}

export default TestQuestion;
