// @flow

import type { Action } from '../actions/types';

type State = {
  isOpen: bool
}

const initialState:State = {
  isOpen: false
}

const navbar = (state:State=initialState, action:Action) => {
  switch (action.type) {
    case 'TOGGLE_NAVBAR':
      return {...state, isOpen: !state.isOpen}
    default:
      return state
  }
}

export default navbar
