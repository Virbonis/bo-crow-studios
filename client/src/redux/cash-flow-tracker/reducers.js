import actions from './actions'

const initialState = {
  data_Post: [],
  loading_Post: false,

  data_Hist: [],
  loading_Hist: false,
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
