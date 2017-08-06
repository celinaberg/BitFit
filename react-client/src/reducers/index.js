// @flow

import { combineReducers } from 'redux'
import lessons from './lessons'
import auth from './auth'
import navbar from './navbar'
import users from './users'
import questions from './questions'

const reducers = combineReducers({
  lessons,
  auth,
  navbar,
  users,
  questions
})

export default reducers
