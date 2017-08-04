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
