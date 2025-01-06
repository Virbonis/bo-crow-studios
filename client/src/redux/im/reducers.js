import actions from './actions'

const initialState = {
  loadingData: false,
  data_match_list: [],
  data_action_log: [],
  data_market: [],
}

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.CLEAN_UP_MATCH_LIST:
      return { ...state, data_match_list: [] }
    case actions.CLEAN_UP_ACTION_LOG:
      return { ...state, data_action_log: [] }
    case actions.CLEAN_UP_MARKET:
      return { ...state, data_market: [] }
    default:
      return state
  }
}
