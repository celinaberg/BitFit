import React, { Component } from 'react';
import AdminSidebar from '../../components/admin-sidebar';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';

class NewLesson extends Component {
  render() {
    return (
      <div className="col-sm-9 col-md-10 main">
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
      </div>
    );
  }
}

export default NewLesson;
