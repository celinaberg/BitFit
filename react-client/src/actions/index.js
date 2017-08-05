import axios from 'axios';

export const fetchLessons = () => {
  return {
    type: 'FETCH_LESSONS',
    payload: axios.get('https://localhost:4343/api/topics')
  }
}

export const addLesson = text => {
  return {
    type: 'ADD_LESSON',
    text
  }
}

export const logIn = () => {
  return {
    type: 'LOGIN'
  }
}

export const toggleNavBar = () => {
  return {
    type: 'TOGGLE_NAVBAR'
  }
}

export const fetchUsers = () => {
  return {
    type: 'FETCH_USERS',
    payload: axios.get('https://localhost:4343/api/users')
  }
}
