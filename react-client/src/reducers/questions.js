// @flow
'use strict';

import type { Action } from '../actions/types';
import type { Question } from '../types';

type State = {
  fetching: bool,
  fetched: bool,
  questions: Array<Question>,
  error: null
}

const initialState:State = {
  fetching: false,
  fetched: false,
  questions: [],
  error: null
}

const questions = (state:State=initialState, action:Action) => {
  switch (action.type) {
    case 'FETCH_QUESTIONS_PENDING':
      return {
        ...state,
        fetching: true
      }
    case 'FETCH_QUESTIONS_FULFILLED':
      return {
        ...state,
        fetching: false,
        fetched: true,
        questions: action.payload.data,
        error: null
      }
    case 'FETCH_QUESTIONS_REJECTED':
      return {
        ...state,
        fetching: false,
        error: action.payload
      }
    default:
      return state
  }
}

export default questions
