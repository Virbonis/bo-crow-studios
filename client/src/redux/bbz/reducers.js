import actions from './actions'

const initialState = {
  data_channel_monitor: [],
  data_match_list: [],
  data_action_log: [],
  data_market: [],
  data_market_log: [],
  data_incident: [],
}

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.CLEAN_UP_CHANNEL_MONITOR:
      return { ...state, data_channel_monitor: [] }
    case actions.CLEAN_UP_MATCH_LIST:
      return { ...state, data_match_list: [] }
    case actions.CLEAN_UP_ACTION_LOG:
      return { ...state, data_action_log: [] }
    case actions.CLEAN_UP_MARKET:
      return { ...state, data_market: [] }
    case actions.CLEAN_UP_MARKET_LOG:
      return { ...state, data_market_log: [] }
    case actions.CLEAN_UP_INCIDENT:
      return { ...state, data_incident: [] }
    case actions.CLEAN_UP:
      return initialState
    default:
      return state
  }
}
