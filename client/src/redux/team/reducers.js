import actions from './actions'

const initialState = {
  data: [],
  detail_team: '',
  loading: false,
  loadingSearch: false,
  select_in_addmatch_home: [],
  select_in_addmatch_away: [],
  select_in_standings: [],
  select_in_knockouts_team1: [],
  select_in_knockouts_team2: [],
  select_in_outright: [],
  select_in_mapping_team: [],
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
