'use strict';

export type User = {
  uid: string,
  firstName: string,
  lastName: string,
  displayName: string,
  role: "student" | "teaching-assistant" | "instructor",
  studentNumber: ?string,
  employeeNumber: ?string,
  section: ?string,
  term: ?number,
  session: ?string,
  year: ?number
};

export type Lesson = {
  title: string,
  background: string,
  questions: Array<Question>
};

export type Question = {
  title: string,
  instructions: string,
  code: string,
  className: String,
  readOnly: bool,
  hints: Array<String>,
  tags: string,
  expectedOutput: string,
  topic: Lesson
};
