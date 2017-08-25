// @flow
import type { State, Question } from "../types";

import RichTextEditor from "react-rte";

export type FetchLessonsAction = { type: "FETCH_LESSONS", payload: any };
export type UpdateNewLessonAction = {
  type: "UPDATE_NEW_LESSON",
  payload: { title: string, background: RichTextEditor }
};
export type SaveNewLessonAction = {
  type: "SAVE_NEW_LESSON",
  payload: { title: string, background: string }
};
export type SaveLessonAction = {
  type: "SAVE_LESSON",
  payload: { id: string, title: string, background: string }
};
export type LoginAction = { type: "LOGIN" };
export type ToggleNavbarAction = { type: "TOGGLE_NAVBAR" };
export type FetchUsersAction = { type: "FETCH_USERS", payload: any };
export type DeleteUserAction = { type: "DELETE_USER", payload: any };
export type FetchQuestionsAction = { type: "FETCH_QUESTIONS", payload: any };
export type SaveQuestionPendingAction = { type: "SAVE_QUESTION_PENDING" };
export type SaveQuestionFulfilledAction = {
  type: "SAVE_QUESTION_FULFILLED",
  payload: Question
};
export type SaveNewQuestionPendingAction = {
  type: "SAVE_NEW_QUESTION_PENDING"
};
export type SaveNewQuestionFulfilledAction = {
  type: "SAVE_NEW_QUESTION_FULFILLED"
};

export type Action =
  | FetchLessonsAction
  | UpdateNewLessonAction
  | SaveNewLessonAction
  | SaveLessonAction
  | LoginAction
  | ToggleNavbarAction
  | FetchUsersAction
  | DeleteUserAction
  | FetchQuestionsAction
  | SaveQuestionPendingAction
  | SaveQuestionFulfilledAction
  | SaveNewQuestionPendingAction
  | SaveNewQuestionFulfilledAction;

export type Dispatch = (
  action: Action | ThunkAction | PromiseAction | Array<Action>
) => any;
export type GetState = () => State;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;
