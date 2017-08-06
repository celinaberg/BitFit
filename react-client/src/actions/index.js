import axios from 'axios';

export const fetchLessons = () => {
  return {
    type: 'FETCH_LESSONS',
    payload: axios.get('https://127.0.0.1:4343/api/topics')
  }
}

export const updateNewLesson = (title, background) => {
  return {
    type: 'UPDATE_NEW_LESSON',
    payload: {
      title,
      background
    }
  }
}

export const saveNewLesson = (title, background) => {
  return {
    type: 'SAVE_NEW_LESSON',
    payload: axios.post('https://127.0.0.1:4343/api/topics', {
      title,
      background
    })
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
    payload: axios.get('https://127.0.0.1:4343/api/users')
  }
}

export const deleteUser = (id) => {
  return {
    type: 'DELETE_USER',
    payload: axios.delete('https://127.0.0.1:4343/api/users/'+id)
  }
}
