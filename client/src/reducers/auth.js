// @flow

import type { Action } from "../actions/types";
import type { AuthState } from "../types";

const initialState: AuthState = {
  loggedIn: true,
  firstName: null,
  lastName: null,
  displayName: null,
  cwl: null,
  role: "instructor"
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
        firstName: "Backdoor",
        lastName: "User",
        displayName: "Backdoor User",
        cwl: "buser",
        role: "instructor"
      };
    default:
      return state;
  }
}
