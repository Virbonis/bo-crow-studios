import actions from './actions'

const initialState = {
  loading_data_Hist: false,
  data_ledger_Hist: [],
  data_ledger_detail_Hist: [],

  loading_data_Post: false,
  data_ledger_Post: [],
  data_ledger_detail_Post: [],
}

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.CLEAN_UP_HIST:
      return {
        ...state,
        data_ledger_Hist: [],
        data_ledger_detail_Hist: [],
      }
    case actions.CLEAN_UP_POST:
      return {
        ...state,
        data_ledger_Post: [],
        data_ledger_detail_Post: [],
      }
    case actions.CLEAN_UP_DETAIL:
      return {
        ...state,
        data_ledger_detail_Hist: [],
        data_ledger_detail_Post: [],
      }
    default:
      return state
  }
}
