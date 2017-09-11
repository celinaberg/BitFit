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
  InputGroupAddon,
  Alert
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
    loading: boolean,
    logger: ?Logger,
    compileOutput: {
      error: boolean,
      stdout: string,
      stderr: string
    },
    runOutput: {
      error: boolean,
      stdout: string,
      stderr: string
    },
    checkAnswer: ?boolean
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      loading: true,
      logger: null,
      compileOutput: {
        error: false,
        stdout: "",
        stderr: ""
      },
      runOutput: {
        error: false,
        stdout: "",
        stderr: ""
      },
      checkAnswer: null
    };
  }

  componentDidMount() {
    this.getLogger();
  }

  async getLogger() {
    const loggerRequest = await fetch(
      "/api/loggers/q/" + this.props.question.id,
      {
        credentials: "include"
      }
    );
    const logger = await loggerRequest.json();
    console.log("got logger", logger);
    this.setState({ loading: false, logger });
  }

  saveLogger(logger: Logger) {
    console.log(logger);
    fetch("/api/loggers/" + logger.id, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      credentials: "include",
      body: JSON.stringify(logger)
    });
  }

  updateClassName = (event: SyntheticEvent): void => {
    if (event.target instanceof HTMLInputElement) {
      let newLogger = Object.assign({}, this.state.logger);
      newLogger.className = event.target.value;
      this.setState({ logger: newLogger });
      this.saveLogger({ id: newLogger.id, className: newLogger.className });
    }
  };

  updateCode = (code: string): void => {
    let newLogger = Object.assign({}, this.state.logger);
    newLogger.code = code;
    this.setState({ logger: newLogger });
    this.saveLogger({ id: newLogger.id, code: newLogger.code });
  };

  updateExpectedOutput = (event: SyntheticEvent): void => {
    if (event.target instanceof HTMLInputElement) {
      let newLogger = Object.assign({}, this.state.logger);
      newLogger.expectedOutput = event.target.value;
      this.setState({ logger: newLogger });
      this.saveLogger({
        id: newLogger.id,
        expectedOutput: newLogger.expectedOutput
      });
    }
  };

  onCompileClick = async () => {
    let newLogger = Object.assign({}, this.state.logger);
    newLogger.numCompiles = this.state.logger.numCompiles + 1;
    this.setState({ logger: newLogger });
    this.saveLogger({ id: newLogger.id, numCompiles: newLogger.numCompiles });
    const loggerRequest = await fetch(
      "/api/clis/compile/" + this.state.logger.id,
      {
        credentials: "include"
      }
    );
    const compileOutput = await loggerRequest.json();
    console.log("got output", compileOutput);
    this.setState({ compileOutput });
    if (!compileOutput.error) {
      newLogger.numErrorFreeCompiles =
        this.state.logger.numErrorFreeCompiles + 1;
      this.setState({ logger: newLogger });
      this.saveLogger({
        id: newLogger.id,
        numErrorFreeCompiles: newLogger.numErrorFreeCompiles
      });
    }
  };

  onRunClick = async () => {
    let newLogger = Object.assign({}, this.state.logger);
    newLogger.numRuns = this.state.logger.numRuns + 1;
    this.setState({ logger: newLogger });
    this.saveLogger({ id: newLogger.id, numRuns: newLogger.numRuns });
    const loggerRequest = await fetch("/api/clis/run/" + this.state.logger.id, {
      credentials: "include"
    });
    const runOutput = await loggerRequest.json();
    console.log("got output", runOutput);
    this.setState({ runOutput });
  };

  checkAnswer() {
    let newLogger = Object.assign({}, this.state.logger);
    newLogger.totalAttempts = this.state.logger.totalAttempts + 1;
    if (this.state.runOutput.stdout === this.props.question.expectedOutput) {
      newLogger.correctAttempts = this.state.logger.correctAttempts + 1;
      this.setState({ checkAnswer: true });
    } else {
      this.setState({ checkAnswer: false });
    }
    this.setState({ logger: newLogger });
    this.saveLogger({
      id: newLogger.id,
      totalAttempts: newLogger.totalAttempts,
      correctAttempts: newLogger.correctAttempts
    });
  }

  async checkReadOnlyAnswer() {
    let newLogger = Object.assign({}, this.state.logger);
    newLogger.totalAttempts = this.state.logger.totalAttempts + 1;
    const compileRequest = await fetch(
      "/api/clis/compile/" + this.state.logger.id,
      {
        credentials: "include"
      }
    );
    const runRequest = await fetch("/api/clis/run/" + this.state.logger.id, {
      credentials: "include"
    });
    const runOutput = await runRequest.json();
    if (runOutput.stdout === this.state.logger.expectedOutput) {
      newLogger.correctAttempts = this.state.logger.correctAttempts + 1;
      this.setState({ checkAnswer: true });
    } else {
      this.setState({ checkAnswer: false });
    }
    this.setState({ logger: newLogger });
    this.saveLogger({
      id: newLogger.id,
      totalAttempts: newLogger.totalAttempts,
      correctAttempts: newLogger.correctAttempts
    });
  }

  onCheckAnswerClick = (): void => {
    if (this.props.question.readOnly) {
      this.checkReadOnlyAnswer();
    } else {
      this.checkAnswer();
    }
  };

  onResetToStarterClick = (event: SyntheticEvent): void => {
    let newLogger = Object.assign({}, this.state.logger);
    newLogger.className = this.props.question.className;
    newLogger.code = this.props.question.code;
    this.setState({ logger: newLogger });
    this.saveLogger({
      id: newLogger.id,
      className: newLogger.className,
      code: newLogger.code
    });
  };

  onGetHintClick = (event: SyntheticEvent): void => {
    if (this.state.logger.numHints < this.props.question.hints.length) {
      let newLogger = Object.assign({}, this.state.logger);
      newLogger.numHints = this.state.logger.numHints + 1;
      this.setState({ logger: newLogger });
      this.saveLogger({ id: newLogger.id, numHints: newLogger.numHints });
    }
  };

  render() {
    if (this.state.loading) {
      return (
        <Card key={this.props.question.id}>
          <CardBlock>
            <CardTitle>
              {this.props.question.title}
            </CardTitle>
            <div>Loading...</div>
          </CardBlock>
        </Card>
      );
    }
    let checkAnswer = null;
    if (this.state.checkAnswer === true) {
      checkAnswer = (
        <Alert color="success">
          <strong>Well done!</strong> You successfully completed this problem.
        </Alert>
      );
    } else if (this.state.checkAnswer === false) {
      checkAnswer = (
        <Alert color="danger">
          <strong>Oh no!</strong> You still have some work to do.
        </Alert>
      );
    }
    let output = null;
    if (this.props.question.readOnly) {
      output = (
        <FormGroup>
          <Label>Expected Output</Label>
          <InputGroup>
            <Input
              type="text"
              value={this.state.logger.expectedOutput}
              onChange={this.updateExpectedOutput}
            />
          </InputGroup>
        </FormGroup>
      );
    } else {
      output = (
        <div>
          <Card>
            <CardHeader>
              Compile Output{" "}
              <Button color="primary" onClick={this.onCompileClick}>
                Compile
              </Button>
            </CardHeader>
            <CardBlock>
              <p>
                <strong>stdout</strong>
              </p>
              {this.state.compileOutput.stdout.split("\n").map((item, key) => {
                return (
                  <span key={key}>
                    {item}
                    <br />
                  </span>
                );
              })}
            </CardBlock>
            <CardBlock>
              <p>
                <strong>stderr</strong>
              </p>
              {this.state.compileOutput.stderr.split("\n").map((item, key) => {
                return (
                  <span key={key}>
                    {item}
                    <br />
                  </span>
                );
              })}
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
              <p>
                <strong>stdout</strong>
              </p>
              {this.state.runOutput.stdout.split("\n").map((item, key) => {
                return (
                  <span key={key}>
                    {item}
                    <br />
                  </span>
                );
              })}
            </CardBlock>
            <CardBlock>
              <p>
                <strong>stderr</strong>
              </p>
              {this.state.runOutput.stderr.split("\n").map((item, key) => {
                return (
                  <span key={key}>
                    {item}
                    <br />
                  </span>
                );
              })}
            </CardBlock>
          </Card>
        </div>
      );
    }
    return (
      <Card key={this.props.question.id}>
        <CardBlock>
          <CardTitle>
            {this.props.question.title}
          </CardTitle>
          <div
            dangerouslySetInnerHTML={{
              __html: this.props.question.instructions
            }}
          />
          <div>
            <Label>Hints</Label>
            {this.props.question.hints
              .slice(0, this.state.logger.numHints)
              .map((hint, index) => {
                const id = this.props.question.id + "hint" + index;
                return (
                  <div
                    key={id}
                    dangerouslySetInnerHTML={{
                      __html: hint
                    }}
                  />
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
                value={this.state.logger.className}
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
              readOnly={this.props.question.readOnly}
            />
          </FormGroup>
          {output}
          <Button color="primary" onClick={this.onCheckAnswerClick}>
            Check Answer
          </Button>
          {checkAnswer}
        </CardBlock>
      </Card>
    );
  }
}

export default TestQuestion;
