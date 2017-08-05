import React, { Component } from 'react';
import { Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';

class NewLesson extends Component {
  render() {
    return (
      <Col sm="9" md="10">
        <h2 className="page-header">New Lesson</h2>

        <div>
          <Form>
            <FormGroup>
              <Label for="inputLessonTitle">Lesson Title</Label>
              <Input type="text" id="inputLessonTitle" placeholder="Title"/>
            </FormGroup>
            <FormGroup>
              <Label for="inputBackground">Topic Background</Label>
              <text-angular placeholder="Add topic background info here"></text-angular>
            </FormGroup>
            <Button color="success">Add Lesson</Button>
          </Form>
        </div>
      </Col>
    );
  }
}

export default NewLesson;
