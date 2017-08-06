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
              <Input type="text" onChange={this.onTitleChange} value={this.props.question.title}/>
            </FormGroup>
            <FormGroup>
              <Label>Instructions</Label>
              <RichTextEditor value={this.state.value} onChange={this.onChange}/>
            </FormGroup>
            <FormGroup>
              <Label>Tags</Label>
              <Input type="text" onChange={this.onTitleChange} value={this.props.question.tags}/>
            </FormGroup>
            <FormGroup>
              <Label>Class Name</Label>
              <InputGroup>
                <Input type="text" onChange={this.onTitleChange} value={this.props.question.className}/>
                <InputGroupAddon>.c</InputGroupAddon>
              </InputGroup>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="checkbox" />{' '}
                Read Only
              </Label>
            </FormGroup>
            <FormGroup>
              <Label>Expected Output</Label>
              <Input type="text" onChange={this.onTitleChange} value={this.props.question.expectedOutput}/>
            </FormGroup>
            <Button color="primary">Save Question</Button>
          </Form>
        </CardBlock>
      </Card>
    )
  }
}

/*
code: String,
hints: [String],
codeEvaluator: String,
topic: { type: mongoo
*/

export default Question;
