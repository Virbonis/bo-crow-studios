import actions from './actions'

const initialState = {
  loading: false,
  data: [],
  select: [],
  user: [],
  team: [],
  league: [],
  total_data_league: 0,
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
