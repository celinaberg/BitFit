import React, { Component } from 'react';
import {
  Col,
  Progress,
  Card,
  CardBlock,
  Form,
  FormGroup,
  InputGroup,
  Label,
  Input,
  Button,
  InputGroupAddon
} from 'reactstrap';
import { connect } from 'react-redux';
import { fetchQuestions } from '../../actions';
import RichTextEditor from 'react-rte';
import PropTypes from 'prop-types';
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/c_cpp';
import 'brace/snippets/c_cpp';
import 'brace/ext/language_tools';
import 'brace/theme/tomorrow';

class Question extends Component {
  static propTypes = {
    onChange: PropTypes.func
  };

  constructor(state) {
    super(state)

    this.state = {
      value: RichTextEditor.createValueFromString(this.props.question.instructions, 'html')
    }
  }

  onChange = (value) => {
    this.setState({value});
  };

  render() {
    return (
      <Card key={this.props.question._id}>
        <CardBlock>
          <Form>
            <FormGroup>
              <Label>Title</Label>
              <Input type="text" defaultValue={this.props.question.title}/>
            </FormGroup>
            <FormGroup>
              <Label>Instructions</Label>
              <RichTextEditor onChange={this.onChange} value={this.state.value} />
            </FormGroup>
            <FormGroup>
              <Label>Tags</Label>
              <Input type="text" defaultValue={this.props.question.tags}/>
            </FormGroup>
            <FormGroup>
              <Label>Class Name</Label>
              <InputGroup>
                <Input type="text" defaultValue={this.props.question.className}/>
                <InputGroupAddon>.c</InputGroupAddon>
              </InputGroup>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="checkbox"/>
                Read Only
              </Label>
            </FormGroup>
            <FormGroup>
              <Label>Code</Label>
              <AceEditor
                mode="c_cpp"
                theme="tomorrow"
                name={this.props.question._id}
                editorProps={{$blockScrolling: true}}
                enableBasicAutocompletion={true}
                enableLiveAutocompletion={true}
                enableSnippets={true}
                value={this.props.question.code}
              />
            </FormGroup>
            <FormGroup>
              <Label>Expected Output</Label>
              <Input type="text" defaultValue={this.props.question.expectedOutput}/>
            </FormGroup>
            <Button color="primary">Save Question</Button>
          </Form>
        </CardBlock>
      </Card>
    )
  }
}

/*
hints: [String],
codeEvaluator: String,
topic: { type: mongoo
*/

export default Question;
