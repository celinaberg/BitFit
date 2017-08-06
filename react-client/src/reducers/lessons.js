// @flow

import type { Action } from '../actions/types';
import type { LessonState } from '../types';
import RichTextEditor from 'react-rte';

const initialState:LessonState = {
  fetching: false,
  fetched: false,
  lessons: [],
  error: null,
  new: {
    title: "",
    background: RichTextEditor.createEmptyValue()
  }
}

const lessons = (state:LessonState=initialState, action:Action):LessonState => {
  switch (action.type) {
    case 'FETCH_LESSONS_PENDING':
      return {
        ...state,
        fetching: true
      }
    case 'FETCH_LESSONS_FULFILLED':
      return {
        ...state,
        fetching: false,
        fetched: true,
        lessons: action.payload.data,
        error: null
      }
    case 'FETCH_LESSONS_REJECTED':
      return {
        ...state,
        fetching: false,
        error: action.payload
      }
    case 'UPDATE_NEW_LESSON':
      return {
        ...state,
        new: action.payload
      }
    case 'SAVE_NEW_LESSON_PENDING':
      return {
        ...state,
        fetching: true
      }
    case 'SAVE_NEW_LESSON_FULFILLED':
      return {
        ...state,
        fetching: false,
        lessons: [...state.lessons, action.payload.data],
        new: {
          title: "",
          background: RichTextEditor.createEmptyValue()
        }
      }
    case 'SAVE_NEW_LESSON_REJECTED':
      return {
        ...state,
        fetching: false
      }
    default:
      return state
  }
}

export default lessons
