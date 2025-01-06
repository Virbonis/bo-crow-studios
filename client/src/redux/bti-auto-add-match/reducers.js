import actions from './actions'

const initialState = {
  loading_league_unmapped: false,
  loading_league_mapped: false,
  select_league_unmapped: [],
  select_league_mapped: [],

  loading_unmapped: false,
  loading_mapped: false,
  data_unmapped: [],
  data_mapped: [],
}

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.CLEAN_UP:
      return initialState
    case actions.CLEAR_TABLE_UNMAPPED:
      return { ...state, data_unmapped: [] }
    case actions.CLEAR_TABLE_MAPPED:
      return { ...state, data_mapped: [] }
    default:
      return state
  }
}
