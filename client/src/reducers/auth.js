// @flow

import type { Action } from "../actions/types";
import type { AuthState } from "../types";

const initialState: AuthState = {
  loggedIn: true,
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
    default:
      return state;
  }
}
