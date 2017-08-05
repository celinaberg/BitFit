const initialState = {
  loggedIn: true,
  firstName: null,
  lastName: null,
  displayName: null,
  cwl: null,
  role: "instructor"
}

const user = (state=initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        loggedIn: !state.loggedIn,
        firstName: "Backdoor",
        lastName: "User",
        displayName: "Backdoor User",
        cwl: "buser",
        role: "instructor"
      }
    default:
      return state
  }
}

export default user
