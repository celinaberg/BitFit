const initialState = {
  fetching: false,
  fetched: false,
  questions: [],
  error: null
}
const questions = (state=initialState, action) => {
  switch (action.type) {
    case 'FETCH_QUESTIONS_PENDING':
      return {
        ...state,
        fetching: true
      }
    case 'FETCH_QUESTIONS_FULFILLED':
      return {
        ...state,
        fetching: false,
        fetched: true,
        questions: action.payload.data,
        error: null
      }
    case 'FETCH_QUESTIONS_REJECTED':
      return {
        ...state,
        fetching: false,
        error: action.payload
      }
    default:
      return state
  }
}

export default questions
