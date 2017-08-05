const initialState = {
  fetching: false,
  fetched: false,
  lessons: [],
  error: null
}

const lessons = (state=initialState, action) => {
  switch (action.type) {
    case 'FETCH_LESSONS_PENDING':
      return {
        ...state,
        fetching: true
      }
    case 'FETCH_LESSONS_FULFILLED':
      return {
        ...state,
        fetching: false,
        fetched: true,
        lessons: action.payload.data,
        error: null
      }
    case 'FETCH_LESSONS_REJECTED':
      return {
        ...state,
        fetching: false,
        error: action.payload
      }
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
