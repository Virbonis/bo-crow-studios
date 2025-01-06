import actions from './actions'

const initialState = {
  select: [],
  select_by_sport: [],
}

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.CLEAN_UP:
      return initialState
    case actions.CLEAN_UP_BY_SPORT:
      return { ...state, select_by_sport: [] }
    default:
      return state
  }
}
