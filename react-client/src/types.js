// @flow

import RichTextEditor from 'react-rte';

export type Role = "student" | "teaching-assistant" | "instructor";

export type User = {
  id: string,
  uid: string,
  firstName: string,
  lastName: string,
  displayName: string,
  role: Role,
  studentNumber: ?string,
  employeeNumber: ?string,
  section: ?string,
  term: ?number,
  session: ?string,
  year: ?number
};

export type Lesson = {
  id: string,
  title: string,
  background: string,
  questions: Array<Question>
};

export type Question = {
  id: string,
  title: string,
  instructions: string,
  code: string,
  className: string,
  readOnly: bool,
  hints: Array<string>,
  tags: string,
  expectedOutput: string,
  topic: Lesson
};

export type UserState = {
  fetching: bool,
  fetched: bool,
  users: Array<User>,
  error: null
}

export type LessonState = {
  fetching: bool,
  fetched: bool,
  lessons: Array<Lesson>,
  error: null,
  new: {
    title: string,
    background: RichTextEditor
  }
}

export type QuestionState = {
  fetching: bool,
  fetched: bool,
  questions: Array<Question>,
  error: null
}

export type State = {
  users: UserState,
  lessons: LessonState,
  questions: QuestionState
}
