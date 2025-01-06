import actions from './actions'

const initialState = {
  loading_Hist: false,
  data_Hist: [],
  grandTotal_Hist: [],
  listTrader_Hist: [],
  listLeague_Hist: [],

  loading_Post: false,
  data_Post: [],
  grandTotal_Post: [],
  listTrader_Post: [],
  listLeague_Post: [],
}

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.CLEAN_UP_HIST:
      return {
        ...state,
        data_Hist: [],
        grandTotal_Hist: [],
        listTrader_Hist: [],
        listLeague_Hist: [],
      }
    case actions.CLEAN_UP_POST:
      return {
        ...state,
        data_Post: [],
        grandTotal_Post: [],
        listTrader_Post: [],
        listLeague_Post: [],
      }
    default:
      return state
  }
}
