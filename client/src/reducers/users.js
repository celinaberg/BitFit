// @flow

import type { Action } from "../actions/types";
import type { UserState } from "../types";

const initialState: UserState = {
  fetching: false,
  fetched: false,
  users: [],
  error: null
};

export default function users(state: UserState = initialState, action: Action) {
  switch (action.type) {
    case "FETCH_USERS_PENDING":
      return {
        ...state,
        fetching: true
      };
    case "FETCH_USERS_FULFILLED":
      return {
        ...state,
        fetching: false,
        fetched: true,
        users: action.payload.data,
        error: null
      };
    case "FETCH_USERS_REJECTED":
      return {
        ...state,
        fetching: false,
        error: action.payload
      };
    default:
      return state;
  }
}
