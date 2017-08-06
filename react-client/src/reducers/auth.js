// @flow
'use strict';

import type { Action } from '../actions/types';

type State = {
  loggedIn: bool,
  firstName: ?string,
  lastName: ?string,
  displayName: ?string,
  cwl: ?string,
  role: "student" | "teaching-assistant" | "instructor"
}

const initialState:State = {
  loggedIn: true,
  firstName: null,
  lastName: null,
  displayName: null,
  cwl: null,
  role: "instructor"
}

const user = (state:State=initialState, action:Action):State => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        loggedIn: !state.loggedIn,
        firstName: "Backdoor",
        lastName: "User",
        displayName: "Backdoor User",
        cwl: "buser",
        role: "instructor"
      }
    default:
      return state
  }
}

export default user
