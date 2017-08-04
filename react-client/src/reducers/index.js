import { combineReducers } from 'redux'
import lessons from './lessons'
import user from './user'
import navbar from './navbar'

const reducers = combineReducers({
  lessons,
  user,
  navbar
})

export default reducers
