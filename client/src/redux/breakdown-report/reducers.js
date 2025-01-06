import actions from './actions'

const initialState = {
  loadingData_Post: false,
  data_Post: [],
  betDetailData_Post: [],

  loadingData_Hist: false,
  data_Hist: [],
  betDetailData_Hist: [],
}

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.CLEAN_UP_HIST:
      return { ...state, data_Hist: [], betDetailData_Hist: [] }
    case actions.CLEAN_UP_POST:
      return { ...state, data_Post: [], betDetailData_Post: [] }
    case actions.CLEAN_UP_DETAIL:
      return { ...state, betDetailData_Post: [], betDetailData_Hist: [] }
    default:
      return state
  }
}
