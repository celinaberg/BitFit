// @flow

import type { Action } from './types';
import type { Question } from '../types';

import axios from 'axios';
import RichTextEditor from 'react-rte';

export const fetchLessons = ():Action => {
  return {
    type: 'FETCH_LESSONS',
    payload: axios.get('https://127.0.0.1:4343/api/topics')
  }
}

export const updateNewLesson = (title:string, background:RichTextEditor):Action => {
  return {
    type: 'UPDATE_NEW_LESSON',
    payload: {
      title,
      background
    }
  }
}

export const saveNewLesson = (title:string, background:string):Action => {
  return {
    type: 'SAVE_NEW_LESSON',
    payload: axios.post('https://127.0.0.1:4343/api/topics', {
      title,
      background
    })
  }
}

export const saveLesson = (id:string, title:string, background:string):Action => {
  return {
    type: 'SAVE_LESSON',
    payload: axios.put('https://127.0.0.1:4343/api/topics/' + id, {
      title,
      background
    })
  }
}

export const logIn = ():Action => {
  return {
    type: 'LOGIN'
  }
}

export const toggleNavBar = ():Action => {
  return {
    type: 'TOGGLE_NAVBAR'
  }
}

export const fetchUsers = ():Action => {
  return {
    type: 'FETCH_USERS',
    payload: axios.get('https://127.0.0.1:4343/api/users')
  }
}

export const deleteUser = (id:string):Action => {
  return {
    type: 'DELETE_USER',
    payload: axios.delete('https://127.0.0.1:4343/api/users/'+id)
  }
}

export const fetchQuestions = ():Action => {
  return {
    type: 'FETCH_QUESTIONS',
    payload: axios.get('https://127.0.0.1:4343/api/questions')
  }
}

export const saveQuestion = (question:Question):Action => {
  return {
    type: 'SAVE_QUESTION',
    payload: axios.post('https://127.0.0.1:4343/api/questions/'+question.id, question)
  }
}
