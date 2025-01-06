import actions from './actions'

const initialState = {
  loading: false,
  max_line: 0,
  ibc: {},
  glive_ibc: {},
  glive_sbo: {},
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
