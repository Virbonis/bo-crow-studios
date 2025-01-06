import actions from './actions'

const initialState = {
  data: {},
  editValue: {},
  loading: true,
}

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.EDIT:
      return { ...state, editValue: action.payload }
    case actions.CLEAN_UP:
      return initialState
    default:
      return state
  }
}