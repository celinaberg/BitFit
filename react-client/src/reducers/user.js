const initialState = {
  loggedIn: false,
  firstName: null,
  lastName: null,
  displayName: null,
  cwl: null
}

const user = (state=initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {...state, loggedIn: !state.loggedIn}
    default:
      return state
  }
}

export default user
