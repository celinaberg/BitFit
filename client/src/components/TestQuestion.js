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
  Alert,
  Badge
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
        error: null,
        stdout: "",
        stderr: ""
      },
      runOutput: {
        error: null,
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
    this.setState({ loading: false, logger });
  }

  saveLogger(logger: Logger) {
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
      let newLogger = Object.assign({}, this.state.logger);
      newLogger.expectedOutput = event.target.value;
      this.setState({ logger: newLogger });
      this.saveLogger({
        id: newLogger.id,
        expectedOutput: newLogger.expectedOutput
      });
  };

  onCompileClick = async () => {
    let newLogger = Object.assign({}, this.state.logger);
    newLogger.numCompiles = this.state.logger.numCompiles + 1;
    newLogger.endTime = new Date().getTime();
    this.setState({ logger: newLogger });
    this.saveLogger({ id: newLogger.id, numCompiles: newLogger.numCompiles, endTime: newLogger.endTime });
    const loggerRequest = await fetch(
      "/api/clis/compile/" + this.state.logger.id,
      {
        credentials: "include"
      }
    );
    const compileOutput = await loggerRequest.json();
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
    newLogger.endTime = new Date().getTime();
    this.setState({ logger: newLogger });
    this.saveLogger({ id: newLogger.id, numRuns: newLogger.numRuns, endTime: newLogger.endTime });
    const loggerRequest = await fetch("/api/clis/run/" + this.state.logger.id, {
      credentials: "include"
    });
    const runOutput = await loggerRequest.json();
    this.setState({ runOutput });
  };

  checkAnswer() {
    let newLogger = Object.assign({}, this.state.logger);
    newLogger.totalAttempts = this.state.logger.totalAttempts + 1;
    newLogger.endTime = new Date().getTime();
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
      correctAttempts: newLogger.correctAttempts,
      endTime: newLogger.endTime
    });
  }

  async checkReadOnlyAnswer() {
    let newLogger = Object.assign({}, this.state.logger);
    newLogger.totalAttempts = this.state.logger.totalAttempts + 1;
    newLogger.endTime = new Date().getTime();
    //const compileRequest =
    await fetch(
      "/api/clis/compile/" + this.state.logger.id,
      {
        credentials: "include"
      }
    );
    //const compileOutput = await compileRequest.json();
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
      correctAttempts: newLogger.correctAttempts,
      endTime: newLogger.endTime
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
    newLogger.numHintsDisplayed = 0;
    if (this.props.question.readOnly)
      newLogger.expectedOutput = "";
    this.setState({ logger: newLogger });
    this.saveLogger({
      id: newLogger.id,
      className: newLogger.className,
      code: newLogger.code,
      expectedOutput: newLogger.expectedOutput,
      numHints: newLogger.numHints,
      numHintsDisplayed: newLogger.numHintsDisplayed
    });

    let newCompileOutput = Object.assign({}, this.state.compileOutput);
    newCompileOutput.error = null;
    newCompileOutput.stdout = "";
    newCompileOutput.stderr = "";
    this.setState({compileOutput: newCompileOutput});

    let newRunOutput = Object.assign({}, this.state.runOutput);
    newRunOutput.error = null;
    newRunOutput.stdout = "";
    newRunOutput.stderr = "";
    this.setState({runOutput: newRunOutput});
  };

  onGetHintClick = (event: SyntheticEvent): void => {
    if (this.state.logger.numHintsDisplayed < this.props.question.hints.length) {
      let newLogger = Object.assign({}, this.state.logger);
      newLogger.numHints = this.state.logger.numHints + 1;
      newLogger.numHintsDisplayed = this.state.logger.numHintsDisplayed + 1;
      this.setState({ logger: newLogger });
      this.saveLogger({ id: newLogger.id, numHints: newLogger.numHints,
                                          numHintsDisplayed: newLogger.numHintsDisplayed });
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
              type="textarea"
              value={this.state.logger.expectedOutput}
              onChange={this.updateExpectedOutput}
            />
          </InputGroup>
        </FormGroup>
      );
    } else {

      let compileBadge = null;
      if (this.state.compileOutput.error) {
        compileBadge = (
          <Badge color="danger" pill>
            Error
          </Badge>
        );
      } else if (this.state.compileOutput.error === false) {
        compileBadge = (
          <Badge color="success" pill>
            Success
          </Badge>
        );
      }

      let runBadge = null;
      if (this.state.runOutput.error) {
        runBadge = (
          <Badge color="danger" pill>
            Error
          </Badge>
        );
      } else if (this.state.runOutput.error === false) {
        runBadge = (
          <Badge color="success" pill>
            Success
          </Badge>
        );
      }
      output = (
        <div>
          <Card>
            <CardHeader>
              Compile Output{" "}
              <Button color="primary" onClick={this.onCompileClick}>
                Compile
              </Button>
              {compileBadge}
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
              {runBadge}
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
    let hintsLeft = this.props.question.hints.length - this.state.logger.numHintsDisplayed;
    return (
      <Card key={this.props.question.id}>
        <CardBlock>
          <CardTitle>
            {this.props.question.title}
            <Button color="primary" onClick={this.onResetToStarterClick}>
              Reset to Starter
            </Button>
          </CardTitle>
          <div
            dangerouslySetInnerHTML={{
              __html: this.props.question.instructions
            }}
          />
          <Card>
            <CardHeader>
              Hints{" "}
              <Button color="primary" onClick={this.onGetHintClick}>
                Get Hint
              </Button>
              <p>number of hints left: {hintsLeft} </p>
            </CardHeader>
            <CardBlock>
              <div>
                {this.props.question.hints
                  .slice(0, this.state.logger.numHintsDisplayed)
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
              </div>
              <div>
                <p> <strong> number of hints left:</strong> {hintsLeft} </p>
              </div>
            </CardBlock>
          </Card>
          <FormGroup>
            <Label>file name</Label>
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
