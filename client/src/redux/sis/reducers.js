import actions from './actions'

const initialState = {
  loadingData: false,
  loadingDetail: false,
  data_action_log: [],
  data_action_log_detail: [],
  data_market: [],
  data_market_log: [],
  data_match_list: [],
}

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.CLEAN_UP:
      return initialState
    case actions.CLEAN_UP_ACTION_LOG:
      return { ...state, data_action_log: [] }
    case actions.CLEAN_UP_ACTION_LOG_DETAIL:
      return { ...state, data_action_log_detail: [] }
    case actions.CLEAN_UP_MARKET:
      return { ...state, data_market: [] }
    case actions.CLEAN_UP_MARKET_LOG:
      return { ...state, data_market_log: [] }
    case actions.CLEAN_UP_MATCH_LIST:
      return { ...state, data_match_list: [] }
    default:
      return state
  }
}
