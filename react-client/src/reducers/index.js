import { combineReducers } from 'redux'
import lessons from './lessons'
import auth from './auth'
import navbar from './navbar'
import users from './users'

const reducers = combineReducers({
  lessons,
  auth,
  navbar,
  users
})

export default reducers
