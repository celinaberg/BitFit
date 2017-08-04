const lessons = (state = [], action) => {
  switch (action.type) {
    case 'ADD_LESSON':
      return [
        ...state,
        {
          id: action.id,
          text: action.text
        }
      ]
    default:
      return state
  }
}

export default lessons
