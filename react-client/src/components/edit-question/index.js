// @flow

import type { Question } from '../../types';

import React, { Component } from 'react';
import {
  Col,
  Progress,
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
} from 'reactstrap';
import { connect } from 'react-redux';
import { fetchQuestions } from '../../actions';
import RichTextEditor from 'react-rte';
import brace from 'brace';
import AceEditor from 'react-ace';
import FaTrash from 'react-icons/lib/fa/trash';
import FaCopy from 'react-icons/lib/fa/copy';

import 'brace/mode/c_cpp';
import 'brace/snippets/c_cpp';
import 'brace/ext/language_tools';
import 'brace/theme/tomorrow';

type Props = {
  question: Question
}

class EditQuestion extends Component {
  props: Props;

  state: {
    value: RichTextEditor,
    collapse: bool
  };

  constructor(props:Props) {
    super(props)

    this.state = {
      value: RichTextEditor.createValueFromString(this.props.question.instructions, 'html'),
      collapse: false
    }
  }

  onChange = (value:RichTextEditor) => {
    this.setState({value});
  }

  toggle = () => {
    this.setState({ collapse: !this.state.collapse });
  }

  render() {
    return (
      <Card key={this.props.question.id}>
        <CardBlock>
          <CardTitle>{this.props.question.title} <Button onClick={this.toggle}>Edit</Button></CardTitle>
          <Collapse isOpen={this.state.collapse}>
            <Form>
              <FormGroup>
                <Label>Title</Label>
                <Input type="text" defaultValue={this.props.question.title}/>
              </FormGroup>
              <FormGroup>
                <Label>Lesson</Label>
                <Input type="select" name="select">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </Input>
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
                  name={this.props.question.id}
                  editorProps={{$blockScrolling: true}}
                  enableBasicAutocompletion={true}
                  enableLiveAutocompletion={true}
                  enableSnippets={true}
                  value={this.props.question.code}
                  width="100%"
                />
              </FormGroup>
              <FormGroup>
                <Label>Expected Output</Label>
                <Input type="text" defaultValue={this.props.question.expectedOutput}/>
              </FormGroup>
              <FormGroup>
                <Label>Hints</Label>
                <Input type="text" defaultValue={this.props.question.expectedOutput}/>
              </FormGroup>
              <Button color="primary">Save Question</Button>
              <ButtonGroup>
                <Button id={"copy"+this.props.question.id}><FaCopy/></Button>
                <UncontrolledTooltip placement="top" target={"copy"+this.props.question.id}>
                  Copy
                </UncontrolledTooltip>
                <Button color="danger" id={"delete"+this.props.question.id}><FaTrash/></Button>
                <UncontrolledTooltip placement="top" target={"delete"+this.props.question.id}>
                  Delete
                </UncontrolledTooltip>
              </ButtonGroup>
            </Form>
          </Collapse>
        </CardBlock>
      </Card>
    )
  }
}

/*
hints: [String],
topic: { type: mongoo
*/

export default EditQuestion;
