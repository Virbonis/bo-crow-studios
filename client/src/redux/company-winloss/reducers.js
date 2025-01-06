import actions from './actions'

const initialState = {
  dataCash_Hist: [],
  dataDetail_Hist: [],

  dataCash_Post: [],
  dataDetail_Post: [],
}

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.CLEAN_UP_POST:
      return { ...state, dataCash_Post: [], dataDetail_Post: [] }
    case actions.CLEAN_UP_HIST:
      return { ...state, dataCash_Hist: [], dataDetail_Hist: [] }
    default:
      return state
  }
}
