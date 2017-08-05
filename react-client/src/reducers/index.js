import { combineReducers } from 'redux'
import lessons from './lessons'
import auth from './auth'
import navbar from './navbar'

const reducers = combineReducers({
  lessons,
  auth,
  navbar
})

export default reducers
