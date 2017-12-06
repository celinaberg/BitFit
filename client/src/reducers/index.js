// @flow

import { combineReducers } from "redux";
import lessons from "./lessons";
import auth from "./auth";
import navbar from "./navbar";
import users from "./users";
import questions from "./questions";
import loggers from "./loggers";

const reducers = combineReducers({
  lessons,
  auth,
  navbar,
  users,
  questions,
  loggers
});

export default reducers;
