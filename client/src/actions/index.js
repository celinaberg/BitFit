// @flow

import type { Action, ThunkAction } from "./types";
import type { Question } from "../types";

import axios from "axios";
import RichTextEditor from "react-rte";

export const fetchLessons = (): Action => {
  return {
    type: "FETCH_LESSONS",
    payload: axios.get("/api/lessons")
  };
};

export const updateNewLesson = (
  title: string,
  background: RichTextEditor
): Action => {
  return {
    type: "UPDATE_NEW_LESSON",
    payload: {
      title,
      background
    }
  };
};

export const saveNewLesson = (title: string, background: string): Action => {
  return {
    type: "SAVE_NEW_LESSON",
    payload: axios.post("/api/lessons", {
      title,
      background
    })
  };
};

export const saveLesson = (
  id: string,
  title: string,
  background: string
): Action => {
  return {
    type: "SAVE_LESSON",
    payload: axios.put("/api/lessons/" + id, {
      title,
      background
    })
  };
};

export const toggleNavBar = (): Action => {
  return {
    type: "TOGGLE_NAVBAR"
  };
};

export const fetchUsers = (): Action => {
  return {
    type: "FETCH_USERS",
    payload: axios.get("/api/users")
  };
};

export const deleteUser = (id: string): Action => {
  return {
    type: "DELETE_USER",
    payload: axios.delete("/api/users/" + id)
  };
};

export const fetchQuestions = (): Action => {
  return {
    type: "FETCH_QUESTIONS",
    payload: axios.get("/api/questions")
  };
};

export const saveQuestion = (question: Question): ThunkAction => {
  return dispatch => {
    dispatch({
      type: "SAVE_QUESTION_PENDING"
    });
    axios
      .patch("/api/questions/" + question.id, question)
      .then(rsp => {
        dispatch({
          type: "SAVE_QUESTION_FULFILLED",
          payload: rsp.data
        });
        dispatch(fetchQuestions());
      });
  };
};

export const saveNewQuestion = (question: Question): ThunkAction => {
  return dispatch => {
    dispatch({
      type: "SAVE_NEW_QUESTION_PENDING"
    });
    axios.post("/api/questions/", question).then(rsp => {
      dispatch({
        type: "SAVE_NEW_QUESTION_FULFILLED",
        payload: rsp.data
      });
      dispatch(fetchQuestions());
    });
  };
};

export const checkLogin = (): Action => {
  return {
    type: "CHECK_LOGIN",
    payload: axios.get("/api/users/me")
  };
};
