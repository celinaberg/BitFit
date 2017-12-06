// @flow

import type { Action } from "../actions/types";
import type { LoggerState } from "../types";

const initialState: LoggerState = {
  fetching: false,
  fetched: false,
  loggers: [],
  error: null
};

export default function loggers(
  state: LoggerState = initialState,
  action: Action) {
  switch (action.type) {
    case "FETCH_LOGGERS_PENDING":
      return {
        ...state,
        fetching: true
      };
    case "FETCH_LOGGERS_FULFILLED":
      return {
        ...state,
        fetching: false,
        fetched: true,
        loggers: action.payload.data,
        error: null
      };
    case "FETCH_LOGGERS_REJECTED":
      return {
        ...state,
        fetching: false,
        error: action.payload
      };
    default:
      return state;
  }
}
