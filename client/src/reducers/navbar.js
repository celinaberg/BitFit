// @flow

import type { Action } from "../actions/types";
import type { NavBarState } from "../types";

const initialState: NavBarState = {
  isOpen: false
};

export default function navbar(
  state: NavBarState = initialState,
  action: Action
): NavBarState {
  switch (action.type) {
    case "TOGGLE_NAVBAR":
      return { ...state, isOpen: !state.isOpen };
    default:
      return state;
  }
}
