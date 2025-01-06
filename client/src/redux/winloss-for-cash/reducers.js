import actions from './actions'

const initialState = {
  loadingData_Hist: false,
  data_Hist: [],
  dataDetail_Hist: [],

  loadingData_Post: false,
  data_Post: [],
  dataDetail_Post: [],
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
