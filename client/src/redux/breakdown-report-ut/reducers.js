import actions from './actions'

const initialState = {
  loadingData_Post: false,
  data_Post: [],

  loadingData_Hist: false,
  data_Hist: [],
}

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.CLEAN_UP_POST:
      return { ...state, data_Post: [] }
    case actions.CLEAN_UP_HIST:
      return { ...state, data_Hist: [] }
    default:
      return state
  }
}
