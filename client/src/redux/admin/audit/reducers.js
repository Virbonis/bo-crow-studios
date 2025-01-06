import actions from './actions'

const initialState = {
  data: [],
  select_task: [],
  data_Hist: [],
  loading: false,
  loading_Hist: false,
}

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.CLEAN_UP_POST:
      return {
        ...state,
        data: [],
      }
    case actions.CLEAN_UP_HIST:
      return {
        ...state,
        data_Hist: [],
      }
    default:
      return state
  }
}
