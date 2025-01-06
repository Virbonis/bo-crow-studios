import actions from './actions'

const initialState = {
  select_league: [],
  select_league_gl: [],
  data_match: [],
  data_match_gl: [],
}

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.CLEAN_UP:
      return initialState
    default:
      return state
  }
}
