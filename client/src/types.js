// @flow

import RichTextEditor from "react-rte";

export type Role = "student" | "teaching-assistant" | "instructor";

export type User = {
  +id: string,
  +uid: string,
  +firstName: string,
  +lastName: string,
  +displayName: string,
  +role: Role,
  +studentNumber: ?string,
  +employeeNumber: ?string,
  +section: ?string,
  +term: ?number,
  +session: ?string,
  +year: ?number
};

export type Lesson = {
  +id: string,
  +title: string,
  +background: string,
  +questions: Array<Question>
};

export type Question = {
  +id: string,
  +title: string,
  +instructions: string,
  +code: string,
  +className: string,
  +readOnly: boolean,
  +hints: Array<string>,
  +tags: string,
  +expectedOutput: string,
  +topic: Lesson
};

export type UserState = {
  +fetching: boolean,
  +fetched: boolean,
  +users: Array<User>,
  +error: null
};

export type LessonState = {
  +fetching: boolean,
  +fetched: boolean,
  +lessons: Array<Lesson>,
  +error: null,
  +new: {
    +title: string,
    +background: RichTextEditor
  }
};

export type QuestionState = {
  +fetching: boolean,
  +fetched: boolean,
  +questions: Array<Question>,
  +error: null
};

export type AuthState = {
  +loggedIn: boolean,
  +firstName: ?string,
  +lastName: ?string,
  +displayName: ?string,
  +cwl: ?string,
  +role: Role
};

export type NavBarState = {
  +isOpen: boolean
};

export type State = {
  +auth: AuthState,
  +lessons: LessonState,
  +navbar: NavBarState,
  +questions: QuestionState,
  +users: UserState
};
