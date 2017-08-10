// @flow

import type { Action } from '../actions/types';
import type { QuestionState } from '../types';

const initialState:QuestionState = {
  fetching: false,
  fetched: false,
  questions: [],
  error: null
}

const questions = (state:QuestionState=initialState, action:Action) => {
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
    case 'SAVE_QUESTION':
      return {
        ...state,
        error: action.payload
      }
    default:
      return state
  }
}

export default questions
