const initialState = {
  isOpen: false
}

const navbar = (state=initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_NAVBAR':
      return {...state, isOpen: !state.isOpen}
    default:
      return state
  }
}

export default navbar
