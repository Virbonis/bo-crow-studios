import actions from './actions'

const initialState = {
  loadingData: false,
  data: [],
  dailyStatementData: [],
  betSummaryData: [],
  betListData: [],
  betListRunningData: [],
}

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.CLEAN_UP:
      return initialState
    case actions.CLEAN_UP_LIST:
      return { ...state, [`dataList_${action.payload.bet_id}`]: [] }
    case actions.CLEAN_UP_DETAIL:
      return {
        ...state,
        dailyStatementData: [],
        betSummaryData: [],
        betListData: [],
        betListRunningData: [],
      }
    default:
      return state
  }
}
