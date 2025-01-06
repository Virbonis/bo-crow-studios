import actions from './actions'

const initialState = {
  data_Hist: [],
  dataTotal_Hist: 0,
  dataResultHeader_Hist: {},
  betDetailData_Hist: [],
  betDetailTotal_Hist: 0,
  betDetailSummary_Hist: {},
  loading_Hist: false,

  data_Post: [],
  dataTotal_Post: 0,
  dataResultHeader_Post: {},
  betDetailData_Post: [],
  betDetailTotal_Post: 0,
  betDetailSummary_Post: {},
  loading_Post: false,
}

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.CLEAN_UP_HIST:
      return {
        ...state,
        data_Hist: [],
        dataResultHeader_Hist: {},
        betDetailData_Hist: [],
        betDetailSummary_Hist: {},
      }
    case actions.CLEAN_UP_POST:
      return {
        ...state,
        data_Post: [],
        dataResultHeader_Post: {},
        betDetailData_Post: [],
        betDetailSummary_Post: {},
      }
    case actions.CLEAN_UP_DETAIL:
      return {
        ...state,
        betDetailData_Hist: [],
        betDetailSummary_Hist: {},
        betDetailData_Post: [],
        betDetailSummary_Post: {},
      }
    default:
      return state
  }
}
