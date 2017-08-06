// @flow
'use strict';

import type { Action } from '../actions/types';
import type { User } from '../types';

type State = {
  fetching: bool,
  fetched: bool,
  users: Array<User>,
  error: null
}

const initialState:State = {
  fetching: false,
  fetched: false,
  users: [],
  error: null
}

const users = (state:State=initialState, action:Action) => {
  switch (action.type) {
    case 'FETCH_USERS_PENDING':
      return {
        ...state,
        fetching: true
      }
    case 'FETCH_USERS_FULFILLED':
      return {
        ...state,
        fetching: false,
        fetched: true,
        users: action.payload.data,
        error: null
      }
    case 'FETCH_USERS_REJECTED':
      return {
        ...state,
        fetching: false,
        error: action.payload
      }
    default:
      return state
  }
}

export default users
