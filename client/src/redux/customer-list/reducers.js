import actions from './actions'

const initialState = {
  data: [],
  dataDelayBet: [],
  editCustomerData: {},
  uplineData: [],
  limitProfile: [],
  betLimitData: {},
  betLimitDataBySport: [],
  betLimitLogData: [],
  vipLogData: [],
  loading: false,
  loadingExport: false,
  loadingDrawer: false,
  loadingDelayBet: false,
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
