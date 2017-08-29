// @flow

import type { Action } from "../actions/types";
import type { AuthState } from "../types";

const initialState: AuthState = {
  loggedIn: false,
  loaded: false,
  current: null
};

export default function user(
  state: AuthState = initialState,
  action: Action
): AuthState {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        loggedIn: !state.loggedIn,
        current: {
          id: "abcd1234",
          uid: "buser",
          firstName: "Backdoor",
          lastName: "User",
          displayName: "Backdoor",
          role: "instructor"
        }
      };
    case "CHECK_LOGIN_FULFILLED":
      return {
        ...state,
        loggedIn: true,
        loaded: true,
        current: action.payload.data
      };
    case "CHECK_LOGIN_REJECTED":
      return {
        ...state,
        loggedIn: false,
        loaded: true,
        current: null
      };
    default:
      return state;
  }
}
